import { SEGMENTED_STYLES } from "./Segmented.styles";
import type { SegmentedOption } from "./types/Segmented.types";

export type SegmentedElements = {
  rootElement: HTMLDivElement;
};

let segmentedStyleSheet: CSSStyleSheet | undefined;

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

  rootElement.className = "ds-segmented";
  rootElement.setAttribute("role", "radiogroup");
  rootElement.addEventListener("click", onClick);
  rootElement.addEventListener("keydown", onKeyDown);

  return {
    rootElement
  } satisfies SegmentedElements;
}

export function syncSegmentedOptions({
  disabled,
  name,
  options,
  rootElement,
  value
}: {
  disabled: boolean;
  name: string;
  options: SegmentedOption[];
  rootElement: HTMLDivElement;
  value: string;
}) {
  rootElement.replaceChildren(...options.map((option) => createSegmentedItem(option, value, disabled, name)));
}

function createSegmentedItem(option: SegmentedOption, value: string, disabled: boolean, name: string) {
  const button = document.createElement("button");
  const label = document.createElement("span");
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
  button.append(label);

  return button;
}
