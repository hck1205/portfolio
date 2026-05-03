import { TRANSFER_ELEMENT_NAME } from "../constants/Transfer.constants";
import { DsTransfer } from "../Transfer";

export function defineDsTransfer(registry: CustomElementRegistry = customElements) {
  if (!registry.get(TRANSFER_ELEMENT_NAME)) {
    registry.define(TRANSFER_ELEMENT_NAME, DsTransfer);
  }
}
