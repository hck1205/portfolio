import { MENU_ELEMENT_NAME, MENU_ITEM_ELEMENT_NAME } from "../constants/Menu.constants";
import { DsMenu } from "../Menu";
import { DsMenuItem } from "../MenuItem";

export function defineDsMenu(registry?: CustomElementRegistry) {
  const elementRegistry = registry ?? (typeof window !== "undefined" ? window.customElements : undefined);

  if (!elementRegistry) {
    return;
  }

  if (!elementRegistry.get(MENU_ELEMENT_NAME)) {
    elementRegistry.define(MENU_ELEMENT_NAME, DsMenu);
  }

  if (!elementRegistry.get(MENU_ITEM_ELEMENT_NAME)) {
    elementRegistry.define(MENU_ITEM_ELEMENT_NAME, DsMenuItem);
  }
}
