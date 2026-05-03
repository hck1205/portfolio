import { DsCheckbox } from "../Checkbox";
import { DsCheckboxGroup } from "../CheckboxGroup";
import {
  CHECKBOX_ELEMENT_NAME,
  CHECKBOX_GROUP_ELEMENT_NAME
} from "../constants/Checkbox.constants";

export function defineDsCheckbox(registry?: CustomElementRegistry) {
  const elementRegistry =
    registry ?? (typeof customElements === "undefined" ? undefined : customElements);

  if (!elementRegistry) {
    return;
  }

  if (!elementRegistry.get(CHECKBOX_ELEMENT_NAME)) {
    elementRegistry.define(CHECKBOX_ELEMENT_NAME, DsCheckbox);
  }

  if (!elementRegistry.get(CHECKBOX_GROUP_ELEMENT_NAME)) {
    elementRegistry.define(CHECKBOX_GROUP_ELEMENT_NAME, DsCheckboxGroup);
  }
}
