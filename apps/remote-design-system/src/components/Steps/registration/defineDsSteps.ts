import { STEP_ELEMENT_NAME, STEPS_ELEMENT_NAME } from "../constants/Steps.constants";
import { DsStep } from "../Step";
import { DsSteps } from "../Steps";

export function defineDsSteps(registry: CustomElementRegistry = customElements) {
  if (!registry.get(STEP_ELEMENT_NAME)) {
    registry.define(STEP_ELEMENT_NAME, DsStep);
  }

  if (!registry.get(STEPS_ELEMENT_NAME)) {
    registry.define(STEPS_ELEMENT_NAME, DsSteps);
  }
}
