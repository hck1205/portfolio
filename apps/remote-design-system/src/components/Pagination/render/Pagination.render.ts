import { ChevronDown, ChevronLeft, ChevronRight, Ellipsis, createElement as createLucideElement } from "lucide";

import { PAGINATION_STYLES } from "../Pagination.styles";
import type { PaginationItem } from "../types/Pagination.types";

export type PaginationElements = {
  listElement: HTMLUListElement;
  nextListElement: HTMLUListElement;
  rootElement: HTMLElement;
  simpleElement: HTMLSpanElement;
  sizeChangerElement: HTMLSpanElement;
  sizeSelectElement: HTMLSelectElement;
  quickElement: HTMLLabelElement;
  quickInputElement: HTMLInputElement;
};

type CreatePaginationElementsOptions = {
  onPageClick: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onQuickJump: (page: number) => void;
};

type SyncPaginationElementsOptions = {
  current: number;
  disabled: boolean;
  elements: PaginationElements;
  items: PaginationItem[];
  pageCount: number;
  pageSize: number;
  pageSizeOptions: number[];
  showQuickJumper: boolean;
  showSizeChanger: boolean;
  simple: boolean;
};

let paginationStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getPaginationStyleSheet() {
  if (!paginationStyleSheet) {
    paginationStyleSheet = new CSSStyleSheet();
    paginationStyleSheet.replaceSync(PAGINATION_STYLES);
  }

  return paginationStyleSheet;
}

export function applyPaginationStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getPaginationStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-pagination]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsPagination = "";
  styleElement.textContent = PAGINATION_STYLES;
  shadowRoot.prepend(styleElement);
}

export function createPaginationElements({
  onPageClick,
  onPageSizeChange,
  onQuickJump
}: CreatePaginationElementsOptions): PaginationElements {
  const rootElement = document.createElement("nav");
  const listElement = document.createElement("ul");
  const nextListElement = document.createElement("ul");
  const simpleElement = document.createElement("span");
  const sizeChangerElement = document.createElement("span");
  const sizeSelectElement = document.createElement("select");
  const sizeIconElement = document.createElement("span");
  const quickElement = document.createElement("label");
  const quickTextElement = document.createElement("span");
  const quickInputElement = document.createElement("input");

  rootElement.className = "ds-pagination";
  rootElement.setAttribute("aria-label", "Pagination");
  listElement.className = "ds-pagination__list";
  nextListElement.className = "ds-pagination__list";
  simpleElement.className = "ds-pagination__simple";
  sizeChangerElement.className = "ds-pagination__size-changer";
  sizeSelectElement.className = "ds-pagination__size-select";
  sizeSelectElement.setAttribute("aria-label", "Items per page");
  sizeIconElement.className = "ds-pagination__size-icon";
  sizeIconElement.setAttribute("aria-hidden", "true");
  sizeIconElement.append(createIcon(ChevronDown));
  quickElement.className = "ds-pagination__quick";
  quickTextElement.textContent = "Go to";
  quickInputElement.className = "ds-pagination__quick-input";
  quickInputElement.inputMode = "numeric";
  quickInputElement.min = "1";
  quickInputElement.type = "number";
  quickInputElement.setAttribute("aria-label", "Page number");

  const handleListClick = (event: Event) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-page]");

    if (!button || button.disabled) {
      return;
    }

    onPageClick(Number(button.dataset.page));
  };

  listElement.addEventListener("click", handleListClick);
  nextListElement.addEventListener("click", handleListClick);
  sizeSelectElement.addEventListener("change", () => {
    onPageSizeChange(Number(sizeSelectElement.value));
  });
  const commitQuickJump = () => {
    onQuickJump(Number(quickInputElement.value));
    quickInputElement.value = "";
  };

  quickInputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      commitQuickJump();
    }
  });
  quickInputElement.addEventListener("change", () => {
    commitQuickJump();
  });

  sizeChangerElement.append(sizeSelectElement, sizeIconElement);
  quickElement.append(quickTextElement, quickInputElement);
  rootElement.append(listElement, simpleElement, nextListElement, sizeChangerElement, quickElement);

  return {
    listElement,
    nextListElement,
    rootElement,
    simpleElement,
    sizeChangerElement,
    sizeSelectElement,
    quickElement,
    quickInputElement
  };
}

export function syncPaginationElements({
  current,
  disabled,
  elements,
  items,
  pageCount,
  pageSize,
  pageSizeOptions,
  showQuickJumper,
  showSizeChanger,
  simple
}: SyncPaginationElementsOptions) {
  elements.rootElement.setAttribute("aria-disabled", String(disabled));
  elements.listElement.hidden = false;
  elements.nextListElement.hidden = !simple;
  elements.simpleElement.hidden = !simple;
  elements.sizeChangerElement.hidden = !showSizeChanger;
  elements.sizeSelectElement.disabled = disabled;
  elements.quickElement.hidden = !showQuickJumper;
  elements.quickInputElement.disabled = disabled;
  elements.quickInputElement.max = String(pageCount);
  elements.quickInputElement.placeholder = String(current);

  syncPageSizeOptions(elements.sizeSelectElement, pageSizeOptions, pageSize);

  if (simple) {
    syncSimpleElement(elements.simpleElement, current, pageCount);
    syncListElement(
      elements.listElement,
      items.filter((item) => item.type === "prev"),
      disabled
    );
    syncListElement(
      elements.nextListElement,
      items.filter((item) => item.type === "next"),
      disabled
    );
  } else {
    elements.nextListElement.replaceChildren();
    syncListElement(elements.listElement, items, disabled);
  }
}

function syncListElement(listElement: HTMLUListElement, items: PaginationItem[], disabled: boolean) {
  const itemElements = items.map((item) => {
    const listItemElement = document.createElement("li");
    const buttonElement = document.createElement("button");

    buttonElement.className = `ds-pagination__button ds-pagination__button--${item.type}`;
    buttonElement.type = "button";
    buttonElement.disabled = disabled || item.disabled;
    buttonElement.dataset.page = String(item.page);
    buttonElement.setAttribute("aria-label", item.label);

    if (item.selected) {
      buttonElement.setAttribute("aria-current", "page");
    }

    buttonElement.append(createItemContent(item));
    listItemElement.append(buttonElement);

    return listItemElement;
  });

  listElement.replaceChildren(...itemElements);
}

function createItemContent(item: PaginationItem) {
  if (item.type === "prev") {
    return createIcon(ChevronLeft);
  }

  if (item.type === "next") {
    return createIcon(ChevronRight);
  }

  if (item.type === "jump-prev" || item.type === "jump-next") {
    return createIcon(Ellipsis);
  }

  return document.createTextNode(String(item.page));
}

function createIcon(icon: Parameters<typeof createLucideElement>[0]) {
  return createLucideElement(icon, {
    "aria-hidden": "true",
    focusable: "false",
    height: 16,
    width: 16,
    "stroke-width": 2.25
  });
}

function syncSimpleElement(simpleElement: HTMLSpanElement, current: number, pageCount: number) {
  const currentElement = document.createElement("span");
  const separatorElement = document.createElement("span");
  const totalElement = document.createElement("span");

  currentElement.className = "ds-pagination__simple-current";
  currentElement.textContent = String(current);
  separatorElement.textContent = "/";
  totalElement.textContent = String(pageCount);
  simpleElement.replaceChildren(currentElement, separatorElement, totalElement);
}

function syncPageSizeOptions(selectElement: HTMLSelectElement, options: number[], pageSize: number) {
  const optionElements = options.map((option) => {
    const optionElement = document.createElement("option");

    optionElement.value = String(option);
    optionElement.textContent = `${option} / page`;
    optionElement.selected = option === pageSize;

    return optionElement;
  });

  selectElement.replaceChildren(...optionElements);
}
