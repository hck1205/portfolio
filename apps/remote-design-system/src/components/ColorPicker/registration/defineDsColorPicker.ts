import { defineDsDropdown } from "../../Dropdown";
import { DsColorPicker } from "../ColorPicker";
import { COLOR_PICKER_ELEMENT_NAME } from "../constants/ColorPicker.constants";

export function defineDsColorPicker(registry?: CustomElementRegistry) {
  const elementRegistry =
    registry ?? (typeof customElements === "undefined" ? undefined : customElements);

  if (!elementRegistry) {
    return;
  }

  defineDsDropdown(elementRegistry);

  if (!elementRegistry.get(COLOR_PICKER_ELEMENT_NAME)) {
    elementRegistry.define(COLOR_PICKER_ELEMENT_NAME, DsColorPicker);
  }
}
