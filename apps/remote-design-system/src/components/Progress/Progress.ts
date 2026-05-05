import { PROGRESS_OBSERVED_ATTRIBUTES } from "./constants/Progress.constants";
import {
  clampPercent,
  getNumberAttribute,
  getProgressSize,
  getProgressStatus,
  getProgressType,
  normalizeBooleanAttribute
} from "./dom/Progress.dom";
import { createProgressElements, type ProgressElements } from "./dom/Progress.structure";
import { getProgressStatusIconMarkup } from "./icons/Progress.icons";
import { applyProgressStyles } from "./styles/Progress.stylesheet";
import type { ProgressSize, ProgressStatus, ProgressType } from "./types/Progress.types";

const CIRCLE_RADIUS = 42;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export class DsProgress extends HTMLElement {
  static observedAttributes = PROGRESS_OBSERVED_ATTRIBUTES;

  private elements?: ProgressElements;
  private renderedStatusIcon = "";

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get percent() {
    return clampPercent(getNumberAttribute(this, "percent", 0));
  }

  set percent(value: number) {
    this.setAttribute("percent", String(value));
  }

  get format() {
    return this.getAttribute("format") ?? "";
  }

  set format(value: string) {
    this.setAttribute("format", value);
  }

  get showInfo() {
    return normalizeBooleanAttribute(this, "show-info", true);
  }

  set showInfo(value: boolean) {
    this.setAttribute("show-info", String(value));
  }

  get size(): ProgressSize {
    return getProgressSize(this);
  }

  set size(value: ProgressSize) {
    this.setAttribute("size", value);
  }

  get status(): ProgressStatus {
    return this.percent >= 100 ? "success" : getProgressStatus(this);
  }

  set status(value: ProgressStatus) {
    this.setAttribute("status", value);
  }

  get steps() {
    return Math.max(2, Math.floor(getNumberAttribute(this, "steps", 5)));
  }

  set steps(value: number) {
    this.setAttribute("steps", String(value));
  }

  get type(): ProgressType {
    return getProgressType(this);
  }

  set type(value: ProgressType) {
    this.setAttribute("type", value);
  }

  private render() {
    if (!this.isConnected && !this.elements) {
      return;
    }

    const elements = this.elements ?? this.initializeStructure();
    const percent = this.percent;
    const status = this.status;
    const type = this.type;
    const { barElement, circleBarElement, infoElement, infoTextElement, rootElement } = elements;

    rootElement.setAttribute("role", "progressbar");
    rootElement.setAttribute("aria-valuemin", "0");
    rootElement.setAttribute("aria-valuemax", "100");
    rootElement.setAttribute("aria-valuenow", String(percent));
    rootElement.dataset.size = this.size;
    rootElement.dataset.status = status;
    rootElement.dataset.type = type;

    barElement.style.width = `${percent}%`;
    circleBarElement.setAttribute("stroke-dasharray", String(CIRCLE_CIRCUMFERENCE));
    circleBarElement.setAttribute("stroke-dashoffset", String(CIRCLE_CIRCUMFERENCE * (1 - percent / 100)));
    infoElement.hidden = !this.showInfo;
    infoElement.dataset.status = status;
    infoTextElement.textContent = this.formatPercent(percent);

    this.syncStatusIcon(elements, status, type);
    this.syncSteps(elements, percent);
  }

  private formatPercent(percent: number) {
    const roundedPercent = String(Math.round(percent));

    return this.format ? this.format.replaceAll("{percent}", roundedPercent) : `${roundedPercent}%`;
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const elements = createProgressElements();

    shadowRoot.replaceChildren(elements.rootElement);
    applyProgressStyles(shadowRoot);
    this.elements = elements;

    return elements;
  }

  private syncStatusIcon({ statusIconElement }: ProgressElements, status: ProgressStatus, type: ProgressType) {
    const iconMarkup = type === "circle" ? getProgressStatusIconMarkup(status) : "";

    statusIconElement.hidden = !iconMarkup;
    if (this.renderedStatusIcon !== iconMarkup) {
      statusIconElement.innerHTML = iconMarkup;
      this.renderedStatusIcon = iconMarkup;
    }
  }

  private syncSteps({ stepsElement }: ProgressElements, percent: number) {
    const stepCount = this.steps;
    const activeCount = Math.round((percent / 100) * stepCount);

    if (stepsElement.childElementCount !== stepCount) {
      stepsElement.replaceChildren(
        ...Array.from({ length: stepCount }, () => {
          const step = document.createElement("span");

          step.className = "ds-progress__step";
          step.setAttribute("part", "step");
          return step;
        })
      );
    }

    Array.from(stepsElement.children).forEach((step, index) => {
      (step as HTMLElement).dataset.active = String(index < activeCount);
    });
  }
}
