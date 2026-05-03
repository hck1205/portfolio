import { RATE_ELEMENT_NAME } from "../constants/Rate.constants";
import { DsRate } from "../Rate";

export function defineDsRate(registry: CustomElementRegistry = customElements) {
  if (!registry.get(RATE_ELEMENT_NAME)) {
    registry.define(RATE_ELEMENT_NAME, DsRate);
  }
}
