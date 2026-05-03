import { RATE_STYLES } from "./Rate.styles";

export type RateElements = {
  rootElement: HTMLDivElement;
};

type CreateRateElementsOptions = {
  onKeyDown: (event: KeyboardEvent) => void;
  onPointerLeave: () => void;
  onRateClick: (event: MouseEvent) => void;
  onRateHover: (event: PointerEvent) => void;
};

type SyncRateElementsOptions = {
  character: string;
  count: number;
  disabled: boolean;
  elements: RateElements;
  keyboard: boolean;
  tooltips: string[];
  value: number;
};

let rateStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getRateStyleSheet() {
  if (!rateStyleSheet) {
    rateStyleSheet = new CSSStyleSheet();
    rateStyleSheet.replaceSync(RATE_STYLES);
  }

  return rateStyleSheet;
}

export function applyRateStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getRateStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-rate]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsRate = "";
  styleElement.textContent = RATE_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createRateElements({
  onKeyDown,
  onPointerLeave,
  onRateClick,
  onRateHover
}: CreateRateElementsOptions): RateElements {
  const rootElement = document.createElement("div");

  rootElement.className = "ds-rate";
  rootElement.setAttribute("role", "slider");
  rootElement.tabIndex = 0;
  rootElement.addEventListener("click", (event) => {
    onRateClick(event);
  });
  rootElement.addEventListener("pointermove", onRateHover);
  rootElement.addEventListener("pointerleave", onPointerLeave);
  rootElement.addEventListener("keydown", onKeyDown);

  return {
    rootElement
  };
}

export function syncRateElements({
  character,
  count,
  disabled,
  elements,
  keyboard,
  tooltips,
  value
}: SyncRateElementsOptions) {
  elements.rootElement.setAttribute("aria-disabled", String(disabled));
  elements.rootElement.setAttribute("aria-valuemax", String(count));
  elements.rootElement.setAttribute("aria-valuemin", "0");
  elements.rootElement.setAttribute("aria-valuenow", String(value));
  elements.rootElement.setAttribute("aria-valuetext", `${value} of ${count}`);
  elements.rootElement.tabIndex = disabled || !keyboard ? -1 : 0;
  syncRateItems({ character, count, disabled, rootElement: elements.rootElement, tooltips, value });
}

function syncRateItems({
  character,
  count,
  disabled,
  rootElement,
  tooltips,
  value
}: {
  character: string;
  count: number;
  disabled: boolean;
  rootElement: HTMLDivElement;
  tooltips: string[];
  value: number;
}) {
  const currentItems = Array.from(rootElement.querySelectorAll<HTMLButtonElement>(".ds-rate__item"));

  if (currentItems.length !== count) {
    rootElement.replaceChildren(...Array.from({ length: count }, (_, index) => createRateItem(index + 1)));
  }

  for (const [index, itemElement] of Array.from(
    rootElement.querySelectorAll<HTMLButtonElement>(".ds-rate__item")
  ).entries()) {
    const itemValue = index + 1;
    const characterElement = itemElement.firstElementChild;

    itemElement.disabled = disabled;
    itemElement.dataset.value = String(itemValue);
    itemElement.dataset.active = String(value >= itemValue);
    itemElement.dataset.half = String(value > index && value < itemValue);
    itemElement.title = tooltips[index] ?? `${itemValue}`;
    itemElement.setAttribute("aria-label", itemElement.title);

    if (characterElement) {
      characterElement.textContent = character;
    }
  }
}

function createRateItem(value: number) {
  const buttonElement = document.createElement("button");
  const characterElement = document.createElement("span");

  buttonElement.className = "ds-rate__item";
  buttonElement.type = "button";
  buttonElement.dataset.value = String(value);
  buttonElement.tabIndex = -1;
  characterElement.className = "ds-rate__character";
  buttonElement.append(characterElement);

  return buttonElement;
}
