import { NOTIFICATION_ELEMENT_NAME } from "../constants/Notification.constants";
import { DsNotification } from "../Notification";

export function defineDsNotification(registry: CustomElementRegistry = customElements) {
  if (!registry.get(NOTIFICATION_ELEMENT_NAME)) {
    registry.define(NOTIFICATION_ELEMENT_NAME, DsNotification);
  }
}
