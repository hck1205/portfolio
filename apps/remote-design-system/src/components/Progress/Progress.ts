import { PROGRESS_OBSERVED_ATTRIBUTES } from "./constants/Progress.constants";
import {
  clampPercent,
  getNumberAttribute,
  getProgressSize,
  getProgressStatus,
  getProgressType,
  normalizeBooleanAttribute
} from "./dom/Progress.dom";
import { PROGRESS_STYLES } from "./Progress.styles";
import type { ProgressSize, ProgressStatus, ProgressType } from "./types/Progress.types";

let progressStyleSheet: CSSStyleSheet | undefined;

export class DsProgress extends HTMLElement {
  static observedAttributes = PROGRESS_OBSERVED_ATTRIBUTES;

  private barElement?: HTMLDivElement;
  private circleBarElement?: SVGCircleElement;
  private circleElement?: HTMLDivElement;
  private infoElement?: HTMLSpanElement;
  private rootElement?: HTMLDivElement;
  private stepsElement?: HTMLDivElement;
  private trackElement?: HTMLDivElement;

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
    if (!this.isConnected && !this.rootElement) {
      return;
    }

    if (!this.rootElement) {
      this.initializeStructure();
    }

    const percent = this.percent;
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const rootElement = this.rootElement;

    rootElement?.setAttribute("role", "progressbar");
    rootElement?.setAttribute("aria-valuemin", "0");
    rootElement?.setAttribute("aria-valuemax", "100");
    rootElement?.setAttribute("aria-valuenow", String(percent));

    if (rootElement) {
      rootElement.dataset.size = this.size;
      rootElement.dataset.status = this.status;
      rootElement.dataset.type = this.type;
    }
    if (this.barElement) {
      this.barElement.style.width = `${percent}%`;
    }
    if (this.circleBarElement) {
      this.circleBarElement.setAttribute("stroke-dasharray", String(circumference));
      this.circleBarElement.setAttribute("stroke-dashoffset", String(circumference * (1 - percent / 100)));
    }
    if (this.infoElement) {
      this.infoElement.hidden = !this.showInfo;
      this.infoElement.textContent = `${Math.round(percent)}%`;
    }
    this.syncSteps(percent);
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const rootElement = document.createElement("div");
    const trackElement = document.createElement("div");
    const barElement = document.createElement("div");
    const circleElement = document.createElement("div");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const circleTrack = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const circleBarElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const stepsElement = document.createElement("div");
    const infoElement = document.createElement("span");

    rootElement.className = "ds-progress";
    trackElement.className = "ds-progress__track";
    barElement.className = "ds-progress__bar";
    circleElement.className = "ds-progress__circle";
    circleTrack.classList.add("ds-progress__circle-track");
    circleBarElement.classList.add("ds-progress__circle-bar");
    stepsElement.className = "ds-progress__steps";
    infoElement.className = "ds-progress__info";
    rootElement.setAttribute("part", "root");
    trackElement.setAttribute("part", "track");
    barElement.setAttribute("part", "bar");
    circleElement.setAttribute("part", "circle");
    stepsElement.setAttribute("part", "steps");
    infoElement.setAttribute("part", "info");
    svg.setAttribute("viewBox", "0 0 100 100");
    circleTrack.setAttribute("cx", "50");
    circleTrack.setAttribute("cy", "50");
    circleTrack.setAttribute("r", "42");
    circleBarElement.setAttribute("cx", "50");
    circleBarElement.setAttribute("cy", "50");
    circleBarElement.setAttribute("r", "42");
    trackElement.append(barElement);
    svg.append(circleTrack, circleBarElement);
    circleElement.append(svg);
    rootElement.append(trackElement, circleElement, stepsElement, infoElement);
    shadowRoot.replaceChildren(rootElement);
    applyProgressStyles(shadowRoot);
    this.rootElement = rootElement;
    this.trackElement = trackElement;
    this.barElement = barElement;
    this.circleElement = circleElement;
    this.circleBarElement = circleBarElement;
    this.stepsElement = stepsElement;
    this.infoElement = infoElement;
  }

  private syncSteps(percent: number) {
    if (!this.stepsElement) {
      return;
    }

    const activeCount = Math.round((percent / 100) * this.steps);
    const existingSteps = Array.from(this.stepsElement.children);

    if (existingSteps.length !== this.steps) {
      this.stepsElement.replaceChildren(
        ...Array.from({ length: this.steps }, () => {
          const step = document.createElement("span");

          step.className = "ds-progress__step";
          return step;
        })
      );
    }

    Array.from(this.stepsElement.children).forEach((step, index) => {
      (step as HTMLElement).dataset.active = String(index < activeCount);
    });
  }
}

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function applyProgressStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    if (!progressStyleSheet) {
      progressStyleSheet = new CSSStyleSheet();
      progressStyleSheet.replaceSync(PROGRESS_STYLES);
    }

    if (!shadowRoot.adoptedStyleSheets.includes(progressStyleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, progressStyleSheet];
    }

    return;
  }

  const styleElement = document.createElement("style");

  styleElement.textContent = PROGRESS_STYLES;
  shadowRoot.prepend(styleElement);
}
