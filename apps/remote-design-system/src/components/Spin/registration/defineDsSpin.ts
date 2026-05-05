import { SPIN_ELEMENT_NAME } from "../constants/Spin.constants";
import { DsSpin } from "../Spin";

export function defineDsSpin(registry: CustomElementRegistry = customElements) {
  if (!registry.get(SPIN_ELEMENT_NAME)) {
    registry.define(SPIN_ELEMENT_NAME, DsSpin);
  }
}
