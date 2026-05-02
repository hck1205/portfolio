import {
  INPUT_CHANGE_EVENT,
  INPUT_CLEAR_EVENT,
  INPUT_INPUT_EVENT,
  INPUT_OBSERVED_ATTRIBUTES,
  INPUT_SEARCH_EVENT
} from "./constants/Input.constants";
import {
  getInputMode,
  getInputSize,
  getInputStatus,
  getInputVariant,
  getNativeInputType,
  getPositiveIntegerAttribute,
  normalizeBooleanAttribute
} from "./dom/Input.dom";
import {
  applyInputStyles,
  createInputElements,
  syncInputElements,
  type InputElements
} from "./Input.render";
import type {
  InputChangeDetail,
  InputClearDetail,
  InputInputDetail,
  InputMode,
  InputSearchDetail,
  InputSize,
  InputStatus,
  InputVariant
} from "./types/Input.types";

export class DsInput extends HTMLElement {
  static observedAttributes = INPUT_OBSERVED_ATTRIBUTES;

  private elements?: InputElements;
  private internalValue = "";
  private passwordVisible = false;

  connectedCallback() {
    if (!this.internalValue) {
      this.internalValue = this.getAttribute("value") ?? this.getAttribute("default-value") ?? "";
    }

    this.render();
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

  get enterButton() {
    return normalizeBooleanAttribute(this, "enter-button", false);
  }

  set enterButton(value: boolean) {
    this.toggleAttribute("enter-button", value);
  }

  get loading() {
    return normalizeBooleanAttribute(this, "loading", false);
  }

  set loading(value: boolean) {
    this.toggleAttribute("loading", value);
  }

  get mode(): InputMode {
    return getInputMode(this);
  }

  set mode(value: InputMode) {
    this.setAttribute("mode", value);
  }

  get placeholder() {
    return this.getAttribute("placeholder") ?? "";
  }

  set placeholder(value: string) {
    this.syncNullableAttribute("placeholder", value);
  }

  get readonly() {
    return normalizeBooleanAttribute(this, "readonly", false);
  }

  set readonly(value: boolean) {
    this.toggleAttribute("readonly", value);
  }

  get rows() {
    return getPositiveIntegerAttribute(this, "rows", 3);
  }

  set rows(value: number) {
    this.setAttribute("rows", String(value));
  }

  get showCount() {
    return normalizeBooleanAttribute(this, "show-count", false);
  }

  set showCount(value: boolean) {
    this.toggleAttribute("show-count", value);
  }

  get searchButtonIcon() {
    return normalizeBooleanAttribute(this, "search-button-icon", true);
  }

  set searchButtonIcon(value: boolean) {
    this.setAttribute("search-button-icon", String(value));
  }

  get searchOnEnter() {
    return normalizeBooleanAttribute(this, "search-on-enter", true);
  }

  set searchOnEnter(value: boolean) {
    this.setAttribute("search-on-enter", String(value));
  }

  get size(): InputSize {
    return getInputSize(this);
  }

  set size(value: InputSize) {
    this.setAttribute("size", value);
  }

  get status(): InputStatus | undefined {
    return getInputStatus(this);
  }

  set status(value: InputStatus | undefined) {
    this.syncNullableAttribute("status", value);
  }

  get value() {
    return this.internalValue;
  }

  set value(value: string) {
    this.internalValue = value;
    this.setAttribute("value", value);
  }

  get variant(): InputVariant {
    return getInputVariant(this);
  }

  set variant(value: InputVariant) {
    this.setAttribute("variant", value);
  }

  get visibilityToggle() {
    return normalizeBooleanAttribute(this, "visibility-toggle", true);
  }

  set visibilityToggle(value: boolean) {
    this.setAttribute("visibility-toggle", String(value));
  }

  focus(options?: FocusOptions) {
    this.elements?.controlElement.focus(options);
  }

  blur() {
    this.elements?.controlElement.blur();
  }

  private handleInput = (event: Event) => {
    const nativeEvent = event as InputEvent;
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;

    this.internalValue = target.value;
    this.dispatchEvent(
      new CustomEvent<InputInputDetail>(INPUT_INPUT_EVENT, {
        bubbles: true,
        detail: {
          nativeEvent,
          value: this.internalValue
        }
      })
    );
    this.render();
  };

  private handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;

    this.internalValue = target.value;
    this.dispatchEvent(
      new CustomEvent<InputChangeDetail>(INPUT_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          nativeEvent: event,
          value: this.internalValue
        }
      })
    );
  };

  private handleClear = () => {
    if (this.disabled || this.readonly || !this.internalValue) {
      return;
    }

    const previousValue = this.internalValue;

    this.internalValue = "";
    this.dispatchEvent(
      new CustomEvent<InputClearDetail>(INPUT_CLEAR_EVENT, {
        bubbles: true,
        detail: {
          previousValue
        }
      })
    );

    if (this.mode === "search") {
      this.dispatchSearch("clear");
    }

    this.render();
    this.elements?.controlElement.focus();
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && this.mode === "search" && this.searchOnEnter) {
      this.dispatchSearch("input");
    }
  };

  private handlePasswordToggle = () => {
    if (this.disabled) {
      return;
    }

    this.passwordVisible = !this.passwordVisible;
    this.render();
  };

  private handleSearch = (source: "button") => {
    this.dispatchSearch(source);
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

    this.elements = createInputElements({
      mode: this.mode,
      onChange: this.handleChange,
      onClear: this.handleClear,
      onInput: this.handleInput,
      onKeyDown: this.handleKeyDown,
      onPasswordToggle: this.handlePasswordToggle,
      onSearch: this.handleSearch
    });
    shadowRoot.replaceChildren(this.elements.searchRootElement);
    applyInputStyles(shadowRoot);
  }

  private syncAttributes() {
    this.setAttributeIfChanged("size", this.size);
    this.setAttributeIfChanged("variant", this.variant);
    this.setAttributeIfChanged("data-mode", this.mode);
    this.toggleAttributeIfChanged("block", this.block);
    this.toggleAttributeIfChanged("data-has-enter-button", this.mode === "search" && this.enterButton);

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

    this.elements = syncInputElements({
      allowClear: this.allowClear,
      autocomplete: this.getAttribute("autocomplete") ?? "",
      disabled: this.disabled,
      elements: this.elements,
      enterButton: this.enterButton,
      id: this.getAttribute("id") ?? "",
      inputMode: this.getAttribute("inputmode") ?? "",
      loading: this.loading,
      maxLength: this.hasAttribute("maxlength") ? getPositiveIntegerAttribute(this, "maxlength", 0) : undefined,
      mode: this.mode,
      name: this.getAttribute("name") ?? "",
      onChange: this.handleChange,
      onClear: this.handleClear,
      onInput: this.handleInput,
      onKeyDown: this.handleKeyDown,
      onPasswordToggle: this.handlePasswordToggle,
      onSearch: this.handleSearch,
      passwordVisible: this.passwordVisible,
      placeholder: this.placeholder,
      readonly: this.readonly,
      required: normalizeBooleanAttribute(this, "required", false),
      rows: this.rows,
      searchButtonIcon: this.searchButtonIcon,
      showCount: this.showCount,
      spellcheck: this.getAttribute("spellcheck"),
      status: this.status,
      type: getNativeInputType(this, this.mode),
      value: this.internalValue,
      variant: this.variant,
      visibilityToggle: this.visibilityToggle
    });
  }

  private dispatchSearch(source: InputSearchDetail["source"]) {
    this.dispatchEvent(
      new CustomEvent<InputSearchDetail>(INPUT_SEARCH_EVENT, {
        bubbles: true,
        detail: {
          source,
          value: this.internalValue
        }
      })
    );
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
}
