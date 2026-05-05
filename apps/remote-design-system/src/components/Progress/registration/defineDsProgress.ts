import { PROGRESS_ELEMENT_NAME } from "../constants/Progress.constants";
import { DsProgress } from "../Progress";

export function defineDsProgress(registry: CustomElementRegistry = customElements) {
  if (!registry.get(PROGRESS_ELEMENT_NAME)) {
    registry.define(PROGRESS_ELEMENT_NAME, DsProgress);
  }
}
