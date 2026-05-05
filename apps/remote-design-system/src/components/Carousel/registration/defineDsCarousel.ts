import { CAROUSEL_ELEMENT_NAME } from "../constants/Carousel.constants";
import { DsCarousel } from "../Carousel";

export function defineDsCarousel(registry: CustomElementRegistry = customElements) {
  if (!registry.get(CAROUSEL_ELEMENT_NAME)) {
    registry.define(CAROUSEL_ELEMENT_NAME, DsCarousel);
  }
}
