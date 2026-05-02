import { TAB_ELEMENT_NAME, TABS_ELEMENT_NAME } from "../constants/Tabs.constants";
import { DsTab } from "../Tab";
import { DsTabs } from "../Tabs";

export function defineDsTabs(registry: CustomElementRegistry = customElements) {
  if (!registry.get(TAB_ELEMENT_NAME)) {
    registry.define(TAB_ELEMENT_NAME, DsTab);
  }

  if (!registry.get(TABS_ELEMENT_NAME)) {
    registry.define(TABS_ELEMENT_NAME, DsTabs);
  }
}
