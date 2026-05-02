import type { StepItemData } from "../types/Steps.types";
import { createIndicatorContent, getIndicatorSignature } from "./Steps.icons";
import { createPanelArrowElement } from "./Steps.panelArrow";

export type StepsElements = {
  listElement: HTMLOListElement;
  rootElement: HTMLElement;
};

type StepElementRefs = {
  controlElement: HTMLElement;
  descriptionElement: HTMLElement;
  iconLabelElement: HTMLElement;
  indicatorElement: HTMLElement;
  subTitleElement: HTMLElement;
  titleElement: HTMLElement;
};

type CreateStepsElementsOptions = {
  onStepClick: (index: number) => void;
};

type SyncStepsElementsOptions = {
  clickable: boolean;
  current: number;
  elements: StepsElements;
  items: StepItemData[];
  orientation: string;
  percent: number;
  progressDot: boolean;
  size: string;
  titlePlacement: string;
  type: string;
  variant: string;
};

const stepElementRefs = new WeakMap<HTMLElement, StepElementRefs>();

export function createStepsElements({ onStepClick }: CreateStepsElementsOptions): StepsElements {
  const rootElement = document.createElement("nav");
  const listElement = document.createElement("ol");

  rootElement.className = "ds-steps";
  rootElement.setAttribute("aria-label", "Steps");
  listElement.className = "ds-steps__list";
  listElement.addEventListener("click", (event) => {
    const controlElement = (event.target as Element | null)?.closest<HTMLElement>("[data-step-index]");

    if (!controlElement || controlElement.getAttribute("aria-disabled") === "true") {
      return;
    }

    onStepClick(Number(controlElement.dataset.stepIndex));
  });
  rootElement.append(listElement);

  return {
    listElement,
    rootElement
  };
}

export function syncStepsElements({
  clickable,
  current,
  elements,
  items,
  orientation,
  percent,
  progressDot,
  size,
  titlePlacement,
  type,
  variant
}: SyncStepsElementsOptions) {
  elements.rootElement.dataset.orientation = orientation;
  elements.rootElement.dataset.size = size;
  elements.rootElement.dataset.titlePlacement = titlePlacement;
  elements.rootElement.dataset.type = progressDot ? "dot" : type;
  elements.rootElement.dataset.variant = variant;
  elements.rootElement.setAttribute("aria-orientation", orientation);

  const structureSignature = getStructureSignature({ clickable, type });
  const shouldRebuild =
    elements.listElement.dataset.structureSignature !== structureSignature ||
    elements.listElement.children.length !== items.length ||
    items.some((item, index) => elements.listElement.children.item(index)?.getAttribute("data-step-key") !== item.key);

  if (shouldRebuild) {
    elements.listElement.dataset.structureSignature = structureSignature;
    elements.listElement.replaceChildren(
      ...items.map((item) =>
        createStepElement({
          clickable,
          current,
          item,
          percent,
          progressDot: progressDot || type === "dot",
          type
        })
      )
    );
    return;
  }

  items.forEach((item, index) => {
    const listItemElement = elements.listElement.children.item(index);

    if (listItemElement instanceof HTMLElement) {
      syncStepElement({
        clickable,
        current,
        item,
        listItemElement,
        percent,
        progressDot: progressDot || type === "dot"
      });
    }
  });
}

function createStepElement({
  clickable,
  current,
  item,
  percent,
  progressDot,
  type
}: {
  clickable: boolean;
  current: number;
  item: StepItemData;
  percent: number;
  progressDot: boolean;
  type: string;
}) {
  const listItemElement = document.createElement("li");
  const controlElement = clickable ? document.createElement("button") : document.createElement("div");
  const indicatorElement = document.createElement("span");
  const iconLabelElement = document.createElement("span");
  const contentElement = document.createElement("span");
  const headingElement = document.createElement("span");
  const titleElement = document.createElement("span");
  const subTitleElement = document.createElement("span");
  const descriptionElement = document.createElement("span");
  const tailElement = document.createElement("span");
  const refs = {
    controlElement,
    descriptionElement,
    iconLabelElement,
    indicatorElement,
    subTitleElement,
    titleElement
  };

  listItemElement.className = "ds-steps__item";
  listItemElement.dataset.stepKey = item.key;
  listItemElement.dataset.status = item.status;
  controlElement.className = "ds-steps__control";
  controlElement.dataset.stepIndex = String(item.index);
  controlElement.setAttribute("aria-current", item.index === current ? "step" : "false");
  controlElement.setAttribute("aria-disabled", String(item.disabled));

  if (clickable) {
    controlElement.classList.add("ds-steps__control--clickable");
    (controlElement as HTMLButtonElement).type = "button";
    (controlElement as HTMLButtonElement).disabled = item.disabled;
  }

  indicatorElement.className = "ds-steps__indicator";
  iconLabelElement.className = "ds-steps__icon-label";
  iconLabelElement.dataset.indicatorSignature = getIndicatorSignature(item, progressDot);
  iconLabelElement.append(createIndicatorContent(item, progressDot));
  indicatorElement.append(iconLabelElement);

  if (item.index === current && percent > 0 && item.status === "process" && !progressDot) {
    const progressElement = document.createElement("span");

    progressElement.className = "ds-steps__progress";
    progressElement.style.setProperty("--ds-step-progress", `${percent}%`);
    indicatorElement.append(progressElement);
  }

  contentElement.className = "ds-steps__content";
  headingElement.className = "ds-steps__heading";
  titleElement.className = "ds-steps__title";
  titleElement.textContent = item.title;
  subTitleElement.className = "ds-steps__subtitle";
  subTitleElement.hidden = !item.subTitle;
  subTitleElement.textContent = item.subTitle;
  descriptionElement.className = "ds-steps__description";
  descriptionElement.hidden = !item.description;
  descriptionElement.textContent = item.description;
  tailElement.className = "ds-steps__tail";
  tailElement.setAttribute("aria-hidden", "true");

  headingElement.append(titleElement, subTitleElement);
  contentElement.append(headingElement, descriptionElement);
  controlElement.append(indicatorElement, contentElement);
  listItemElement.append(controlElement, tailElement);

  if (type === "panel") {
    listItemElement.append(createPanelArrowElement());
  }

  stepElementRefs.set(listItemElement, refs);

  return listItemElement;
}

function syncStepElement({
  clickable,
  current,
  item,
  listItemElement,
  percent,
  progressDot
}: {
  clickable: boolean;
  current: number;
  item: StepItemData;
  listItemElement: HTMLElement;
  percent: number;
  progressDot: boolean;
}) {
  const refs = getStepElementRefs(listItemElement);

  if (!refs) {
    return;
  }

  const {
    controlElement,
    descriptionElement,
    iconLabelElement,
    indicatorElement,
    subTitleElement,
    titleElement
  } = refs;

  listItemElement.dataset.status = item.status;
  controlElement.dataset.stepIndex = String(item.index);
  controlElement.setAttribute("aria-current", item.index === current ? "step" : "false");
  controlElement.setAttribute("aria-disabled", String(item.disabled));
  controlElement.classList.toggle("ds-steps__control--clickable", clickable);

  if (controlElement instanceof HTMLButtonElement) {
    controlElement.disabled = item.disabled;
  }

  const indicatorSignature = getIndicatorSignature(item, progressDot);

  if (iconLabelElement.dataset.indicatorSignature !== indicatorSignature) {
    iconLabelElement.replaceChildren(createIndicatorContent(item, progressDot));
    iconLabelElement.dataset.indicatorSignature = indicatorSignature;
  }

  syncProgressElement({
    current,
    indicatorElement,
    item,
    percent,
    progressDot
  });

  titleElement.textContent = item.title;
  subTitleElement.hidden = !item.subTitle;
  subTitleElement.textContent = item.subTitle;
  descriptionElement.hidden = !item.description;
  descriptionElement.textContent = item.description;
}

function getStepElementRefs(listItemElement: HTMLElement) {
  const cachedRefs = stepElementRefs.get(listItemElement);

  if (cachedRefs) {
    return cachedRefs;
  }

  const refs = {
    controlElement: listItemElement.querySelector<HTMLElement>(".ds-steps__control"),
    descriptionElement: listItemElement.querySelector<HTMLElement>(".ds-steps__description"),
    iconLabelElement: listItemElement.querySelector<HTMLElement>(".ds-steps__icon-label"),
    indicatorElement: listItemElement.querySelector<HTMLElement>(".ds-steps__indicator"),
    subTitleElement: listItemElement.querySelector<HTMLElement>(".ds-steps__subtitle"),
    titleElement: listItemElement.querySelector<HTMLElement>(".ds-steps__title")
  };

  if (
    !refs.controlElement ||
    !refs.descriptionElement ||
    !refs.iconLabelElement ||
    !refs.indicatorElement ||
    !refs.subTitleElement ||
    !refs.titleElement
  ) {
    return undefined;
  }

  stepElementRefs.set(listItemElement, refs as StepElementRefs);

  return refs as StepElementRefs;
}

function syncProgressElement({
  current,
  indicatorElement,
  item,
  percent,
  progressDot
}: {
  current: number;
  indicatorElement: HTMLElement;
  item: StepItemData;
  percent: number;
  progressDot: boolean;
}) {
  const progressElement = indicatorElement.querySelector<HTMLElement>(".ds-steps__progress");
  const shouldShowProgress = item.index === current && percent > 0 && item.status === "process" && !progressDot;

  if (!shouldShowProgress) {
    progressElement?.remove();
    return;
  }

  const nextProgressElement = progressElement ?? document.createElement("span");

  nextProgressElement.className = "ds-steps__progress";
  nextProgressElement.style.setProperty("--ds-step-progress", `${percent}%`);

  if (!progressElement) {
    indicatorElement.append(nextProgressElement);
  }
}

function getStructureSignature({ clickable, type }: { clickable: boolean; type?: string }) {
  return `${clickable ? "button" : "static"}:${type ?? "default"}`;
}
