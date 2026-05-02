import { CASCADER_ELEMENT_NAME } from "../constants/Cascader.constants";
import { DsCascader } from "../Cascader";

export function defineDsCascader(registry?: CustomElementRegistry) {
  const elementRegistry = registry ?? (typeof window !== "undefined" ? window.customElements : undefined);

  if (!elementRegistry) {
    return;
  }

  if (!elementRegistry.get(CASCADER_ELEMENT_NAME)) {
    elementRegistry.define(CASCADER_ELEMENT_NAME, DsCascader);
  }
}
