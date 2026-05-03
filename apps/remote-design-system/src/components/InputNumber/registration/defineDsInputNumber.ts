import { INPUT_NUMBER_ELEMENT_NAME } from "../constants/InputNumber.constants";
import { DsInputNumber } from "../InputNumber";

export function defineDsInputNumber(registry: CustomElementRegistry = customElements) {
  if (!registry.get(INPUT_NUMBER_ELEMENT_NAME)) {
    registry.define(INPUT_NUMBER_ELEMENT_NAME, DsInputNumber);
  }
}
