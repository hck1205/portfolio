import { RADIO_ELEMENT_NAME, RADIO_GROUP_ELEMENT_NAME } from "../constants/Radio.constants";
import { DsRadio } from "../Radio";
import { DsRadioGroup } from "../RadioGroup";

export function defineDsRadio(registry: CustomElementRegistry = customElements) {
  if (!registry.get(RADIO_ELEMENT_NAME)) {
    registry.define(RADIO_ELEMENT_NAME, DsRadio);
  }

  if (!registry.get(RADIO_GROUP_ELEMENT_NAME)) {
    registry.define(RADIO_GROUP_ELEMENT_NAME, DsRadioGroup);
  }
}
