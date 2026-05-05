import { SKELETON_ELEMENT_NAME } from "../constants/Skeleton.constants";
import { DsSkeleton } from "../Skeleton";

export function defineDsSkeleton(registry: CustomElementRegistry = customElements) {
  if (!registry.get(SKELETON_ELEMENT_NAME)) {
    registry.define(SKELETON_ELEMENT_NAME, DsSkeleton);
  }
}
