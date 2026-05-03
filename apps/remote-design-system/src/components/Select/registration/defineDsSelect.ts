import { SELECT_ELEMENT_NAME, SELECT_OPTION_ELEMENT_NAME } from "../constants/Select.constants";
import { DsSelect } from "../Select";
import { DsSelectOption } from "../SelectOption";

export function defineDsSelect(registry: CustomElementRegistry = customElements) {
  if (!registry.get(SELECT_ELEMENT_NAME)) {
    registry.define(SELECT_ELEMENT_NAME, DsSelect);
  }

  if (!registry.get(SELECT_OPTION_ELEMENT_NAME)) {
    registry.define(SELECT_OPTION_ELEMENT_NAME, DsSelectOption);
  }
}
