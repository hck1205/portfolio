import { DIVIDER_ELEMENT_NAME } from "../constants/Divider.constants";
import { DsDivider } from "../Divider";

/**
 * Registers the Divider custom element once and safely no-ops outside the browser.
 */
export function defineDsDivider(registry?: CustomElementRegistry) {
  const elementRegistry = registry ?? globalThis.customElements;

  if (!elementRegistry || elementRegistry.get(DIVIDER_ELEMENT_NAME)) {
    return;
  }

  elementRegistry.define(DIVIDER_ELEMENT_NAME, DsDivider);
}
