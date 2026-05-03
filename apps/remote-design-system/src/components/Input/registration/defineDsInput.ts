import { INPUT_ELEMENT_NAME } from "../constants/Input.constants";
import { DsInput } from "../Input";

export function defineDsInput(registry: CustomElementRegistry = customElements) {
  if (!registry.get(INPUT_ELEMENT_NAME)) {
    registry.define(INPUT_ELEMENT_NAME, DsInput);
  }
}
