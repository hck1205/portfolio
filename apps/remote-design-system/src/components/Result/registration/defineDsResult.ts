import { RESULT_ELEMENT_NAME } from "../constants/Result.constants";
import { DsResult } from "../Result";

export function defineDsResult(registry: CustomElementRegistry = customElements) {
  if (!registry.get(RESULT_ELEMENT_NAME)) {
    registry.define(RESULT_ELEMENT_NAME, DsResult);
  }
}
