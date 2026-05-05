export type ProgressElements = {
  barElement: HTMLDivElement;
  circleBarElement: SVGCircleElement;
  infoElement: HTMLSpanElement;
  infoTextElement: HTMLSpanElement;
  rootElement: HTMLDivElement;
  stepsElement: HTMLDivElement;
  statusIconElement: HTMLSpanElement;
};

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const CIRCLE_ATTRIBUTES = {
  cx: "50",
  cy: "50",
  r: "42"
};

export function createProgressElements(): ProgressElements {
  const rootElement = createPartElement("div", "ds-progress", "root");
  const trackElement = createPartElement("div", "ds-progress__track", "track");
  const barElement = createPartElement("div", "ds-progress__bar", "bar");
  const circleElement = createPartElement("div", "ds-progress__circle", "circle");
  const stepsElement = createPartElement("div", "ds-progress__steps", "steps");
  const infoElement = createPartElement("span", "ds-progress__info", "info");
  const statusIconElement = createPartElement("span", "ds-progress__status-icon", "status-icon");
  const infoTextElement = createPartElement("span", "ds-progress__info-text", "info-text");
  const svg = document.createElementNS(SVG_NAMESPACE, "svg");
  const circleTrackElement = createCircleElement("ds-progress__circle-track", "circle-track");
  const circleBarElement = createCircleElement("ds-progress__circle-bar", "circle-bar");

  svg.setAttribute("viewBox", "0 0 100 100");
  trackElement.append(barElement);
  svg.append(circleTrackElement, circleBarElement);
  circleElement.append(svg);
  infoElement.append(statusIconElement, infoTextElement);
  rootElement.append(trackElement, circleElement, stepsElement, infoElement);

  return {
    barElement,
    circleBarElement,
    infoElement,
    infoTextElement,
    rootElement,
    stepsElement,
    statusIconElement
  };
}

function createPartElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className: string,
  partName: string
) {
  const element = document.createElement(tagName);

  element.className = className;
  element.setAttribute("part", partName);

  return element;
}

function createCircleElement(className: string, partName: string) {
  const element = document.createElementNS(SVG_NAMESPACE, "circle");

  element.classList.add(className);
  element.setAttribute("part", partName);
  Object.entries(CIRCLE_ATTRIBUTES).forEach(([name, value]) => element.setAttribute(name, value));

  return element;
}
