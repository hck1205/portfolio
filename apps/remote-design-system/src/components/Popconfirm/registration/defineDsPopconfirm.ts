import { POPCONFIRM_ELEMENT_NAME } from "../constants/Popconfirm.constants";
import { DsPopconfirm } from "../Popconfirm";

export function defineDsPopconfirm(registry: CustomElementRegistry = customElements) {
  if (!registry.get(POPCONFIRM_ELEMENT_NAME)) {
    registry.define(POPCONFIRM_ELEMENT_NAME, DsPopconfirm);
  }
}
