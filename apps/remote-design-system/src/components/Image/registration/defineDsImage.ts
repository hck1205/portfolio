import { IMAGE_ELEMENT_NAME } from "../constants/Image.constants";
import { DsImage } from "../Image";

export function defineDsImage(registry: CustomElementRegistry = customElements) {
  if (!registry.get(IMAGE_ELEMENT_NAME)) {
    registry.define(IMAGE_ELEMENT_NAME, DsImage);
  }
}
