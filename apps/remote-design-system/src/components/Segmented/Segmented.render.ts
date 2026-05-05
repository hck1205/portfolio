import { SEGMENTED_STYLES } from "./Segmented.styles";
import { BarChart3, CalendarDays, Table2, createElement as createLucideElement } from "lucide";
import type { IconNode } from "lucide";

import type { SegmentedIconName, SegmentedOption } from "./types/Segmented.types";

export type SegmentedElements = {
  indicatorElement: HTMLSpanElement;
  rootElement: HTMLDivElement;
};

type SegmentedState = {
  disabled: boolean;
  elements: SegmentedElements;
  name: string;
  options: SegmentedOption[];
  value: string;
};

let segmentedStyleSheet: CSSStyleSheet | undefined;

const segmentedIcons = {
  calendar: CalendarDays,
  chart: BarChart3,
  table: Table2
} satisfies Record<SegmentedIconName, IconNode>;

const SEGMENTED_ITEM_SELECTOR = ".ds-segmented__item";
const SELECTED_SEGMENTED_ITEM_SELECTOR = `${SEGMENTED_ITEM_SELECTOR}[data-selected="true"]`;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getSegmentedStyleSheet() {
  if (!segmentedStyleSheet) {
    segmentedStyleSheet = new CSSStyleSheet();
    segmentedStyleSheet.replaceSync(SEGMENTED_STYLES);
  }

  return segmentedStyleSheet;
}

export function applySegmentedStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getSegmentedStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-segmented]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsSegmented = "";
  styleElement.textContent = SEGMENTED_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createSegmentedElements(onClick: (event: MouseEvent) => void, onKeyDown: (event: KeyboardEvent) => void) {
  const rootElement = document.createElement("div");
  const indicatorElement = document.createElement("span");

  rootElement.className = "ds-segmented";
  rootElement.setAttribute("role", "radiogroup");
  rootElement.addEventListener("click", onClick);
  rootElement.addEventListener("keydown", onKeyDown);
  indicatorElement.className = "ds-segmented__indicator";
  indicatorElement.setAttribute("aria-hidden", "true");
  rootElement.append(indicatorElement);

  return {
    indicatorElement,
    rootElement
  } satisfies SegmentedElements;
}

export function syncSegmentedState({ disabled, elements, name, options, value }: SegmentedState) {
  const structureSignature = createSegmentedStructureSignature({ disabled, name, options });

  if (elements.rootElement.dataset.structureSignature !== structureSignature) {
    elements.rootElement.replaceChildren(
      elements.indicatorElement,
      ...options.map((option) => createSegmentedItem(option, value, disabled, name))
    );
    elements.rootElement.dataset.structureSignature = structureSignature;
    return;
  }

  syncSegmentedSelection(elements.rootElement, value);
}

export function syncSegmentedIndicator({ indicatorElement, rootElement }: SegmentedElements) {
  const selectedItem = rootElement.querySelector<HTMLButtonElement>(SELECTED_SEGMENTED_ITEM_SELECTOR);

  if (!selectedItem) {
    indicatorElement.hidden = true;
    return;
  }

  indicatorElement.hidden = false;
  setStylePropertyIfChanged(indicatorElement, "height", `${selectedItem.offsetHeight}px`);
  setStylePropertyIfChanged(
    indicatorElement,
    "transform",
    `translate3d(${selectedItem.offsetLeft}px, ${selectedItem.offsetTop}px, 0)`
  );
  setStylePropertyIfChanged(indicatorElement, "width", `${selectedItem.offsetWidth}px`);
}

function createSegmentedStructureSignature({
  disabled,
  name,
  options
}: Pick<SegmentedState, "disabled" | "name" | "options">) {
  return JSON.stringify({
    disabled,
    name,
    options
  });
}

function syncSegmentedSelection(rootElement: HTMLDivElement, value: string) {
  rootElement.querySelectorAll<HTMLButtonElement>(SEGMENTED_ITEM_SELECTOR).forEach((item) => {
    const selected = item.dataset.value === value;

    item.dataset.selected = String(selected);
    item.setAttribute("aria-checked", String(selected));
    item.tabIndex = selected && !item.disabled ? 0 : -1;
  });
}

function setStylePropertyIfChanged(element: HTMLElement, name: string, value: string) {
  if (element.style.getPropertyValue(name) !== value) {
    element.style.setProperty(name, value);
  }
}

function createSegmentedItem(option: SegmentedOption, value: string, disabled: boolean, name: string) {
  const button = document.createElement("button");
  const label = document.createElement("span");
  const icon = option.icon ? createSegmentedIcon(option.icon) : undefined;
  const selected = option.value === value;

  button.className = "ds-segmented__item";
  button.type = "button";
  button.dataset.value = option.value;
  button.dataset.selected = String(selected);
  button.disabled = disabled || Boolean(option.disabled);
  button.setAttribute("aria-checked", String(selected));
  button.setAttribute("role", "radio");
  button.tabIndex = selected && !button.disabled ? 0 : -1;
  button.title = option.label;
  button.dataset.name = name;
  label.className = "ds-segmented__label";
  label.textContent = option.label;
  button.append(...(icon ? [icon] : []), label);

  return button;
}

function createSegmentedIcon(name: SegmentedIconName) {
  const wrapper = document.createElement("span");
  const icon = createLucideElement(segmentedIcons[name]);

  wrapper.className = "ds-segmented__icon";
  wrapper.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.setAttribute("height", "14");
  icon.setAttribute("width", "14");
  wrapper.append(icon);

  return wrapper;
}
