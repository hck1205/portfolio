import {
  SELECT_CHANGE_EVENT,
  SELECT_CLEAR_EVENT,
  SELECT_ELEMENT_NAME,
  SELECT_OBSERVED_ATTRIBUTES,
  SELECT_OPEN_CHANGE_EVENT,
  SELECT_OPTION_CHANGE_EVENT,
  SELECT_OPTION_ELEMENT_NAME,
  SELECT_SELECT_EVENT
} from "./constants/Select.constants";
import {
  createSelectId,
  filterSelectOptions,
  getNextEnabledOptionIndex,
  getSelectMode,
  getSelectPlacement,
  getSelectSize,
  getSelectStatus,
  getSelectVariant,
  normalizeBooleanAttribute,
  parseSelectOptions,
  parseSelectValue,
  serializeSelectValue,
  syncNullableAttribute
} from "./dom/Select.dom";
import { DsSelectOption } from "./SelectOption";
import { applySelectStyles, createSelectElements, syncSelectElements, type SelectElements } from "./render/Select.render";
import type {
  SelectChangeDetail,
  SelectClearDetail,
  SelectMode,
  SelectOpenChangeDetail,
  SelectOpenChangeDetail as SelectOpenDetail,
  SelectOption,
  SelectPlacement,
  SelectSelectDetail,
  SelectSize,
  SelectStatus,
  SelectVariant
} from "./types/Select.types";

export class DsSelect extends HTMLElement {
  static observedAttributes = SELECT_OBSERVED_ATTRIBUTES;

  private activeIndex = -1;
  private documentListenerAttached = false;
  private elements?: SelectElements;
  private filteredOptions: SelectOption[] = [];
  private listboxId = createSelectId("listbox");
  private mutationObserver?: MutationObserver;
  private optionCache?: SelectOption[];
  private optionsCacheKey = "";
  private searchValue = "";

  connectedCallback() {
    this.render();
    this.observeOptions();
    this.addEventListener(SELECT_OPTION_CHANGE_EVENT, this.handleOptionChange);
  }

  disconnectedCallback() {
    this.detachDocumentListener();
    this.mutationObserver?.disconnect();
    this.removeEventListener(SELECT_OPTION_CHANGE_EVENT, this.handleOptionChange);
  }

  attributeChangedCallback(name: string) {
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

  get maxCount() {
    const value = Number(this.getAttribute("max-count"));

    return Number.isInteger(value) && value > 0 ? value : undefined;
  }

  set maxCount(value: number | undefined) {
    this.syncNullableAttribute("max-count", value === undefined ? undefined : String(value));
  }

  get mode(): SelectMode {
    return getSelectMode(this);
  }

  set mode(value: SelectMode) {
    this.setAttribute("mode", value === "single" ? "" : value);
  }

  get notFoundContent() {
    return this.getAttribute("not-found-content") ?? "Not Found";
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
    return this.getAttribute("placeholder") ?? "Please select";
  }

  set placeholder(value: string) {
    this.setAttribute("placeholder", value);
  }

  get placement(): SelectPlacement {
    return getSelectPlacement(this);
  }

  set placement(value: SelectPlacement) {
    this.setAttribute("placement", value);
  }

  get showSearch() {
    return normalizeBooleanAttribute(this, "show-search", this.mode !== "single");
  }

  set showSearch(value: boolean) {
    this.setAttribute("show-search", String(value));
  }

  get size(): SelectSize {
    return getSelectSize(this);
  }

  set size(value: SelectSize) {
    this.setAttribute("size", value);
  }

  get status(): SelectStatus | undefined {
    return getSelectStatus(this);
  }

  set status(value: SelectStatus | undefined) {
    this.syncNullableAttribute("status", value);
  }

  get value() {
    return this.getAttribute("value") ?? "";
  }

  set value(value: string) {
    this.setAttribute("value", value);
  }

  get variant(): SelectVariant {
    return getSelectVariant(this);
  }

  set variant(value: SelectVariant) {
    this.setAttribute("variant", value);
  }

  focus() {
    this.elements?.selectorElement.focus();
  }

  blur() {
    this.elements?.selectorElement.blur();
  }

  private handleClear = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.disabled) {
      return;
    }

    const previousValue = this.currentValue;

    this.reflectValue(this.mode === "single" ? "" : []);
    this.dispatchChange(undefined);
    this.dispatchEvent(
      new CustomEvent<SelectClearDetail>(SELECT_CLEAR_EVENT, {
        bubbles: true,
        detail: {
          previousValue
        }
      })
    );
    this.setOpen(false, "clear");
  };

  private handleDocumentPointerDown = (event: PointerEvent) => {
    if (!this.open || event.composedPath().includes(this)) {
      return;
    }

    this.setOpen(false, "outside");
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      this.moveActiveOption(event.key === "ArrowDown" ? 1 : -1);
      this.setOpen(true, "keyboard");
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

  private handleOptionChange = () => {
    this.invalidateOptions();
    this.render();
  };

  private handleOptionPointerDown = (event: PointerEvent) => {
    event.preventDefault();
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const optionElement = target.closest<HTMLElement>(".ds-select__option");
    const index = Number(optionElement?.dataset.index);

    this.selectOption(this.filteredOptions[index]);
  };

  private handleSearch = (event: Event) => {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.searchValue = target.value;
    this.syncOptions();
  };

  private handleTagRemove = (event: Event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const button = target.closest<HTMLButtonElement>(".ds-select__tag-remove");
    const value = button?.dataset.value;

    if (!value || this.mode === "single") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.reflectValue(this.selectedValues.filter((item) => item !== value));
    this.dispatchChange(undefined);
    this.render();
  };

  private handleToggle = (event: Event) => {
    event.preventDefault();

    if (this.disabled) {
      return;
    }

    this.setOpen(!this.open, "trigger");
  };

  private render() {
    if (!this.elements) {
      this.initializeStructure();
    }

    this.sync();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createSelectElements({
      onClear: this.handleClear,
      onKeyDown: this.handleKeyDown,
      onOptionPointerDown: this.handleOptionPointerDown,
      onSearch: this.handleSearch,
      onTagRemove: this.handleTagRemove,
      onToggle: this.handleToggle
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applySelectStyles(shadowRoot);
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

  private sync() {
    if (!this.elements) {
      return;
    }

    this.setAttributeIfChanged("placement", this.placement);
    this.setAttributeIfChanged("size", this.size);
    this.setAttributeIfChanged("variant", this.variant);
    this.syncNullableAttribute("status", this.status);
    this.syncOptions();
    this.syncDocumentListener();
  }

  private syncOptions() {
    if (!this.elements) {
      return;
    }

    const options = this.getOptions();
    const selectedValues = new Set(this.selectedValues);
    const selectedOptions = this.getSelectedOptions(options);

    this.filteredOptions = filterSelectOptions(options, this.searchValue, this.filterOption);

    if (this.defaultActiveFirstOption && this.activeIndex < 0) {
      this.activeIndex = getNextEnabledOptionIndex(this.filteredOptions, -1, 1);
    }

    syncSelectElements({
      activeIndex: this.activeIndex,
      disabled: this.disabled,
      elements: this.elements,
      emptyText: this.notFoundContent,
      getOptionId: (index) => `${this.listboxId}-option-${index}`,
      mode: this.mode,
      open: this.open,
      options: this.filteredOptions,
      placeholder: this.placeholder,
      searchValue: this.searchValue,
      selectedOptions,
      selectedValues,
      showSearch: this.showSearch,
      value: this.currentValue
    });
  }

  private selectOption(option: SelectOption | undefined) {
    if (!option || option.disabled) {
      return;
    }

    if (this.mode === "single") {
      this.reflectValue(option.value);
      this.dispatchChange(option);
      this.setOpen(false, "option");
    } else {
      const nextValues = new Set(this.selectedValues);

      if (nextValues.has(option.value)) {
        nextValues.delete(option.value);
      } else if (!this.maxCount || nextValues.size < this.maxCount) {
        nextValues.add(option.value);
      }

      this.reflectValue([...nextValues]);
      this.dispatchChange(option);
    }

    this.dispatchEvent(
      new CustomEvent<SelectSelectDetail>(SELECT_SELECT_EVENT, {
        bubbles: true,
        detail: {
          option,
          value: option.value
        }
      })
    );
    this.searchValue = "";
    this.render();
  }

  private moveActiveOption(direction: 1 | -1) {
    const nextIndex = getNextEnabledOptionIndex(this.filteredOptions, this.activeIndex, direction);

    if (nextIndex >= 0) {
      this.activeIndex = nextIndex;
      this.syncOptions();
    }
  }

  private dispatchChange(option: SelectOption | undefined) {
    this.dispatchEvent(
      new CustomEvent<SelectChangeDetail>(SELECT_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          option,
          options: this.getSelectedOptions(this.getOptions()),
          value: this.currentValue
        }
      })
    );
  }

  private reflectValue(value: string | string[]) {
    this.value = serializeSelectValue(value);
  }

  private setOpen(open: boolean, source: SelectOpenDetail["source"]) {
    if (this.disabled && open) {
      return;
    }

    if (this.open === open) {
      return;
    }

    if (!open) {
      this.searchValue = "";
    }

    this.open = open;
    this.dispatchEvent(
      new CustomEvent<SelectOpenChangeDetail>(SELECT_OPEN_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          open,
          source
        }
      })
    );

    if (open && this.showSearch) {
      window.requestAnimationFrame(() => this.elements?.searchElement.focus());
    }
  }

  private getSelectedOptions(options: SelectOption[]) {
    const selectedValues = new Set(this.selectedValues);

    return options.filter((option) => selectedValues.has(option.value));
  }

  private getOptions() {
    const cacheKey = `${this.options}::${this.childElementCount}`;

    if (this.optionCache && this.optionsCacheKey === cacheKey) {
      return this.optionCache;
    }

    const attributeOptions = parseSelectOptions(this.options);
    const childOptions = Array.from(this.querySelectorAll(SELECT_OPTION_ELEMENT_NAME)).flatMap((element) => {
      return element instanceof DsSelectOption ? element.toOption() ?? [] : [];
    });

    this.optionsCacheKey = cacheKey;
    this.optionCache = [...attributeOptions, ...childOptions];

    return this.optionCache;
  }

  private invalidateOptions() {
    this.optionCache = undefined;
    this.optionsCacheKey = "";
  }

  private get currentValue() {
    return parseSelectValue(this.value, this.mode);
  }

  private get selectedValues() {
    return Array.isArray(this.currentValue) ? this.currentValue : this.currentValue ? [this.currentValue] : [];
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
    syncNullableAttribute(this, name, value);
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SELECT_ELEMENT_NAME]: DsSelect;
  }
}
