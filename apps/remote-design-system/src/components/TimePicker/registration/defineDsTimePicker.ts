import { TIME_PICKER_ELEMENT_NAME } from "../constants/TimePicker.constants";
import { DsTimePicker } from "../TimePicker";

export function defineDsTimePicker(registry: CustomElementRegistry = customElements) {
  if (!registry.get(TIME_PICKER_ELEMENT_NAME)) {
    registry.define(TIME_PICKER_ELEMENT_NAME, DsTimePicker);
  }
}
