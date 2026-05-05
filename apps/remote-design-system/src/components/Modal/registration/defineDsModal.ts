import { MODAL_ELEMENT_NAME } from "../constants/Modal.constants";
import { DsModal } from "../Modal";

export function defineDsModal(registry: CustomElementRegistry = customElements) {
  if (!registry.get(MODAL_ELEMENT_NAME)) {
    registry.define(MODAL_ELEMENT_NAME, DsModal);
  }
}
