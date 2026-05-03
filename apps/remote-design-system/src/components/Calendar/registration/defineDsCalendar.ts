import { CALENDAR_ELEMENT_NAME } from "../constants/Calendar.constants";
import { DsCalendar } from "../Calendar";

export function defineDsCalendar(registry: CustomElementRegistry = customElements) {
  if (!registry.get(CALENDAR_ELEMENT_NAME)) {
    registry.define(CALENDAR_ELEMENT_NAME, DsCalendar);
  }
}
