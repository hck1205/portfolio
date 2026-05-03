import { SWITCH_ELEMENT_NAME } from "../constants/Switch.constants";
import { DsSwitch } from "../Switch";

export function defineDsSwitch(registry: CustomElementRegistry = customElements) {
  if (!registry.get(SWITCH_ELEMENT_NAME)) {
    registry.define(SWITCH_ELEMENT_NAME, DsSwitch);
  }
}
