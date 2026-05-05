import {
  POPOVER_LEAVE_DELAY_MS,
  POPOVER_OBSERVED_ATTRIBUTES,
  POPOVER_OPEN_CHANGE_EVENT
} from "./constants/Popover.constants";
import {
  getPopoverPlacement,
  getPopoverTriggers,
  normalizeBooleanAttribute,
  syncNullableAttribute
} from "./dom/Popover.dom";
import { applyPopoverStyles, createPopoverElements, syncPopoverElements, type PopoverElements } from "./Popover.render";
import type { PopoverOpenChangeDetail, PopoverPlacement, PopoverTrigger } from "./types/Popover.types";

export class DsPopover extends HTMLElement {
  static observedAttributes = POPOVER_OBSERVED_ATTRIBUTES;

  private elements?: PopoverElements;
  private hasAppliedDefaultOpen = false;
  private internalOpen = false;
  private isDocumentPointerListenerAttached = false;
  private leaveTimer?: number;
  private triggers: PopoverTrigger[] = ["hover"];

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    window.clearTimeout(this.leaveTimer);
    this.removeEventListener("focusin", this.handleFocusIn);
    this.removeEventListener("focusout", this.handleFocusOut);
    this.detachDocumentPointerListener();
  }

  attributeChangedCallback() {
    this.render();
  }

  get arrow() {
    return normalizeBooleanAttribute(this, "arrow", true);
  }

  set arrow(value: boolean) {
    this.setAttribute("arrow", String(value));
  }

  get content() {
    return this.getAttribute("content") ?? "";
  }

  set content(value: string) {
    syncNullableAttribute(this, "content", value);
  }

  get defaultOpen() {
    return normalizeBooleanAttribute(this, "default-open", false);
  }

  set defaultOpen(value: boolean) {
    this.setAttribute("default-open", String(value));
  }

  get open() {
    if (this.hasAttribute("open")) {
      return normalizeBooleanAttribute(this, "open", false);
    }

    return this.internalOpen;
  }

  set open(value: boolean) {
    this.setOpen(value);
  }

  get placement(): PopoverPlacement {
    return getPopoverPlacement(this);
  }

  set placement(value: PopoverPlacement) {
    this.setAttribute("placement", value);
  }

  get title() {
    return this.getAttribute("title") ?? "";
  }

  set title(value: string) {
    syncNullableAttribute(this, "title", value);
  }

  get trigger() {
    return this.getAttribute("trigger") ?? "hover";
  }

  set trigger(value: string) {
    this.setAttribute("trigger", value);
  }

  hide() {
    this.setOpen(false);
  }

  show() {
    this.setOpen(true);
  }

  private handleDocumentPointerDown = (event: PointerEvent) => {
    if (!this.open || !this.hasTrigger("click")) {
      return;
    }

    if (!event.composedPath().includes(this)) {
      this.setOpen(false);
    }
  };

  private handleFocusIn = () => {
    if (this.hasTrigger("focus")) {
      this.setOpen(true);
    }
  };

  private handleFocusOut = () => {
    if (this.hasTrigger("focus")) {
      this.setOpen(false);
    }
  };

  private handlePointerEnter = () => {
    if (!this.hasTrigger("hover")) {
      return;
    }

    window.clearTimeout(this.leaveTimer);
    this.setOpen(true);
  };

  private handlePointerLeave = (event: PointerEvent) => {
    if (!this.hasTrigger("hover")) {
      return;
    }

    const nextTarget = event.relatedTarget as Node | null;

    if (nextTarget && this.elements?.rootElement.contains(nextTarget)) {
      return;
    }

    this.leaveTimer = window.setTimeout(() => this.setOpen(false), POPOVER_LEAVE_DELAY_MS);
  };

  private handleClick = () => {
    if (this.hasTrigger("click")) {
      this.setOpen(!this.open);
    }
  };

  private handleContextMenu = (event: MouseEvent) => {
    if (!this.hasTrigger("contextMenu")) {
      return;
    }

    event.preventDefault();
    this.setOpen(true);
  };

  private render() {
    this.applyDefaultOpen();
    this.triggers = getPopoverTriggers(this);

    if (!this.elements) {
      this.initializeStructure();
    }

    if (!this.elements) {
      return;
    }

    this.setAttribute("placement", this.placement);
    syncPopoverElements(this.elements, {
      arrow: this.arrow,
      content: this.content,
      open: this.open,
      title: this.title
    });
    this.syncDocumentPointerListener();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createPopoverElements();
    this.elements.rootElement.addEventListener("pointerenter", this.handlePointerEnter);
    this.elements.rootElement.addEventListener("pointerleave", this.handlePointerLeave);
    this.addEventListener("focusin", this.handleFocusIn);
    this.addEventListener("focusout", this.handleFocusOut);
    this.elements.triggerElement.addEventListener("click", this.handleClick);
    this.elements.triggerElement.addEventListener("contextmenu", this.handleContextMenu);
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyPopoverStyles(shadowRoot);
  }

  private applyDefaultOpen() {
    if (this.hasAppliedDefaultOpen) {
      return;
    }

    this.internalOpen = this.defaultOpen;
    this.hasAppliedDefaultOpen = true;
  }

  private setOpen(open: boolean) {
    const previousOpen = this.open;

    this.internalOpen = open;

    if (this.hasAttribute("open")) {
      this.setAttribute("open", String(open));
    }

    this.render();

    if (previousOpen !== open) {
      this.dispatchEvent(
        new CustomEvent<PopoverOpenChangeDetail>(POPOVER_OPEN_CHANGE_EVENT, {
          bubbles: true,
          detail: {
            open
          }
        })
      );
    }
  }

  private hasTrigger(trigger: PopoverTrigger) {
    return this.triggers.includes(trigger);
  }

  private syncDocumentPointerListener() {
    const shouldAttach = this.open && this.hasTrigger("click");

    if (shouldAttach && !this.isDocumentPointerListenerAttached) {
      document.addEventListener("pointerdown", this.handleDocumentPointerDown);
      this.isDocumentPointerListenerAttached = true;
      return;
    }

    if (!shouldAttach && this.isDocumentPointerListenerAttached) {
      this.detachDocumentPointerListener();
    }
  }

  private detachDocumentPointerListener() {
    if (!this.isDocumentPointerListenerAttached) {
      return;
    }

    document.removeEventListener("pointerdown", this.handleDocumentPointerDown);
    this.isDocumentPointerListenerAttached = false;
  }
}
