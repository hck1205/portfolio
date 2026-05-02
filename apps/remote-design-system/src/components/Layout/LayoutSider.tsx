import {
  LAYOUT_BREAKPOINTS,
  LAYOUT_SIDER_COLLAPSE_EVENT,
  LAYOUT_SIDER_OBSERVED_ATTRIBUTES
} from "./constants/Layout.constants";
import {
  getLayoutBreakpoint,
  getLayoutSiderTheme,
  normalizeBooleanAttribute,
  normalizeNumberAttribute,
  normalizeWidthValue
} from "./dom/Layout.dom";
import { applyLayoutStyles, createLayoutSiderElements, type LayoutSiderElements } from "./render/Layout.render";
import type {
  LayoutBreakpoint,
  LayoutSiderCollapseDetail,
  LayoutSiderCollapseType,
  LayoutSiderTheme
} from "./types/Layout.types";

export class DsLayoutSider extends HTMLElement {
  static observedAttributes = LAYOUT_SIDER_OBSERVED_ATTRIBUTES;

  private elements?: LayoutSiderElements;
  private hasAppliedDefaultCollapsed = false;
  private mediaQueryList?: MediaQueryList;

  connectedCallback() {
    this.render();
    this.syncResponsiveListener();
  }

  disconnectedCallback() {
    this.mediaQueryList?.removeEventListener("change", this.handleBreakpointChange);
    this.elements?.triggerSlotElement.removeEventListener("slotchange", this.handleTriggerSlotChange);
  }

  attributeChangedCallback(name: string) {
    if (name === "breakpoint") {
      this.syncResponsiveListener();
    }

    this.render();
  }

  get breakpoint(): LayoutBreakpoint | undefined {
    return getLayoutBreakpoint(this);
  }

  set breakpoint(value: LayoutBreakpoint | undefined) {
    this.syncNullableAttribute("breakpoint", value);
  }

  get collapsed() {
    return normalizeBooleanAttribute(this, "collapsed", false);
  }

  set collapsed(value: boolean) {
    this.toggleAttribute("collapsed", value);
  }

  get collapsedWidth() {
    return normalizeNumberAttribute(this, "collapsed-width", 80);
  }

  set collapsedWidth(value: number) {
    this.setAttribute("collapsed-width", String(value));
  }

  get collapsible() {
    return normalizeBooleanAttribute(this, "collapsible", false);
  }

  set collapsible(value: boolean) {
    this.toggleAttribute("collapsible", value);
  }

  get defaultCollapsed() {
    return normalizeBooleanAttribute(this, "default-collapsed", false);
  }

  set defaultCollapsed(value: boolean) {
    this.toggleAttribute("default-collapsed", value);
  }

  get reverseArrow() {
    return normalizeBooleanAttribute(this, "reverse-arrow", false);
  }

  set reverseArrow(value: boolean) {
    this.toggleAttribute("reverse-arrow", value);
  }

  get theme(): LayoutSiderTheme {
    return getLayoutSiderTheme(this);
  }

  set theme(value: LayoutSiderTheme) {
    this.setAttribute("theme", value);
  }

  get trigger() {
    return this.getAttribute("trigger") ?? "";
  }

  set trigger(value: string) {
    this.syncNullableAttribute("trigger", value);
  }

  get width(): string {
    return normalizeWidthValue(this.getAttribute("width"), 200);
  }

  set width(value: number | string) {
    this.setAttribute("width", String(value));
  }

  private handleTriggerClick = () => {
    if (!this.collapsible) {
      return;
    }

    this.setCollapsed(!this.collapsed, "clickTrigger");
  };

  private handleBreakpointChange = (event: MediaQueryListEvent) => {
    this.setCollapsed(event.matches, "responsive");
  };

  private handleTriggerSlotChange = () => {
    this.syncStructure();
  };

  private render() {
    if (!this.elements) {
      const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

      this.elements = createLayoutSiderElements(this.handleTriggerClick);
      this.elements.triggerSlotElement.addEventListener("slotchange", this.handleTriggerSlotChange);
      shadowRoot.replaceChildren(this.elements.rootElement);
      applyLayoutStyles(shadowRoot, "sider");
    }

    this.syncDefaultCollapsed();
    this.syncAttributes();
    this.syncStructure();
  }

  private syncDefaultCollapsed() {
    if (this.hasAppliedDefaultCollapsed || this.hasAttribute("collapsed")) {
      this.hasAppliedDefaultCollapsed = true;
      return;
    }

    if (this.defaultCollapsed) {
      this.collapsed = true;
    }

    this.hasAppliedDefaultCollapsed = true;
  }

  private syncAttributes() {
    this.setAttributeIfChanged("theme", this.theme);
    this.style.setProperty("--ds-layout-sider-width", this.width);
    this.style.setProperty("--ds-layout-sider-collapsed-width", `${this.collapsedWidth}px`);
    this.toggleAttribute("data-zero-width", this.collapsedWidth === 0);
  }

  private syncStructure() {
    if (!this.elements) {
      return;
    }

    const triggerHidden =
      !this.collapsible ||
      this.trigger === "none" ||
      this.trigger === "null" ||
      (this.collapsedWidth === 0 && this.collapsed);
    const triggerLabel = this.collapsed ? "Expand" : "Collapse";
    const hasCustomTrigger = this.elements.triggerSlotElement.assignedNodes({ flatten: true }).length > 0;

    this.elements.rootElement.setAttribute("aria-label", this.getAttribute("aria-label") ?? "Sidebar");
    this.elements.triggerElement.hidden = triggerHidden;
    this.elements.triggerElement.setAttribute("aria-label", triggerLabel);
    this.elements.triggerElement.setAttribute("aria-expanded", String(!this.collapsed));
    this.elements.triggerIconElement.hidden = hasCustomTrigger;
    this.elements.triggerLabelElement.hidden = hasCustomTrigger;
    this.elements.triggerLabelElement.textContent = this.trigger && this.trigger !== "null" ? this.trigger : triggerLabel;
    this.elements.triggerSlotElement.hidden = !hasCustomTrigger;
    this.elements.zeroTriggerElement.hidden = !this.collapsible || this.collapsedWidth !== 0 || !this.collapsed;
    this.elements.zeroTriggerElement.setAttribute("aria-label", triggerLabel);
    this.elements.zeroTriggerElement.setAttribute("aria-expanded", String(!this.collapsed));
  }

  private syncResponsiveListener() {
    this.mediaQueryList?.removeEventListener("change", this.handleBreakpointChange);
    this.mediaQueryList = undefined;

    const breakpoint = this.breakpoint;

    if (!breakpoint || typeof window === "undefined" || !("matchMedia" in window)) {
      return;
    }

    this.mediaQueryList = window.matchMedia(`(max-width: ${LAYOUT_BREAKPOINTS[breakpoint] - 0.02}px)`);
    this.mediaQueryList.addEventListener("change", this.handleBreakpointChange);
    this.setCollapsed(this.mediaQueryList.matches, "responsive", false);
  }

  private setCollapsed(
    collapsed: boolean,
    type: LayoutSiderCollapseType,
    emitEvent = true
  ) {
    const previousCollapsed = this.collapsed;

    this.collapsed = collapsed;

    if (!emitEvent || previousCollapsed === collapsed) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent<LayoutSiderCollapseDetail>(LAYOUT_SIDER_COLLAPSE_EVENT, {
        bubbles: true,
        detail: {
          collapsed,
          type
        }
      })
    );
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }

  private syncNullableAttribute(name: string, value: string | undefined) {
    if (value) {
      this.setAttributeIfChanged(name, value);
      return;
    }

    this.removeAttribute(name);
  }
}
