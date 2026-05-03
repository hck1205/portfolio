import { DsRadio } from "./Radio";
import {
  RADIO_CHANGE_EVENT,
  RADIO_GROUP_CHANGE_EVENT,
  RADIO_GROUP_OBSERVED_ATTRIBUTES
} from "./constants/Radio.constants";
import {
  getRadioButtonStyle,
  getRadioOptionType,
  getRadioOrientation,
  getRadioSize,
  normalizeBooleanAttribute,
  normalizeOptions,
  parseOptionsAttribute,
  parseValueAttribute,
  radioValueKey,
  serializeValue,
  syncNullableAttribute
} from "./dom/Radio.dom";
import {
  applyRadioGroupStyles,
  createRadioGroupElements,
  syncRadioGroupElements,
  type RadioGroupElements
} from "./Radio.render";
import type {
  RadioChangeDetail,
  RadioGroupChangeDetail,
  RadioGroupOption,
  RadioGroupOptionInput,
  RadioValue
} from "./types/Radio.types";

let radioGroupId = 0;

export class DsRadioGroup extends HTMLElement {
  static observedAttributes = RADIO_GROUP_OBSERVED_ATTRIBUTES;

  private assignedOptions?: RadioGroupOption[];
  private elements?: RadioGroupElements;
  private fallbackName = `ds-radio-group-${++radioGroupId}`;
  private hasAppliedDefaultValue = false;
  private internalValue?: RadioValue;
  private mutationObserver?: MutationObserver;
  private optionsDirty = true;
  private renderedOptionsSignature = "";

  connectedCallback() {
    this.addEventListener(RADIO_CHANGE_EVENT, this.handleRadioChange);
    this.observeChildren();
    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener(RADIO_CHANGE_EVENT, this.handleRadioChange);
    this.mutationObserver?.disconnect();
  }

  attributeChangedCallback(name: string) {
    if (name === "options") {
      this.assignedOptions = undefined;
      this.optionsDirty = true;
      this.renderedOptionsSignature = "";
    }

    this.requestRender();
  }

  get block() {
    return normalizeBooleanAttribute(this, "block", false);
  }

  set block(value: boolean) {
    this.toggleAttribute("block", value);
  }

  get buttonStyle() {
    return getRadioButtonStyle(this);
  }

  set buttonStyle(value: "outline" | "solid") {
    this.setAttribute("button-style", value);
  }

  get defaultValue() {
    return parseValueAttribute(this.getAttribute("default-value"));
  }

  set defaultValue(value: RadioValue | undefined) {
    if (value === undefined) {
      this.removeAttribute("default-value");
      return;
    }

    if (!this.hasAttribute("value")) {
      this.internalValue = value;
    }

    this.setAttribute("default-value", serializeValue(value));
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get name() {
    return this.getAttribute("name") ?? "";
  }

  set name(value: string) {
    syncNullableAttribute(this, "name", value);
  }

  get optionType() {
    return getRadioOptionType(this);
  }

  set optionType(value: "button" | "default") {
    this.setAttribute("option-type", value);
  }

  get options(): RadioGroupOption[] {
    return this.assignedOptions ?? parseOptionsAttribute(this.getAttribute("options"));
  }

  set options(value: RadioGroupOptionInput[]) {
    this.assignedOptions = normalizeOptions(value);
    this.optionsDirty = true;
    this.renderedOptionsSignature = "";
    this.requestRender();
  }

  get orientation() {
    return getRadioOrientation(this);
  }

  set orientation(value: "horizontal" | "vertical") {
    this.setAttribute("orientation", value);
  }

  get size() {
    return getRadioSize(this);
  }

  set size(value: "large" | "middle" | "small") {
    this.setAttribute("size", value);
  }

  get value() {
    if (this.hasAttribute("value")) {
      return parseValueAttribute(this.getAttribute("value"));
    }

    return this.internalValue;
  }

  set value(value: RadioValue | undefined) {
    this.internalValue = value;

    if (value === undefined) {
      this.removeAttribute("value");
      return;
    }

    this.setAttribute("value", serializeValue(value));
  }

  private handleRadioChange = (event: Event) => {
    const customEvent = event as CustomEvent<RadioChangeDetail>;
    const source = customEvent.target;

    if (!(source instanceof DsRadio) || source.parentElement !== this || !customEvent.detail.checked) {
      return;
    }

    this.value = source.value;
    this.syncRadios();
    this.dispatchEvent(
      new CustomEvent<RadioGroupChangeDetail>(RADIO_GROUP_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          nativeEvent: customEvent.detail.nativeEvent,
          value: source.value
        }
      })
    );
  };

  private render() {
    this.applyDefaultValue();
    this.initializeStructure();
    this.renderGeneratedOptions();
    this.syncGroupElement();
    this.syncRadios();
  }

  private initializeStructure() {
    if (this.elements) {
      return;
    }

    const shadowRoot = this.attachShadow({ mode: "open" });

    this.elements = createRadioGroupElements();
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyRadioGroupStyles(shadowRoot);
  }

  private applyDefaultValue() {
    if (this.hasAppliedDefaultValue) {
      return;
    }

    if (!this.hasAttribute("value")) {
      this.internalValue = this.defaultValue;
    }

    this.hasAppliedDefaultValue = true;
  }

  private observeChildren() {
    if (this.mutationObserver) {
      return;
    }

    this.mutationObserver = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.removedNodes) {
          if (node instanceof DsRadio) {
            node.clearGroupSync();
          }
        }
      }

      this.syncRadios();
    });
    this.mutationObserver.observe(this, {
      childList: true
    });
  }

  private renderGeneratedOptions() {
    if (!this.optionsDirty) {
      return;
    }

    const options = this.options;
    const optionsSignature = JSON.stringify(options);
    const generatedRadios = this.generatedRadios;

    if (optionsSignature === this.renderedOptionsSignature) {
      this.optionsDirty = false;
      return;
    }

    for (const radio of generatedRadios) {
      radio.remove();
    }

    const optionRadios = options.map((option) => {
      const radio = document.createElement("ds-radio") as DsRadio;

      radio.dataset.dsGeneratedOption = "";
      radio.value = option.value;
      radio.textContent = option.label;
      radio.disabled = Boolean(option.disabled);

      if (option.title) {
        radio.title = option.title;
      }

      if (option.className) {
        radio.className = option.className;
      }

      return radio;
    });

    this.append(...optionRadios);
    this.renderedOptionsSignature = optionsSignature;
    this.optionsDirty = false;
  }

  private syncGroupElement() {
    if (!this.elements) {
      return;
    }

    this.setAttribute("orientation", this.orientation);
    this.setAttribute("option-type", this.optionType);
    this.setAttribute("size", this.size);
    syncRadioGroupElements({
      ariaLabel: this.getAttribute("aria-label") ?? "",
      elements: this.elements
    });
  }

  private syncRadios() {
    const selectedKey = this.value === undefined ? "" : radioValueKey(this.value);
    const name = this.name || this.fallbackName;

    for (const radio of this.radios) {
      radio.syncFromGroup({
        buttonStyle: this.buttonStyle,
        checked: selectedKey === radioValueKey(radio.value),
        disabled: this.disabled,
        name,
        optionType: this.optionType,
        size: this.size
      });
    }
  }

  private get radios() {
    return Array.from(this.children).filter((child): child is DsRadio => child instanceof DsRadio);
  }

  private get generatedRadios() {
    return this.radios.filter((radio) => "dsGeneratedOption" in radio.dataset);
  }

  private requestRender() {
    if (!this.isConnected && !this.elements) {
      return;
    }

    this.render();
  }
}
