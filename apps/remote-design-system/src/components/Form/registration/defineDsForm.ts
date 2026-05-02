import { FORM_ELEMENT_NAME, FORM_ITEM_ELEMENT_NAME } from "../constants/Form.constants";
import { DsForm } from "../Form";
import { DsFormItem } from "../FormItem";

export function defineDsForm(registry: CustomElementRegistry | undefined = globalThis.customElements) {
  if (!registry) {
    return;
  }

  if (!registry.get(FORM_ELEMENT_NAME)) {
    registry.define(FORM_ELEMENT_NAME, DsForm);
  }

  if (!registry.get(FORM_ITEM_ELEMENT_NAME)) {
    registry.define(FORM_ITEM_ELEMENT_NAME, DsFormItem);
  }
}
