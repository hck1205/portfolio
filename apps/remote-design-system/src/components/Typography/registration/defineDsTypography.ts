import { TYPOGRAPHY_ELEMENT_NAME } from "../constants/Typography.constants";
import { DsTypography } from "../Typography";

/**
 * Registers the Typography custom element once and safely no-ops outside the browser.
 */
export function defineDsTypography(registry?: CustomElementRegistry) {
  const elementRegistry = registry ?? globalThis.customElements;

  if (!elementRegistry || elementRegistry.get(TYPOGRAPHY_ELEMENT_NAME)) {
    return;
  }

  elementRegistry.define(TYPOGRAPHY_ELEMENT_NAME, DsTypography);
}
