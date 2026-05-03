import { SLIDER_ELEMENT_NAME } from "../constants/Slider.constants";
import { DsSlider } from "../Slider";

export function defineDsSlider(registry: CustomElementRegistry = customElements) {
  if (!registry.get(SLIDER_ELEMENT_NAME)) {
    registry.define(SLIDER_ELEMENT_NAME, DsSlider);
  }
}
