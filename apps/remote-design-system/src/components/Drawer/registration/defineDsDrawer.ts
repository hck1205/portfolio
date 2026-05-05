import { DRAWER_ELEMENT_NAME } from "../constants/Drawer.constants";
import { DsDrawer } from "../Drawer";

export function defineDsDrawer(registry: CustomElementRegistry = customElements) {
  if (!registry.get(DRAWER_ELEMENT_NAME)) {
    registry.define(DRAWER_ELEMENT_NAME, DsDrawer);
  }
}
