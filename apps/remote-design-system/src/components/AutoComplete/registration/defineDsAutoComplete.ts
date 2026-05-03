import {
  AUTO_COMPLETE_ELEMENT_NAME,
  AUTO_COMPLETE_OPTION_ELEMENT_NAME
} from "../constants/AutoComplete.constants";
import { DsAutoComplete } from "../AutoComplete";
import { DsAutoCompleteOption } from "../AutoCompleteOption";

export function defineDsAutoComplete(registry?: CustomElementRegistry) {
  const elementRegistry = registry ?? (typeof window !== "undefined" ? window.customElements : undefined);

  if (!elementRegistry) {
    return;
  }

  if (!elementRegistry.get(AUTO_COMPLETE_ELEMENT_NAME)) {
    elementRegistry.define(AUTO_COMPLETE_ELEMENT_NAME, DsAutoComplete);
  }

  if (!elementRegistry.get(AUTO_COMPLETE_OPTION_ELEMENT_NAME)) {
    elementRegistry.define(AUTO_COMPLETE_OPTION_ELEMENT_NAME, DsAutoCompleteOption);
  }
}
