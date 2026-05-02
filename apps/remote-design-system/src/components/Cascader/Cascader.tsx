import {
  CASCADER_CHANGE_EVENT,
  CASCADER_CLEAR_EVENT,
  CASCADER_ELEMENT_NAME,
  CASCADER_OBSERVED_ATTRIBUTES,
  CASCADER_OPEN_CHANGE_EVENT,
  CASCADER_SEARCH_EVENT
} from "./constants/Cascader.constants";
import {
  createCascaderId,
  findSearchMatches,
  getCascaderExpandTrigger,
  getCascaderPlacement,
  getCascaderSize,
  getCascaderStatus,
  getCascaderVariant,
  getColumns,
  getPathOptions,
  getSelectedItems,
  hasChildren,
  normalizeBooleanAttribute,
  pathFromKey,
  pathToKey,
  parseOptions,
  parseValue,
  removePathByKey,
  stringifyValue,
  togglePathSelection
} from "./dom/Cascader.dom";
import {
  applyCascaderStyles,
  createCascaderElements,
  syncMenus,
  syncPopupPlacement,
  syncSearchResults,
  syncSelectorValue,
  type CascaderElements
} from "./render/Cascader.render";
import type {
  CascaderChangeDetail,
  CascaderClearDetail,
  CascaderExpandTrigger,
  CascaderOpenChangeDetail,
  CascaderOpenChangeSource,
  CascaderOption,
  CascaderPath,
  CascaderPlacement,
  CascaderSearchDetail,
  CascaderSearchMatch,
  CascaderSize,
  CascaderStatus,
  CascaderVariant
} from "./types/Cascader.types";

export class DsCascader extends HTMLElement {
  static observedAttributes = CASCADER_OBSERVED_ATTRIBUTES;

  private activePath: CascaderPath = [];
  private documentListenerAttached = false;
  private elements?: CascaderElements;
  private optionsCache?: CascaderOption[];
  private optionsCacheKey = "";
  private popupId = createCascaderId("popup");
  private searchMatches: CascaderSearchMatch[] = [];
  private searchValue = "";
  private selectedPaths: CascaderPath[] = [];
  private suppressAttributeRender = false;

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.detachDocumentListener();
  }

  attributeChangedCallback(name: string) {
    if (this.suppressAttributeRender) {
      return;
    }

    if (name === "options") {
      this.invalidateOptions();
    }

    if (name === "value" || name === "multiple") {
      this.selectedPaths = parseValue(this.value, this.multiple);
      this.activePath = this.selectedPaths[0] ?? [];
    }

    this.render();
  }

  get allowClear() {
    return normalizeBooleanAttribute(this, "allow-clear", true);
  }

  set allowClear(value: boolean) {
    this.toggleAttribute("allow-clear", value);
  }

  get changeOnSelect() {
    return normalizeBooleanAttribute(this, "change-on-select", false);
  }

  set changeOnSelect(value: boolean) {
    this.toggleAttribute("change-on-select", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get expandTrigger(): CascaderExpandTrigger {
    return getCascaderExpandTrigger(this);
  }

  set expandTrigger(value: CascaderExpandTrigger) {
    this.setAttribute("expand-trigger", value);
  }

  get multiple() {
    return normalizeBooleanAttribute(this, "multiple", false);
  }

  set multiple(value: boolean) {
    this.toggleAttribute("multiple", value);
  }

  get notFoundContent() {
    return this.getAttribute("not-found-content") ?? "선택지가 없습니다";
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

  get placement(): CascaderPlacement {
    return getCascaderPlacement(this);
  }

  set placement(value: CascaderPlacement) {
    this.setAttribute("placement", value);
  }

  get showSearch() {
    return normalizeBooleanAttribute(this, "show-search", false);
  }

  set showSearch(value: boolean) {
    this.toggleAttribute("show-search", value);
  }

  get size(): CascaderSize {
    return getCascaderSize(this);
  }

  set size(value: CascaderSize) {
    this.setAttribute("size", value);
  }

  get status(): CascaderStatus | undefined {
    return getCascaderStatus(this);
  }

  set status(value: CascaderStatus | undefined) {
    this.syncNullableAttribute("status", value);
  }

  get value() {
    return this.getAttribute("value") ?? "";
  }

  set value(value: string) {
    this.syncNullableAttribute("value", value);
  }

  get variant(): CascaderVariant {
    return getCascaderVariant(this);
  }

  set variant(value: CascaderVariant) {
    this.setAttribute("variant", value);
  }

  focus() {
    this.elements?.selectorElement.focus();
  }

  blur() {
    this.elements?.selectorElement.blur();
  }

  private handleToggle = (event: Event) => {
    if (this.disabled) {
      return;
    }

    event.preventDefault();
    this.setOpen(!this.open, "trigger");
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }

    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      this.setOpen(true, "keyboard");
      this.focusSearch();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      this.setOpen(false, "keyboard");
    }
  };

  private handleClear = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.disabled || !this.selectedPaths.length) {
      return;
    }

    const previousValues = this.selectedPaths;

    this.updateSelection([]);
    this.activePath = [];
    this.setOpen(false, "clear");
    this.dispatchEvent(
      new CustomEvent<CascaderClearDetail>(CASCADER_CLEAR_EVENT, {
        bubbles: true,
        detail: {
          previousValues
        }
      })
    );
  };

  private handleTagRemove = (event: Event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const removeElement = target.closest<HTMLElement>(".ds-cascader__tag-remove");
    const pathKey = removeElement?.dataset.path;

    if (!pathKey) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.updateSelection(removePathByKey(this.selectedPaths, pathKey));
    this.sync();
  };

  private handleSearch = (event: Event) => {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.searchValue = target.value;
    this.searchMatches = findSearchMatches(this.getOptions(), this.searchValue);
    this.dispatchEvent(
      new CustomEvent<CascaderSearchDetail>(CASCADER_SEARCH_EVENT, {
        bubbles: true,
        detail: {
          value: this.searchValue
        }
      })
    );
    this.sync();
  };

  private handleOptionPointerEnter = (event: PointerEvent) => {
    if (this.expandTrigger !== "hover") {
      return;
    }

    const path = this.getPathFromEvent(event);

    if (!path.length) {
      return;
    }

    this.expandPath(path);
  };

  private handleMenuPointerDown = (event: PointerEvent) => {
    if (this.selectSearchResultFromEvent(event)) {
      return;
    }

    const path = this.getPathFromEvent(event);
    const forceSelect = this.isCheckboxEvent(event);

    if (!path.length) {
      return;
    }

    event.preventDefault();
    this.selectPath(path, { forceSelect });
  };

  private selectSearchResultFromEvent(event: PointerEvent) {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return false;
    }

    const resultElement = target.closest<HTMLElement>(".ds-cascader__search-result");
    const index = Number(resultElement?.dataset.searchIndex);
    const match = this.searchMatches[index];

    if (!match) {
      return false;
    }

    event.preventDefault();
    this.selectPath(match.path);
    return true;
  }

  private handleDocumentPointerDown = (event: PointerEvent) => {
    if (!this.open || event.composedPath().includes(this)) {
      return;
    }

    this.setOpen(false, "outside");
  };

  private render() {
    if (!this.elements) {
      this.initializeStructure();
      this.selectedPaths = parseValue(this.value, this.multiple);
      this.activePath = this.selectedPaths[0] ?? [];
    }

    this.sync();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createCascaderElements({
      onClear: this.handleClear,
      onKeyDown: this.handleKeyDown,
      onMenuPointerDown: this.handleMenuPointerDown,
      onOptionPointerEnter: this.handleOptionPointerEnter,
      onSearch: this.handleSearch,
      onTagRemove: this.handleTagRemove,
      onToggle: this.handleToggle
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyCascaderStyles(shadowRoot);
  }

  private sync() {
    if (!this.elements) {
      return;
    }

    const options = this.getOptions();
    const selectedItems = getSelectedItems(this.selectedPaths, options, this.multiple);
    const selectedPathKeys = new Set(this.selectedPaths.map(pathToKey));

    this.setAttributeIfChanged("size", this.size);
    this.setAttributeIfChanged("variant", this.variant);
    this.syncNullableAttribute("status", this.status);
    this.elements.selectorElement.disabled = this.disabled;
    this.elements.selectorElement.setAttribute("aria-expanded", String(this.open));
    this.elements.selectorElement.setAttribute("aria-haspopup", "menu");
    this.elements.selectorElement.setAttribute("aria-controls", this.popupId);
    this.elements.clearButtonElement.hidden = !this.allowClear || this.disabled || !this.selectedPaths.length;
    this.elements.popupElement.id = this.popupId;
    this.elements.popupElement.hidden = !this.open;
    this.elements.searchElement.hidden = !this.showSearch;
    this.elements.searchInputElement.value = this.searchValue;
    syncPopupPlacement(this.elements, this.placement);
    syncSelectorValue({
      elements: this.elements,
      multiple: this.multiple,
      placeholder: this.placeholder,
      selectedItems
    });

    if (this.showSearch && this.searchValue) {
      syncSearchResults({
        elements: this.elements,
        emptyText: this.notFoundContent,
        matches: this.searchMatches
      });
    } else {
      syncMenus({
        activePath: this.activePath,
        columns: getColumns(options, this.activePath),
        elements: this.elements,
        emptyText: this.notFoundContent,
        multiple: this.multiple,
        selectedPathKeys
      });
    }

    this.syncDocumentListener();
  }

  private selectPath(path: CascaderPath, { forceSelect = false }: { forceSelect?: boolean } = {}) {
    const selectedOptions = getPathOptions(this.getOptions(), path);
    const lastOption = selectedOptions.at(-1);

    if (!lastOption || lastOption.disabled) {
      return;
    }

    this.activePath = path;

    if (hasChildren(lastOption) && !this.changeOnSelect && !(this.multiple && forceSelect)) {
      this.sync();
      return;
    }

    if (this.multiple) {
      this.updateSelection(togglePathSelection(this.selectedPaths, path));
      this.sync();
      return;
    }

    this.updateSelection([path]);
    this.setOpen(false, "option");
  }

  private expandPath(path: CascaderPath) {
    const selectedOptions = getPathOptions(this.getOptions(), path);
    const lastOption = selectedOptions.at(-1);

    if (!lastOption || lastOption.disabled || !hasChildren(lastOption)) {
      return;
    }

    this.activePath = path;
    this.sync();
  }

  private updateSelection(paths: CascaderPath[]) {
    this.selectedPaths = paths;
    this.reflectValue(paths);
    this.dispatchChange(paths.at(-1) ?? []);
  }

  private dispatchChange(path: CascaderPath) {
    this.dispatchEvent(
      new CustomEvent<CascaderChangeDetail>(CASCADER_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          selectedOptions: getPathOptions(this.getOptions(), path),
          value: path,
          values: this.selectedPaths
        }
      })
    );
  }

  private reflectValue(paths: CascaderPath[]) {
    const value = stringifyValue(paths, this.multiple);

    this.suppressAttributeRender = true;
    this.value = value;
    this.suppressAttributeRender = false;
  }

  private setOpen(open: boolean, source: CascaderOpenChangeSource) {
    if (this.disabled && open) {
      return;
    }

    if (this.open === open) {
      this.sync();
      return;
    }

    if (!open) {
      this.searchValue = "";
      this.searchMatches = [];
    }

    this.open = open;
    this.dispatchEvent(
      new CustomEvent<CascaderOpenChangeDetail>(CASCADER_OPEN_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          open,
          source
        }
      })
    );

  }

  private focusSearch() {
    if (!this.showSearch) {
      return;
    }

    window.requestAnimationFrame(() => {
      this.elements?.searchInputElement.focus();
    });
  }

  private getPathFromEvent(event: Event) {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return [];
    }

    const optionElement = target.closest<HTMLElement>(".ds-cascader__option");
    const path = optionElement?.dataset.path;

    if (!path) {
      return [];
    }

    return pathFromKey(path);
  }

  private isCheckboxEvent(event: Event) {
    const target = event.target;

    return target instanceof HTMLElement && Boolean(target.closest(".ds-cascader__option-checkbox"));
  }

  private getOptions() {
    if (this.optionsCache && this.optionsCacheKey === this.options) {
      return this.optionsCache;
    }

    this.optionsCacheKey = this.options;
    this.optionsCache = parseOptions(this.options);

    return this.optionsCache;
  }

  private invalidateOptions() {
    this.optionsCache = undefined;
    this.optionsCacheKey = "";
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
    [CASCADER_ELEMENT_NAME]: DsCascader;
  }
}
