import { DATE_PICKER_ELEMENT_NAME } from "../constants/DatePicker.constants";
import { DsDatePicker } from "../DatePicker";

export function defineDsDatePicker(registry: CustomElementRegistry = customElements) {
  if (!registry.get(DATE_PICKER_ELEMENT_NAME)) {
    registry.define(DATE_PICKER_ELEMENT_NAME, DsDatePicker);
  }
}
