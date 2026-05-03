import { DESCRIPTIONS_ELEMENT_NAME, DESCRIPTIONS_ITEM_ELEMENT_NAME } from "../constants/Descriptions.constants";
import { DsDescriptions } from "../Descriptions";
import { DsDescriptionsItem } from "../DescriptionsItem";

export function defineDsDescriptions(registry: CustomElementRegistry = customElements) {
  if (!registry.get(DESCRIPTIONS_ITEM_ELEMENT_NAME)) {
    registry.define(DESCRIPTIONS_ITEM_ELEMENT_NAME, DsDescriptionsItem);
  }

  if (!registry.get(DESCRIPTIONS_ELEMENT_NAME)) {
    registry.define(DESCRIPTIONS_ELEMENT_NAME, DsDescriptions);
  }
}
