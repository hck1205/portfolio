import { PAGINATION_ELEMENT_NAME } from "../constants/Pagination.constants";
import { DsPagination } from "../Pagination";

export function defineDsPagination(registry: CustomElementRegistry = customElements) {
  if (!registry.get(PAGINATION_ELEMENT_NAME)) {
    registry.define(PAGINATION_ELEMENT_NAME, DsPagination);
  }
}
