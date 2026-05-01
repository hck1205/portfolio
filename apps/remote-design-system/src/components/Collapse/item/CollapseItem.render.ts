import { ChevronRight, createElement as createLucideElement } from "lucide";

import type { CollapseCollapsible, CollapseExpandIconPlacement } from "../types/Collapse.types";

export type CollapseItemElements = {
  bodyElement: HTMLDivElement;
  extraElement: HTMLSpanElement;
  headingElement: HTMLHeadingElement;
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
  label: string;
  open: boolean;
  panelId: string;
  showArrow: boolean;
};

/**
 * Collapse item의 expand/collapse 상태를 나타내는 Lucide chevron icon을 생성합니다.
 *
 * Lucide의 framework-agnostic `createElement` API를 사용해 SVGElement를 직접 만들고,
 * Shadow DOM 안에서 현재 색상을 상속받도록 설정합니다.
 *
 * @returns Collapse trigger에 넣을 chevron SVG element입니다.
 */
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

/**
 * `ds-collapse-item`이 사용하는 실제 DOM 구조를 최초로 생성합니다.
 *
 * 이 함수는 순수하게 DOM node를 만들고 이벤트 핸들러를 연결하는 역할만 담당합니다.
 * attribute 값에 따라 텍스트, open 상태, icon 위치를 반영하는 작업은
 * `syncCollapseItemElements`에서 처리하여 초기 생성과 상태 동기화 책임을 분리합니다.
 *
 * @param options.onToggle trigger 버튼 클릭 시 실행할 toggle handler입니다.
 * @param options.panelId content region에 부여할 id입니다.
 * @param options.triggerId trigger 버튼에 부여할 id입니다.
 * @returns 이후 상태 동기화에서 재사용할 Collapse item 내부 DOM 참조 묶음입니다.
 */
export function createCollapseItemElements({
  onToggle,
  panelId,
  triggerId
}: CreateCollapseItemElementsOptions): CollapseItemElements {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    :host {
      display: block;
    }

    [hidden] {
      display: none !important;
    }

    .ds-collapse__item {
      background: var(--color-ds-surface);
      border-bottom: var(--ds-border-width-default) solid var(--color-ds-border);
    }

    :host(:last-child) .ds-collapse__item {
      border-bottom: 0;
    }

    :host-context(ds-collapse[data-ghost]) .ds-collapse__item {
      background: transparent;
      border-bottom: 0;
    }

    .ds-collapse__heading {
      align-items: stretch;
      background: var(--ds-color-subtle-surface);
      color: var(--color-ds-text);
      display: flex;
      font-size: var(--text-ds-3);
      font-weight: var(--font-weight-ds-strong);
      line-height: var(--leading-ds-tight);
      margin: 0;
      transition: color 150ms ease-in-out, background-color 150ms ease-in-out;
    }

    :host-context(ds-collapse[size="small"]) .ds-collapse__heading {
      font-size: var(--text-ds-2);
    }

    :host-context(ds-collapse[size="large"]) .ds-collapse__heading {
      font-size: var(--text-ds-4);
    }

    :host-context(ds-collapse[data-ghost]) .ds-collapse__heading {
      background: transparent;
    }

    .ds-collapse__trigger {
      align-items: center;
      background: transparent;
      border: 0;
      color: inherit;
      cursor: pointer;
      display: flex;
      flex: 1;
      font-family: var(--font-sans);
      font-size: inherit;
      gap: var(--spacing-ds-4);
      line-height: inherit;
      min-width: 0;
      padding: var(--spacing-ds-4) var(--spacing-ds-5);
      text-align: left;
    }

    .ds-collapse__trigger[data-icon-only="true"] {
      flex: none;
      padding: var(--spacing-ds-4) var(--spacing-ds-5);
    }

    .ds-collapse__heading[data-collapsible="icon"] .ds-collapse__label,
    .ds-collapse__heading[data-collapsible="icon"] .ds-collapse__extra {
      align-items: center;
      display: flex;
    }

    .ds-collapse__heading[data-collapsible="icon"] .ds-collapse__label {
      padding-bottom: var(--spacing-ds-4);
      padding-top: var(--spacing-ds-4);
    }

    .ds-collapse__heading[data-collapsible="icon"] .ds-collapse__extra {
      padding-bottom: var(--spacing-ds-4);
      padding-top: var(--spacing-ds-4);
    }

    .ds-collapse__heading[data-collapsible="icon"][data-icon-placement="start"] .ds-collapse__extra {
      padding-right: var(--spacing-ds-5);
    }

    .ds-collapse__heading[data-collapsible="icon"][data-icon-placement="end"] .ds-collapse__label {
      padding-left: var(--spacing-ds-5);
    }

    :host-context(ds-collapse[size="small"]) .ds-collapse__trigger {
      padding: var(--spacing-ds-3) var(--spacing-ds-4);
    }

    :host-context(ds-collapse[size="large"]) .ds-collapse__trigger {
      padding: var(--spacing-ds-5) var(--spacing-ds-6);
    }

    .ds-collapse__trigger:focus-visible {
      outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
      outline-offset: var(--ds-focus-ring-offset);
    }

    .ds-collapse__trigger:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    .ds-collapse__label {
      flex: 1;
      min-width: 0;
      text-align: left;
    }

    .ds-collapse__extra {
      color: var(--color-ds-muted);
      flex: none;
      font-size: var(--text-ds-2);
      font-weight: var(--font-weight-ds-strong);
    }

    .ds-collapse__icon {
      align-items: center;
      color: var(--color-ds-muted);
      display: inline-flex;
      flex: none;
      font-size: var(--text-ds-2);
      justify-content: center;
      text-align: center;
      transition: transform 150ms ease-in-out, color 150ms ease-in-out;
      width: var(--spacing-ds-4);
    }

    .ds-collapse__icon-svg {
      display: block;
      height: var(--ds-icon-size-md);
      pointer-events: none;
      width: var(--ds-icon-size-md);
    }

    :host([open]) .ds-collapse__icon {
      color: var(--color-ds-text);
      transform: rotate(90deg);
    }

    .ds-collapse__body {
      background: var(--color-ds-surface);
      border-top: var(--ds-border-width-default) solid var(--color-ds-border);
      color: var(--color-ds-muted);
      font-size: var(--text-ds-3);
      line-height: var(--leading-ds-readable);
      overflow-y: auto;
      padding: var(--spacing-ds-4) var(--spacing-ds-5);
      transition: all 100ms ease-in-out;
    }

    :host-context(ds-collapse[size="small"]) .ds-collapse__body {
      font-size: var(--text-ds-2);
      padding: var(--spacing-ds-3) var(--spacing-ds-4);
    }

    :host-context(ds-collapse[size="large"]) .ds-collapse__body {
      padding: var(--spacing-ds-5) var(--spacing-ds-6);
    }

    :host-context(ds-collapse[data-ghost]) .ds-collapse__body {
      background: transparent;
      border-top: 0;
    }
  `;

  const sectionElement = document.createElement("section");
  sectionElement.className = "ds-collapse__item";

  const headingElement = document.createElement("h3");
  headingElement.className = "ds-collapse__heading";

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
  sectionElement.prepend(styleElement);

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

/**
 * 이미 생성된 `ds-collapse-item` DOM 구조에 현재 attribute/state 값을 반영합니다.
 *
 * label, extra, disabled, open, aria 속성, icon 노출 여부, icon 위치,
 * 그리고 `collapsible="icon"`일 때의 header 배치를 한곳에서 동기화합니다.
 * DOM을 매번 새로 만들지 않고 기존 node를 재배치하므로, content 영역의 child node와
 * 이벤트 연결을 유지하면서 attribute 변경에 대응할 수 있습니다.
 *
 * @param options.collapsible header 전체 클릭, icon 클릭, 비활성 상태 중 어떤 접기 방식을 쓸지 나타냅니다.
 * @param options.disabled trigger 버튼 비활성화 여부입니다.
 * @param options.elements 최초 생성된 Collapse item 내부 DOM 참조 묶음입니다.
 * @param options.expandIconPlacement icon을 label 앞 또는 뒤에 둘지 나타냅니다.
 * @param options.extra header 오른쪽 보조 텍스트입니다.
 * @param options.label header에 표시할 주 텍스트입니다.
 * @param options.open content region을 펼칠지 여부입니다.
 * @param options.panelId trigger의 `aria-controls`에 연결할 panel id입니다.
 * @param options.showArrow icon 표시 여부입니다.
 */
export function syncCollapseItemElements({
  collapsible,
  disabled,
  elements,
  expandIconPlacement,
  extra,
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
