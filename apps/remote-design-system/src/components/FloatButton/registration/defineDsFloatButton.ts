import {
  FLOAT_BUTTON_ELEMENT_NAME,
  FLOAT_BUTTON_GROUP_ELEMENT_NAME
} from "../constants/FloatButton.constants";
import { DsFloatButton } from "../FloatButton";
import { DsFloatButtonGroup } from "../FloatButtonGroup";

/**
 * Registers FloatButton custom elements once and safely no-ops outside the browser.
 */
export function defineDsFloatButton(registry?: CustomElementRegistry) {
  const elementRegistry = registry ?? globalThis.customElements;

  if (!elementRegistry) {
    return;
  }

  if (!elementRegistry.get(FLOAT_BUTTON_ELEMENT_NAME)) {
    elementRegistry.define(FLOAT_BUTTON_ELEMENT_NAME, DsFloatButton);
  }

  if (!elementRegistry.get(FLOAT_BUTTON_GROUP_ELEMENT_NAME)) {
    elementRegistry.define(FLOAT_BUTTON_GROUP_ELEMENT_NAME, DsFloatButtonGroup);
  }
}
