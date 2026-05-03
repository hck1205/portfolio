import {
  MENTION_OPTION_CHANGE_EVENT,
  MENTION_OPTION_ELEMENT_NAME,
  MENTIONS_CHANGE_EVENT,
  MENTIONS_CLEAR_EVENT,
  MENTIONS_OBSERVED_ATTRIBUTES,
  MENTIONS_SEARCH_EVENT,
  MENTIONS_SELECT_EVENT
} from "./constants/Mentions.constants";
import {
  getMentionsPlacement,
  getMentionsPrefixes,
  getMentionsSize,
  getMentionsStatus,
  getMentionsVariant,
  getPositiveIntegerAttribute,
  normalizeBooleanAttribute
} from "./dom/Mentions.dom";
import {
  applyMentionSelection,
  filterMentionOptions,
  getMentionSearchState,
  getNextActiveOptionIndex
} from "./logic/Mentions.logic";
import { applyMentionsStyles, createMentionsElements, syncMentionsElements, type MentionsElements } from "./render/Mentions.render";
import { DsMentionOption } from "./MentionOption";
import type {
  MentionOptionData,
  MentionSearchState,
  MentionsChangeDetail,
  MentionsClearDetail,
  MentionsPlacement,
  MentionsSearchDetail,
  MentionsSelectDetail,
  MentionsSize,
  MentionsStatus,
  MentionsVariant
} from "./types/Mentions.types";

export class DsMentions extends HTMLElement {
  static observedAttributes = MENTIONS_OBSERVED_ATTRIBUTES;

  private activeIndex = -1;
  private elements?: MentionsElements;
  private internalValue = "";
  private mentionOptionsCache?: MentionOptionData[];
  private optionObserver?: MutationObserver;
  private searchState?: MentionSearchState;

  connectedCallback() {
    this.addEventListener(MENTION_OPTION_CHANGE_EVENT, this.handleOptionChange);
    this.observeOptionChanges();

    if (!this.internalValue) {
      this.internalValue = this.getAttribute("value") ?? this.getAttribute("default-value") ?? "";
    }

    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener(MENTION_OPTION_CHANGE_EVENT, this.handleOptionChange);
    this.optionObserver?.disconnect();
  }

  attributeChangedCallback(name: string) {
    if (name === "value") {
      this.internalValue = this.getAttribute("value") ?? "";
    }

    this.render();
  }

  get allowClear() {
    return normalizeBooleanAttribute(this, "allow-clear", false);
  }

  set allowClear(value: boolean) {
    this.toggleAttribute("allow-clear", value);
  }

  get block() {
    return normalizeBooleanAttribute(this, "block", false);
  }

  set block(value: boolean) {
    this.toggleAttribute("block", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get filterOption() {
    return normalizeBooleanAttribute(this, "filter-option", true);
  }

  set filterOption(value: boolean) {
    this.setAttribute("filter-option", String(value));
  }

  get placement(): MentionsPlacement {
    return getMentionsPlacement(this);
  }

  set placement(value: MentionsPlacement) {
    this.setAttribute("placement", value);
  }

  get readonly() {
    return normalizeBooleanAttribute(this, "readonly", false);
  }

  set readonly(value: boolean) {
    this.toggleAttribute("readonly", value);
  }

  get rows() {
    return getPositiveIntegerAttribute(this, "rows", 1);
  }

  set rows(value: number) {
    this.setAttribute("rows", String(value));
  }

  get size(): MentionsSize {
    return getMentionsSize(this);
  }

  set size(value: MentionsSize) {
    this.setAttribute("size", value);
  }

  get split() {
    return this.getAttribute("split") ?? " ";
  }

  set split(value: string) {
    this.setAttribute("split", value);
  }

  get status(): MentionsStatus | undefined {
    return getMentionsStatus(this);
  }

  set status(value: MentionsStatus | undefined) {
    this.syncNullableAttribute("status", value);
  }

  get value() {
    return this.internalValue;
  }

  set value(value: string) {
    this.internalValue = value;
    this.setAttribute("value", value);
  }

  get variant(): MentionsVariant {
    return getMentionsVariant(this);
  }

  set variant(value: MentionsVariant) {
    this.setAttribute("variant", value);
  }

  focus(options?: FocusOptions) {
    this.elements?.controlElement.focus(options);
  }

  blur() {
    this.elements?.controlElement.blur();
  }

  private handleClear = () => {
    if (this.disabled || this.readonly || !this.internalValue) {
      return;
    }

    const previousValue = this.internalValue;

    this.internalValue = "";
    this.closePopup();
    this.dispatchEvent(
      new CustomEvent<MentionsClearDetail>(MENTIONS_CLEAR_EVENT, {
        bubbles: true,
        detail: {
          previousValue
        }
      })
    );
    this.dispatchChange();
    this.render();
    this.elements?.controlElement.focus();
  };

  private handleInput = (event: Event) => {
    const controlElement = event.target as HTMLTextAreaElement;

    this.internalValue = controlElement.value;
    this.updateSearchState();
    this.dispatchChange(event);
    this.render();
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    const options = this.filteredOptions;

    if (!this.searchState || options.length === 0) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      this.activeIndex = getNextActiveOptionIndex({
        currentIndex: this.activeIndex,
        direction: event.key === "ArrowDown" ? 1 : -1,
        options
      });
      this.render();
      return;
    }

    if (event.key === "Enter" || event.key === "Tab") {
      const option = options[this.activeIndex];

      if (option && !option.disabled) {
        event.preventDefault();
        this.selectOption(option);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      this.closePopup();
      this.render();
    }
  };

  private handleOptionChange = (event: Event) => {
    if (event.target instanceof DsMentionOption && event.target.parentElement === this) {
      this.invalidateMentionOptions();
      this.render();
    }
  };

  private handleOptionPointerDown = (index: number, event: PointerEvent) => {
    event.preventDefault();
    const option = this.filteredOptions[index];

    if (option && !option.disabled) {
      this.selectOption(option);
    }
  };

  private render() {
    if (!this.isConnected) {
      return;
    }

    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
    this.syncStructure();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createMentionsElements({
      onClear: this.handleClear,
      onInput: this.handleInput,
      onKeyDown: this.handleKeyDown
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyMentionsStyles(shadowRoot);
  }

  private syncAttributes() {
    const multiline = this.rows > 1 || normalizeBooleanAttribute(this, "autosize", false);

    this.setAttributeIfChanged("data-multiline", String(multiline));
    this.setAttributeIfChanged("placement", this.placement);
    this.setAttributeIfChanged("size", this.size);
    this.setAttributeIfChanged("variant", this.variant);
    this.toggleAttributeIfChanged("block", this.block);

    const status = this.status;

    if (status) {
      this.setAttributeIfChanged("status", status);
    } else {
      this.removeAttribute("status");
    }
  }

  private syncStructure() {
    if (!this.elements) {
      return;
    }

    const options = this.filteredOptions;

    if (this.activeIndex >= options.length || options[this.activeIndex]?.disabled) {
      this.activeIndex = getNextActiveOptionIndex({
        currentIndex: -1,
        direction: 1,
        options
      });
    }

    syncMentionsElements({
      activeIndex: this.activeIndex,
      allowClear: this.allowClear,
      disabled: this.disabled,
      elements: this.elements,
      maxRows: normalizeBooleanAttribute(this, "autosize", false)
        ? getPositiveIntegerAttribute(this, "max-rows", this.rows)
        : undefined,
      name: this.getAttribute("name") ?? "",
      notFoundContent: this.getAttribute("not-found-content") ?? "No data",
      onClear: this.handleClear,
      onInput: this.handleInput,
      onKeyDown: this.handleKeyDown,
      onOptionPointerDown: this.handleOptionPointerDown,
      open: Boolean(this.searchState),
      options,
      placeholder: this.getAttribute("placeholder") ?? "",
      readonly: this.readonly,
      required: normalizeBooleanAttribute(this, "required", false),
      rows: this.rows,
      value: this.internalValue
    });
  }

  private observeOptionChanges() {
    if (this.optionObserver) {
      return;
    }

    this.optionObserver = new MutationObserver(() => {
      this.invalidateMentionOptions();
      this.render();
    });
    this.optionObserver.observe(this, {
      childList: true
    });
  }

  private updateSearchState() {
    const controlElement = this.elements?.controlElement;
    const caretIndex = controlElement?.selectionStart ?? this.internalValue.length;

    this.searchState = getMentionSearchState(this.internalValue, caretIndex, getMentionsPrefixes(this));
    this.activeIndex = -1;

    if (this.searchState) {
      this.dispatchEvent(
        new CustomEvent<MentionsSearchDetail>(MENTIONS_SEARCH_EVENT, {
          bubbles: true,
          detail: this.searchState
        })
      );
    }
  }

  private selectOption(option: MentionOptionData) {
    const controlElement = this.elements?.controlElement;

    if (!this.searchState || !controlElement) {
      return;
    }

    const result = applyMentionSelection({
      option,
      search: this.searchState,
      selectionEnd: controlElement.selectionStart ?? this.internalValue.length,
      split: this.split,
      value: this.internalValue
    });

    const prefix = this.searchState.prefix;

    this.internalValue = result.value;
    this.closePopup();
    this.dispatchChange();
    this.dispatchEvent(
      new CustomEvent<MentionsSelectDetail>(MENTIONS_SELECT_EVENT, {
        bubbles: true,
        detail: {
          option,
          prefix,
          value: this.internalValue
        }
      })
    );
    this.render();
    queueMicrotask(() => {
      controlElement.focus();
      controlElement.setSelectionRange(result.caretIndex, result.caretIndex);
    });
  }

  private closePopup() {
    this.searchState = undefined;
    this.activeIndex = -1;
  }

  private dispatchChange(nativeEvent?: Event) {
    this.dispatchEvent(
      new CustomEvent<MentionsChangeDetail>(MENTIONS_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          nativeEvent,
          value: this.internalValue
        }
      })
    );
  }

  private get mentionOptions() {
    if (this.mentionOptionsCache) {
      return this.mentionOptionsCache;
    }

    this.mentionOptionsCache = Array.from(this.children)
      .filter((child): child is DsMentionOption => child.localName === MENTION_OPTION_ELEMENT_NAME)
      .map((option) => ({
        disabled: option.disabled,
        label: option.label,
        value: option.value
      }))
      .filter((option) => option.value);

    return this.mentionOptionsCache;
  }

  private get filteredOptions() {
    if (!this.searchState) {
      return [];
    }

    return filterMentionOptions(this.mentionOptions, this.searchState.query, this.filterOption);
  }

  private syncNullableAttribute(name: string, value: string | undefined) {
    if (value) {
      this.setAttributeIfChanged(name, value);
      return;
    }

    this.removeAttribute(name);
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }

  private toggleAttributeIfChanged(name: string, force: boolean) {
    if (this.hasAttribute(name) !== force) {
      this.toggleAttribute(name, force);
    }
  }

  private invalidateMentionOptions() {
    this.mentionOptionsCache = undefined;
  }
}
