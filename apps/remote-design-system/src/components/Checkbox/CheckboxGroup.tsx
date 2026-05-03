import { DsCheckbox } from "./Checkbox";
import {
  CHECKBOX_CHANGE_EVENT,
  CHECKBOX_GROUP_CHANGE_EVENT,
  CHECKBOX_GROUP_OBSERVED_ATTRIBUTES
} from "./constants/Checkbox.constants";
import {
  checkboxValueKey,
  normalizeBooleanAttribute,
  normalizeOptions,
  parseOptionsAttribute,
  parseValueListAttribute,
  serializeValueList,
  syncNullableAttribute
} from "./dom/Checkbox.dom";
import {
  applyCheckboxGroupStyles,
  createCheckboxGroupElements,
  syncCheckboxGroupElements,
  type CheckboxGroupElements
} from "./Checkbox.render";
import type {
  CheckboxChangeDetail,
  CheckboxGroupChangeDetail,
  CheckboxGroupOption,
  CheckboxGroupOptionInput,
  CheckboxValue
} from "./types/Checkbox.types";

export class DsCheckboxGroup extends HTMLElement {
  static observedAttributes = CHECKBOX_GROUP_OBSERVED_ATTRIBUTES;

  private assignedOptions?: CheckboxGroupOption[];
  private elements?: CheckboxGroupElements;
  private hasAppliedDefaultValue = false;
  private internalValue: CheckboxValue[] = [];
  private mutationObserver?: MutationObserver;
  private optionsDirty = true;
  private renderedOptionsSignature = "";

  connectedCallback() {
    this.addEventListener(CHECKBOX_CHANGE_EVENT, this.handleCheckboxChange);
    this.observeChildren();
    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener(CHECKBOX_CHANGE_EVENT, this.handleCheckboxChange);
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

  get defaultValue() {
    return parseValueListAttribute(this.getAttribute("default-value"));
  }

  set defaultValue(value: CheckboxValue[]) {
    if (!this.hasAttribute("value")) {
      this.internalValue = [...value];
    }

    this.setAttribute("default-value", serializeValueList(value));
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

  get options(): CheckboxGroupOption[] {
    return this.assignedOptions ?? parseOptionsAttribute(this.getAttribute("options"));
  }

  set options(value: CheckboxGroupOptionInput[]) {
    this.assignedOptions = normalizeOptions(value);
    this.optionsDirty = true;
    this.renderedOptionsSignature = "";
    this.requestRender();
  }

  get value() {
    if (this.hasAttribute("value")) {
      return parseValueListAttribute(this.getAttribute("value"));
    }

    return this.internalValue;
  }

  set value(value: CheckboxValue[]) {
    this.internalValue = value;
    this.setAttribute("value", serializeValueList(value));
  }

  private handleCheckboxChange = (event: Event) => {
    const customEvent = event as CustomEvent<CheckboxChangeDetail>;
    const source = customEvent.target;

    if (!(source instanceof DsCheckbox) || source.parentElement !== this) {
      return;
    }

    const nextValue = this.resolveNextValue(source, customEvent.detail.checked);
    this.value = nextValue;
    this.syncCheckboxes();

    this.dispatchEvent(
      new CustomEvent<CheckboxGroupChangeDetail>(CHECKBOX_GROUP_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          nativeEvent: customEvent.detail.nativeEvent,
          value: nextValue
        }
      })
    );
  };

  private render() {
    this.applyDefaultValue();
    this.initializeStructure();
    this.renderGeneratedOptions();
    this.syncGroupElement();
    this.syncCheckboxes();
  }

  private initializeStructure() {
    if (this.elements) {
      return;
    }

    const shadowRoot = this.attachShadow({ mode: "open" });

    this.elements = createCheckboxGroupElements();
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyCheckboxGroupStyles(shadowRoot);
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
          if (node instanceof DsCheckbox) {
            node.clearGroupSync();
          }
        }
      }

      this.syncCheckboxes();
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
    const generatedCheckboxes = this.generatedCheckboxes;

    if (optionsSignature === this.renderedOptionsSignature) {
      this.optionsDirty = false;
      return;
    }

    if (options.length === 0) {
      for (const checkbox of generatedCheckboxes) {
        checkbox.remove();
      }

      this.renderedOptionsSignature = optionsSignature;
      this.optionsDirty = false;
      return;
    }

    for (const checkbox of generatedCheckboxes) {
      checkbox.remove();
    }

    const optionCheckboxes = options.map((option) => {
      const checkbox = document.createElement("ds-checkbox") as DsCheckbox;

      checkbox.dataset.dsGeneratedOption = "";
      checkbox.value = option.value;
      checkbox.textContent = option.label;
      checkbox.disabled = Boolean(option.disabled);

      if (option.title) {
        checkbox.title = option.title;
      }

      if (option.className) {
        checkbox.className = option.className;
      }

      return checkbox;
    });

    this.append(...optionCheckboxes);
    this.renderedOptionsSignature = optionsSignature;
    this.optionsDirty = false;
  }

  private syncGroupElement() {
    if (!this.elements) {
      return;
    }

    syncCheckboxGroupElements({
      ariaLabel: this.getAttribute("aria-label") ?? "",
      elements: this.elements
    });
  }

  private syncCheckboxes() {
    const checkedValues = new Set(this.value.map(checkboxValueKey));

    for (const checkbox of this.checkboxes) {
      checkbox.syncFromGroup({
        checked: checkedValues.has(checkboxValueKey(checkbox.value)),
        disabled: this.disabled,
        name: this.name
      });
    }
  }

  private resolveNextValue(source: DsCheckbox, checked: boolean) {
    const selectedValues = new Set(this.value.map(checkboxValueKey));
    const sourceKey = checkboxValueKey(source.value);

    if (checked) {
      selectedValues.add(sourceKey);
    } else {
      selectedValues.delete(sourceKey);
    }

    return this.checkboxes
      .filter((checkbox) => selectedValues.has(checkboxValueKey(checkbox.value)))
      .map((checkbox) => checkbox.value);
  }

  private get checkboxes() {
    return Array.from(this.children).filter(
      (child): child is DsCheckbox => child instanceof DsCheckbox
    );
  }

  private get generatedCheckboxes() {
    return this.checkboxes.filter((checkbox) => "dsGeneratedOption" in checkbox.dataset);
  }
  private requestRender() {
    if (!this.isConnected && !this.elements) {
      return;
    }

    this.render();
  }
}
