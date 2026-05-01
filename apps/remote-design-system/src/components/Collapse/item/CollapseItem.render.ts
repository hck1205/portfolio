import { ChevronRight, createElement as createLucideElement } from "lucide";

import type {
  CollapseCollapsible,
  CollapseExpandIconPlacement,
  CollapseHeadingLevel
} from "../types/Collapse.types";
import { COLLAPSE_ITEM_STYLES } from "./CollapseItem.styles";

export type CollapseItemElements = {
  bodyElement: HTMLDivElement;
  extraElement: HTMLSpanElement;
  headingElement: HTMLElement;
  iconElement: HTMLSpanElement;
  labelElement: HTMLSpanElement;
  sectionElement: HTMLElement;
  triggerElement: HTMLButtonElement;
};

type CreateCollapseItemElementsOptions = {
  onToggle: () => void;
  panelId: string;
  triggerId: string;
};

type SyncCollapseItemElementsOptions = {
  collapsible: CollapseCollapsible;
  disabled: boolean;
  elements: CollapseItemElements;
  expandIconPlacement: CollapseExpandIconPlacement;
  extra: string;
  headingLevel: CollapseHeadingLevel;
  label: string;
  open: boolean;
  panelId: string;
  showArrow: boolean;
};

let collapseItemStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getCollapseItemStyleSheet() {
  if (!collapseItemStyleSheet) {
    collapseItemStyleSheet = new CSSStyleSheet();
    collapseItemStyleSheet.replaceSync(COLLAPSE_ITEM_STYLES);
  }

  return collapseItemStyleSheet;
}

export function applyCollapseItemStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getCollapseItemStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-collapse-item]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsCollapseItem = "";
  styleElement.textContent = COLLAPSE_ITEM_STYLES;
  shadowRoot.prepend(styleElement);
}

function createChevronIcon() {
  const icon = createLucideElement(ChevronRight, {
    "aria-hidden": "true",
    focusable: "false",
    height: 16,
    width: 16,
    "stroke-width": 2.25
  });

  icon.classList.add("ds-collapse__icon-svg");

  return icon;
}

export function createCollapseItemElements({
  onToggle,
  panelId,
  triggerId
}: CreateCollapseItemElementsOptions): CollapseItemElements {
  const sectionElement = document.createElement("section");
  sectionElement.className = "ds-collapse__item";

  const headingElement = document.createElement("div");
  headingElement.className = "ds-collapse__heading";
  headingElement.setAttribute("role", "heading");

  const triggerElement = document.createElement("button");
  triggerElement.className = "ds-collapse__trigger";
  triggerElement.id = triggerId;
  triggerElement.type = "button";
  triggerElement.addEventListener("click", onToggle);

  const iconElement = document.createElement("span");
  iconElement.className = "ds-collapse__icon";
  iconElement.setAttribute("aria-hidden", "true");
  iconElement.append(createChevronIcon());

  const labelElement = document.createElement("span");
  labelElement.className = "ds-collapse__label";

  const extraElement = document.createElement("span");
  extraElement.className = "ds-collapse__extra";

  const bodyElement = document.createElement("div");
  bodyElement.className = "ds-collapse__body";
  bodyElement.id = panelId;
  bodyElement.setAttribute("role", "region");
  bodyElement.setAttribute("aria-labelledby", triggerId);
  bodyElement.append(document.createElement("slot"));

  sectionElement.append(headingElement, bodyElement);

  return {
    bodyElement,
    extraElement,
    headingElement,
    iconElement,
    labelElement,
    sectionElement,
    triggerElement
  };
}

export function syncCollapseItemElements({
  collapsible,
  disabled,
  elements,
  expandIconPlacement,
  extra,
  headingLevel,
  label,
  open,
  panelId,
  showArrow
}: SyncCollapseItemElementsOptions) {
  const {
    bodyElement,
    extraElement,
    headingElement,
    iconElement,
    labelElement,
    triggerElement
  } = elements;

  labelElement.textContent = label;
  extraElement.hidden = !extra;
  extraElement.textContent = extra;
  triggerElement.disabled = disabled;
  headingElement.setAttribute("aria-level", String(headingLevel));
  headingElement.setAttribute("data-collapsible", collapsible);
  headingElement.setAttribute("data-icon-placement", expandIconPlacement);
  triggerElement.setAttribute("aria-controls", panelId);
  triggerElement.setAttribute("aria-expanded", String(open));
  triggerElement.setAttribute("data-collapsible", collapsible);
  triggerElement.setAttribute("data-icon-only", String(collapsible === "icon"));
  triggerElement.setAttribute("aria-label", collapsible === "icon" ? `${label} toggle` : label);
  iconElement.hidden = !showArrow;
  bodyElement.hidden = !open;

  const triggerChildren =
    expandIconPlacement === "end"
      ? [labelElement, extraElement, iconElement]
      : [iconElement, labelElement, extraElement];

  if (collapsible === "icon") {
    triggerElement.replaceChildren(iconElement);
    headingElement.replaceChildren(
      ...(expandIconPlacement === "end"
        ? [labelElement, extraElement, triggerElement]
        : [triggerElement, labelElement, extraElement])
    );
    return;
  }

  triggerElement.replaceChildren(...triggerChildren);
  headingElement.replaceChildren(triggerElement);
}
