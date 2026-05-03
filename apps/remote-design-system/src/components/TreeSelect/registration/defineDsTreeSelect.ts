import { TREE_SELECT_ELEMENT_NAME } from "../constants/TreeSelect.constants";
import { DsTreeSelect } from "../TreeSelect";

export function defineDsTreeSelect(registry: CustomElementRegistry = customElements) {
  if (!registry.get(TREE_SELECT_ELEMENT_NAME)) {
    registry.define(TREE_SELECT_ELEMENT_NAME, DsTreeSelect);
  }
}
