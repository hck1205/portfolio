import { MESSAGE_ELEMENT_NAME } from "../constants/Message.constants";
import { DsMessage } from "../Message";

export function defineDsMessage(registry: CustomElementRegistry = customElements) {
  if (!registry.get(MESSAGE_ELEMENT_NAME)) {
    registry.define(MESSAGE_ELEMENT_NAME, DsMessage);
  }
}
