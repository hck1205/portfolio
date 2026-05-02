import { ANCHOR_ELEMENT_NAME, ANCHOR_LINK_ELEMENT_NAME } from "../constants/Anchor.constants";
import { DsAnchor } from "../Anchor";
import { DsAnchorLink } from "../AnchorLink";

export function defineDsAnchor(registry?: CustomElementRegistry) {
  const elementRegistry = registry ?? (typeof window !== "undefined" ? window.customElements : undefined);

  if (!elementRegistry) {
    return;
  }

  if (!elementRegistry.get(ANCHOR_ELEMENT_NAME)) {
    elementRegistry.define(ANCHOR_ELEMENT_NAME, DsAnchor);
  }

  if (!elementRegistry.get(ANCHOR_LINK_ELEMENT_NAME)) {
    elementRegistry.define(ANCHOR_LINK_ELEMENT_NAME, DsAnchorLink);
  }
}
