import {
  STEP_ELEMENT_NAME,
  STEPS_CHANGE_EVENT,
  STEPS_OBSERVED_ATTRIBUTES
} from "./constants/Steps.constants";
import {
  getNonNegativeIntegerAttribute,
  getPercentAttribute,
  getStepStatus,
  getStepsOrientation,
  getStepsSize,
  getStepsStatus,
  getStepsTitlePlacement,
  getStepsType,
  getStepsVariant,
  normalizeBooleanAttribute
} from "./dom/Steps.dom";
import { clampCurrent, resolveStepStatus } from "./logic/Steps.logic";
import {
  createStepsElements,
  syncStepsElements,
  type StepsElements
} from "./render/Steps.render";
import { applyStepsStyles } from "./render/Steps.stylesheet";
import { DsStep } from "./Step";
import type {
  StepItemData,
  StepsChangeDetail,
  StepsOrientation,
  StepsSize,
  StepsStatus,
  StepsTitlePlacement,
  StepsType,
  StepsVariant
} from "./types/Steps.types";

export class DsSteps extends HTMLElement {
  static observedAttributes = STEPS_OBSERVED_ATTRIBUTES;

  private elements?: StepsElements;
  private stepObserver?: MutationObserver;

  connectedCallback() {
    this.addEventListener("ds-step-change", this.handleStepChange);
    this.observeStepChanges();
    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener("ds-step-change", this.handleStepChange);
    this.stepObserver?.disconnect();
  }

  attributeChangedCallback() {
    this.render();
  }

  get clickable() {
    return normalizeBooleanAttribute(this, "clickable", false);
  }

  set clickable(value: boolean) {
    this.toggleAttribute("clickable", value);
  }

  get current() {
    return getNonNegativeIntegerAttribute(this, "current", this.initial);
  }

  set current(value: number) {
    this.setNonNegativeNumberAttribute("current", value);
  }

  get initial() {
    return getNonNegativeIntegerAttribute(this, "initial", 0);
  }

  set initial(value: number) {
    this.setNonNegativeNumberAttribute("initial", value);
  }

  get orientation(): StepsOrientation {
    return getStepsOrientation(this);
  }

  set orientation(value: StepsOrientation) {
    this.setAttribute("orientation", value);
  }

  get percent() {
    return getPercentAttribute(this);
  }

  set percent(value: number) {
    if (Number.isFinite(value)) {
      this.setAttribute("percent", String(Math.min(Math.max(value, 0), 100)));
    }
  }

  get progressDot() {
    return normalizeBooleanAttribute(this, "progress-dot", false);
  }

  set progressDot(value: boolean) {
    this.toggleAttribute("progress-dot", value);
  }

  get size(): StepsSize {
    return getStepsSize(this);
  }

  set size(value: StepsSize) {
    this.setAttribute("size", value);
  }

  get status(): StepsStatus {
    return getStepsStatus(this);
  }

  set status(value: StepsStatus) {
    this.setAttribute("status", value);
  }

  get titlePlacement(): StepsTitlePlacement {
    return getStepsTitlePlacement(this);
  }

  set titlePlacement(value: StepsTitlePlacement) {
    this.setAttribute("title-placement", value);
  }

  get type(): StepsType {
    return getStepsType(this);
  }

  set type(value: StepsType) {
    this.setAttribute("type", value);
  }

  get variant(): StepsVariant {
    return getStepsVariant(this);
  }

  set variant(value: StepsVariant) {
    this.setAttribute("variant", value);
  }

  private handleStepChange = (event: Event) => {
    if (event.target instanceof DsStep && event.target.parentElement === this) {
      this.render();
    }
  };

  private handleStepClick = (index: number) => {
    const items = this.getStepItems();
    const nextItem = items[index];

    if (!this.clickable || !nextItem || nextItem.disabled) {
      return;
    }

    const previousCurrent = clampCurrent(this.current, items);

    if (previousCurrent === index) {
      return;
    }

    this.current = index;
    this.dispatchEvent(
      new CustomEvent<StepsChangeDetail>(STEPS_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          current: index,
          key: nextItem.key,
          previousCurrent
        }
      })
    );
  };

  private render() {
    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncStructure();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createStepsElements({
      onStepClick: this.handleStepClick
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyStepsStyles(shadowRoot);
  }

  private observeStepChanges() {
    if (this.stepObserver) {
      return;
    }

    this.stepObserver = new MutationObserver(() => {
      this.render();
    });
    this.stepObserver.observe(this, {
      childList: true
    });
  }

  private syncStructure() {
    if (!this.elements) {
      return;
    }

    const items = this.getStepItems();
    const current = clampCurrent(this.current, items);

    syncStepsElements({
      clickable: this.clickable,
      current,
      elements: this.elements,
      items,
      orientation: this.type === "inline" ? "vertical" : this.orientation,
      percent: this.percent,
      progressDot: this.progressDot,
      size: this.size,
      titlePlacement: this.progressDot ? "vertical" : this.titlePlacement,
      type: this.type,
      variant: this.variant
    });
  }

  private getStepItems(): StepItemData[] {
    const current = this.current;

    return Array.from(this.children)
      .filter((child): child is DsStep => child.localName === STEP_ELEMENT_NAME)
      .map((step, index) => ({
        description: step.description,
        disabled: step.disabled,
        icon: step.icon,
        index,
        key: step.itemKey || `step-${index}`,
        status: resolveStepStatus({
          current,
          index,
          rootStatus: this.status,
          stepStatus: getStepStatus(step)
        }),
        subTitle: step.subTitle,
        title: step.title
      }));
  }

  private setNonNegativeNumberAttribute(name: string, value: number) {
    if (Number.isFinite(value)) {
      this.setAttribute(name, String(Math.max(0, Math.floor(value))));
    }
  }
}
