import { DROPDOWN_ELEMENT_NAME, DROPDOWN_ITEM_ELEMENT_NAME } from "../constants/Dropdown.constants";
import { DsDropdown } from "../Dropdown";
import { DsDropdownItem } from "../DropdownItem";

export function defineDsDropdown(registry?: CustomElementRegistry) {
  const elementRegistry = registry ?? (typeof window !== "undefined" ? window.customElements : undefined);

  if (!elementRegistry) {
    return;
  }

  if (!elementRegistry.get(DROPDOWN_ELEMENT_NAME)) {
    elementRegistry.define(DROPDOWN_ELEMENT_NAME, DsDropdown);
  }

  if (!elementRegistry.get(DROPDOWN_ITEM_ELEMENT_NAME)) {
    elementRegistry.define(DROPDOWN_ITEM_ELEMENT_NAME, DsDropdownItem);
  }
}
