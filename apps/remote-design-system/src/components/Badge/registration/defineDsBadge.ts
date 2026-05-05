import { BADGE_ELEMENT_NAME, BADGE_RIBBON_ELEMENT_NAME } from "../constants/Badge.constants";
import { DsBadge, DsBadgeRibbon } from "../Badge";

export function defineDsBadge(registry: CustomElementRegistry = customElements) {
  if (!registry.get(BADGE_ELEMENT_NAME)) {
    registry.define(BADGE_ELEMENT_NAME, DsBadge);
  }

  if (!registry.get(BADGE_RIBBON_ELEMENT_NAME)) {
    registry.define(BADGE_RIBBON_ELEMENT_NAME, DsBadgeRibbon);
  }
}
