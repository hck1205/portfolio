import {
  AUTO_COMPLETE_CHANGE_EVENT,
  AUTO_COMPLETE_CLEAR_EVENT,
  AUTO_COMPLETE_ELEMENT_NAME,
  AUTO_COMPLETE_OBSERVED_ATTRIBUTES,
  AUTO_COMPLETE_OPEN_CHANGE_EVENT,
  AUTO_COMPLETE_OPTION_CHANGE_EVENT,
  AUTO_COMPLETE_OPTION_ELEMENT_NAME,
  AUTO_COMPLETE_SEARCH_EVENT,
  AUTO_COMPLETE_SELECT_EVENT
} from "./constants/AutoComplete.constants";
import {
  createAutoCompleteId,
  filterOptions,
  getAutoCompleteInputMode,
  getAutoCompleteSize,
  getAutoCompleteStatus,
  getAutoCompleteVariant,
  getNextEnabledOptionIndex,
  normalizeBooleanAttribute,
  parseOptions
} from "./dom/AutoComplete.dom";
import { DsAutoCompleteOption } from "./AutoCompleteOption";
import {
  applyAutoCompleteStyles,
  createAutoCompleteElements,
  syncInputMode,
  syncOptionList,
  type AutoCompleteElements
} from "./render/AutoComplete.render";
import type {
  AutoCompleteChangeDetail,
  AutoCompleteClearDetail,
  AutoCompleteInputMode,
  AutoCompleteOpenChangeDetail,
  AutoCompleteOpenChangeSource,
  AutoCompleteOption,
  AutoCompleteSearchDetail,
  AutoCompleteSelectDetail,
  AutoCompleteSize,
  AutoCompleteStatus,
  AutoCompleteVariant
} from "./types/AutoComplete.types";

export class DsAutoComplete extends HTMLElement {
  static observedAttributes = AUTO_COMPLETE_OBSERVED_ATTRIBUTES;

  private activeIndex = -1;
  private documentListenerAttached = false;
  private elements?: AutoCompleteElements;
  private filteredOptions: AutoCompleteOption[] = [];
  private hasOptions = false;
  private listboxId = createAutoCompleteId("listbox");
  private mutationObserver?: MutationObserver;
  private optionCache?: AutoCompleteOption[];
  private optionsCacheKey = "";
  private suppressAttributeRender = false;

  connectedCallback() {
    this.render();
    this.observeOptions();
    this.addEventListener(AUTO_COMPLETE_OPTION_CHANGE_EVENT, this.handleOptionChange);
  }

  disconnectedCallback() {
    this.detachDocumentListener();
    this.mutationObserver?.disconnect();
    this.removeEventListener(AUTO_COMPLETE_OPTION_CHANGE_EVENT, this.handleOptionChange);
  }

  attributeChangedCallback(name: string) {
    if (this.suppressAttributeRender) {
      return;
    }

    if (name === "options") {
      this.invalidateOptions();
    }

    this.render();
  }

  get allowClear() {
    return normalizeBooleanAttribute(this, "allow-clear", false);
  }

  set allowClear(value: boolean) {
    this.toggleAttribute("allow-clear", value);
  }

  get backfill() {
    return normalizeBooleanAttribute(this, "backfill", false);
  }

  set backfill(value: boolean) {
    this.toggleAttribute("backfill", value);
  }

  get defaultActiveFirstOption() {
    return normalizeBooleanAttribute(this, "default-active-first-option", true);
  }

  set defaultActiveFirstOption(value: boolean) {
    this.setAttribute("default-active-first-option", String(value));
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

  get inputMode(): AutoCompleteInputMode {
    return getAutoCompleteInputMode(this);
  }

  set inputMode(value: AutoCompleteInputMode) {
    this.setAttribute("input-mode", value);
  }

  get notFoundContent() {
    return this.getAttribute("not-found-content") ?? "검색 결과가 없습니다";
  }

  set notFoundContent(value: string) {
    this.setAttribute("not-found-content", value);
  }

  get open() {
    return normalizeBooleanAttribute(this, "open", false);
  }

  set open(value: boolean) {
    this.toggleAttribute("open", value);
  }

  get options() {
    return this.getAttribute("options") ?? "";
  }

  set options(value: string) {
    this.setAttribute("options", value);
  }

  get placeholder() {
    return this.getAttribute("placeholder") ?? "";
  }

  set placeholder(value: string) {
    this.setAttribute("placeholder", value);
  }

  get size(): AutoCompleteSize {
    return getAutoCompleteSize(this);
  }

  set size(value: AutoCompleteSize) {
    this.setAttribute("size", value);
  }

  get status(): AutoCompleteStatus | undefined {
    return getAutoCompleteStatus(this);
  }

  set status(value: AutoCompleteStatus | undefined) {
    this.syncNullableAttribute("status", value);
  }

  get value() {
    return this.getAttribute("value") ?? "";
  }

  set value(value: string) {
    this.setAttribute("value", value);
  }

  get variant(): AutoCompleteVariant {
    return getAutoCompleteVariant(this);
  }

  set variant(value: AutoCompleteVariant) {
    this.setAttribute("variant", value);
  }

  focus() {
    this.activeControl?.focus();
  }

  blur() {
    this.activeControl?.blur();
  }

  private handleInput = (event: Event) => {
    const control = event.target;

    if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)) {
      return;
    }

    this.activeIndex = -1;
    this.setValue(control.value, true);
    this.dispatchEvent(
      new CustomEvent<AutoCompleteSearchDetail>(AUTO_COMPLETE_SEARCH_EVENT, {
        bubbles: true,
        detail: {
          value: this.value
        }
      })
    );
    this.setOpen(this.hasOptions, "input");
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      this.moveActiveOption(event.key === "ArrowDown" ? 1 : -1);
      this.setOpen(this.hasOptions, "keyboard");
      return;
    }

    if (event.key === "Enter" && this.open && this.activeIndex >= 0) {
      event.preventDefault();
      this.selectOption(this.filteredOptions[this.activeIndex]);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      this.setOpen(false, "keyboard");
    }
  };

  private handleClear = () => {
    if (this.disabled || !this.value) {
      return;
    }

    const previousValue = this.value;

    this.setValue("", true);
    this.setOpen(false, "clear");
    this.dispatchEvent(
      new CustomEvent<AutoCompleteClearDetail>(AUTO_COMPLETE_CLEAR_EVENT, {
        bubbles: true,
        detail: {
          previousValue
        }
      })
    );
    this.focus();
  };

  private handleOptionPointerDown = (event: PointerEvent) => {
    event.preventDefault();
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const optionElement = target.closest<HTMLElement>(".ds-auto-complete__option");

    if (!optionElement) {
      return;
    }

    const index = Number(optionElement.dataset.index);

    this.selectOption(this.filteredOptions[index]);
  };

  private handleDocumentPointerDown = (event: PointerEvent) => {
    if (!this.open || event.composedPath().includes(this)) {
      return;
    }

    this.setOpen(false, "outside");
  };

  private handleOptionChange = () => {
    this.invalidateOptions();
    this.render();
  };

  private render() {
    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
    this.syncOptions();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createAutoCompleteElements({
      onClear: this.handleClear,
      onInput: this.handleInput,
      onKeyDown: this.handleKeyDown,
      onOptionPointerDown: this.handleOptionPointerDown
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyAutoCompleteStyles(shadowRoot);
  }

  private observeOptions() {
    if (this.mutationObserver) {
      return;
    }

    this.mutationObserver = new MutationObserver(() => {
      this.invalidateOptions();
      this.render();
    });
    this.mutationObserver.observe(this, {
      childList: true,
      subtree: true
    });
  }

  private syncAttributes() {
    if (!this.elements) {
      return;
    }

    const status = this.status;

    this.setAttributeIfChanged("size", this.size);
    this.setAttributeIfChanged("variant", this.variant);
    this.syncNullableAttribute("status", status);
    this.elements.inputElement.value = this.value;
    this.elements.textareaElement.value = this.value;
    this.elements.inputElement.placeholder = this.placeholder;
    this.elements.textareaElement.placeholder = this.placeholder;
    this.elements.inputElement.disabled = this.disabled;
    this.elements.textareaElement.disabled = this.disabled;
    this.elements.clearButtonElement.hidden = !this.allowClear || !this.value || this.disabled;
    this.elements.popupElement.id = this.listboxId;
    this.elements.popupElement.hidden = !this.open || !this.hasOptions;
    this.elements.inputElement.setAttribute("role", "combobox");
    this.elements.textareaElement.setAttribute("role", "combobox");
    this.syncControlAria(this.elements.inputElement);
    this.syncControlAria(this.elements.textareaElement);
    syncInputMode(this.elements, this.inputMode);
    this.syncDocumentListener();
  }

  private syncOptions() {
    if (!this.elements) {
      return;
    }

    const options = this.getOptions();

    this.hasOptions = options.length > 0;
    this.filteredOptions = filterOptions(options, this.value, this.filterOption);

    if (this.defaultActiveFirstOption && this.activeIndex < 0) {
      this.activeIndex = getNextEnabledOptionIndex(this.filteredOptions, -1, 1);
    }

    if (!this.filteredOptions[this.activeIndex] || this.filteredOptions[this.activeIndex]?.disabled) {
      this.activeIndex = getNextEnabledOptionIndex(this.filteredOptions, -1, 1);
    }

    syncOptionList({
      activeIndex: this.activeIndex,
      elements: this.elements,
      emptyText: this.notFoundContent,
      getOptionId: (index) => this.getOptionId(index),
      options: this.filteredOptions,
      selectedValue: this.value
    });
    this.elements.popupElement.hidden = !this.open || !this.hasOptions;
    this.syncControlAria(this.elements.inputElement);
    this.syncControlAria(this.elements.textareaElement);
  }

  private syncControlAria(control: HTMLInputElement | HTMLTextAreaElement) {
    const activeOptionId = this.open && this.activeIndex >= 0 ? this.getOptionId(this.activeIndex) : "";

    control.setAttribute("aria-autocomplete", "list");
    control.setAttribute("aria-controls", this.listboxId);
    control.setAttribute("aria-expanded", String(this.open));

    if (activeOptionId) {
      control.setAttribute("aria-activedescendant", activeOptionId);
    } else {
      control.removeAttribute("aria-activedescendant");
    }
  }

  private moveActiveOption(direction: 1 | -1) {
    const nextIndex = getNextEnabledOptionIndex(this.filteredOptions, this.activeIndex, direction);

    if (nextIndex < 0) {
      return;
    }

    this.activeIndex = nextIndex;

    if (this.backfill) {
      const option = this.filteredOptions[nextIndex];

      if (option) {
        this.syncControlValue(option.value);
      }
    }

    this.syncOptions();
  }

  private selectOption(option: AutoCompleteOption | undefined) {
    if (!option || option.disabled) {
      return;
    }

    this.setValue(option.value, true);
    this.setOpen(false, "option");
    this.dispatchEvent(
      new CustomEvent<AutoCompleteSelectDetail>(AUTO_COMPLETE_SELECT_EVENT, {
        bubbles: true,
        detail: {
          option,
          value: option.value
        }
      })
    );
    this.focus();
  }

  private setValue(value: string, emitChange: boolean) {
    if (this.value === value) {
      this.syncControlValue(value);
      this.syncOptions();
      return;
    }

    this.suppressAttributeRender = true;
    this.value = value;
    this.suppressAttributeRender = false;
    this.syncControlValue(value);
    this.syncOptions();

    if (emitChange) {
      this.dispatchEvent(
        new CustomEvent<AutoCompleteChangeDetail>(AUTO_COMPLETE_CHANGE_EVENT, {
          bubbles: true,
          detail: {
            value
          }
        })
      );
    }
  }

  private syncControlValue(value: string) {
    if (!this.elements) {
      return;
    }

    this.elements.inputElement.value = value;
    this.elements.textareaElement.value = value;
    this.elements.clearButtonElement.hidden = !this.allowClear || !value || this.disabled;
  }

  private setOpen(open: boolean, source: AutoCompleteOpenChangeSource) {
    if (this.disabled && open) {
      return;
    }

    if (this.open === open) {
      this.render();
      return;
    }

    this.open = open;
    this.dispatchEvent(
      new CustomEvent<AutoCompleteOpenChangeDetail>(AUTO_COMPLETE_OPEN_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          open,
          source
        }
      })
    );
  }

  private getOptions() {
    const cacheKey = `${this.options}::${this.childElementCount}`;

    if (this.optionCache && this.optionsCacheKey === cacheKey) {
      return this.optionCache;
    }

    const attributeOptions = parseOptions(this.options);
    const childOptions = Array.from(this.querySelectorAll(AUTO_COMPLETE_OPTION_ELEMENT_NAME)).flatMap((element) => {
      return element instanceof DsAutoCompleteOption ? element.toOption() ?? [] : [];
    });

    this.optionsCacheKey = cacheKey;
    this.optionCache = [...attributeOptions, ...childOptions];

    return this.optionCache;
  }

  private invalidateOptions() {
    this.optionCache = undefined;
    this.optionsCacheKey = "";
  }

  private getOptionId(index: number) {
    return `${this.listboxId}-option-${index}`;
  }

  private get activeControl() {
    if (!this.elements) {
      return undefined;
    }

    return this.inputMode === "textarea" ? this.elements.textareaElement : this.elements.inputElement;
  }

  private syncDocumentListener() {
    if (this.open && !this.documentListenerAttached) {
      document.addEventListener("pointerdown", this.handleDocumentPointerDown);
      this.documentListenerAttached = true;
      return;
    }

    if (!this.open) {
      this.detachDocumentListener();
    }
  }

  private detachDocumentListener() {
    if (!this.documentListenerAttached) {
      return;
    }

    document.removeEventListener("pointerdown", this.handleDocumentPointerDown);
    this.documentListenerAttached = false;
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
}

declare global {
  interface HTMLElementTagNameMap {
    [AUTO_COMPLETE_ELEMENT_NAME]: DsAutoComplete;
  }
}
