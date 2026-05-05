import { POPOVER_ELEMENT_NAME } from "../constants/Popover.constants";
import { DsPopover } from "../Popover";

export function defineDsPopover(registry: CustomElementRegistry = customElements) {
  if (!registry.get(POPOVER_ELEMENT_NAME)) {
    registry.define(POPOVER_ELEMENT_NAME, DsPopover);
  }
}
