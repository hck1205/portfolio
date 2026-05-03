import { CARD_ELEMENT_NAME, CARD_GRID_ELEMENT_NAME, CARD_META_ELEMENT_NAME } from "../constants/Card.constants";
import { DsCard, DsCardGrid, DsCardMeta } from "../Card";

export function defineDsCard(registry: CustomElementRegistry = customElements) {
  if (!registry.get(CARD_ELEMENT_NAME)) {
    registry.define(CARD_ELEMENT_NAME, DsCard);
  }

  if (!registry.get(CARD_GRID_ELEMENT_NAME)) {
    registry.define(CARD_GRID_ELEMENT_NAME, DsCardGrid);
  }

  if (!registry.get(CARD_META_ELEMENT_NAME)) {
    registry.define(CARD_META_ELEMENT_NAME, DsCardMeta);
  }
}
