import { ALERT_ELEMENT_NAME } from "../constants/Alert.constants";
import { DsAlert } from "../Alert";

export function defineDsAlert(registry: CustomElementRegistry = customElements) {
  if (!registry.get(ALERT_ELEMENT_NAME)) {
    registry.define(ALERT_ELEMENT_NAME, DsAlert);
  }
}
