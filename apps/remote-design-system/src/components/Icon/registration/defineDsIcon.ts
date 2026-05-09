import { ICON_ELEMENT_NAME } from "../constants/Icon.constants";
import { DsIcon } from "../Icon";

export function defineDsIcon(registry: CustomElementRegistry = customElements) {
  if (!registry.get(ICON_ELEMENT_NAME)) {
    registry.define(ICON_ELEMENT_NAME, DsIcon);
  }
}
