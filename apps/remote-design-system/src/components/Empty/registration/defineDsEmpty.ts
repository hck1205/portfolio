import { EMPTY_ELEMENT_NAME } from "../constants/Empty.constants";
import { DsEmpty } from "../Empty";

export function defineDsEmpty(registry: CustomElementRegistry = customElements) {
  if (!registry.get(EMPTY_ELEMENT_NAME)) {
    registry.define(EMPTY_ELEMENT_NAME, DsEmpty);
  }
}
