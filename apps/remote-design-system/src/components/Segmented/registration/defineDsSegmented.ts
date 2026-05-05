import { SEGMENTED_ELEMENT_NAME } from "../constants/Segmented.constants";
import { DsSegmented } from "../Segmented";

export function defineDsSegmented(registry: CustomElementRegistry = customElements) {
  if (!registry.get(SEGMENTED_ELEMENT_NAME)) {
    registry.define(SEGMENTED_ELEMENT_NAME, DsSegmented);
  }
}
