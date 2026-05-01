import { BUTTON_ELEMENT_NAME } from "../constants/Button.constants";
import { DsButton } from "../Button";

/**
 * Registers the Button custom element once and safely no-ops outside the browser.
 */
export function defineDsButton(registry?: CustomElementRegistry) {
  const elementRegistry =
    registry ?? (typeof customElements === "undefined" ? undefined : customElements);

  if (!elementRegistry || elementRegistry.get(BUTTON_ELEMENT_NAME)) {
    return;
  }

  elementRegistry.define(BUTTON_ELEMENT_NAME, DsButton);
}

