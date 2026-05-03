import { POPOVER_OBSERVED_ATTRIBUTES, POPOVER_OPEN_CHANGE_EVENT } from "./constants/Popover.constants";
import {
  getPopoverPlacement,
  getPopoverTriggers,
  normalizeBooleanAttribute,
  syncNullableAttribute
} from "./dom/Popover.dom";
import { applyPopoverStyles, createPopoverElements, type PopoverElements } from "./Popover.render";
import type { PopoverOpenChangeDetail, PopoverPlacement } from "./types/Popover.types";

export class DsPopover extends HTMLElement {
  static observedAttributes = POPOVER_OBSERVED_ATTRIBUTES;

  private elements?: PopoverElements;
  private hasAppliedDefaultOpen = false;
  private internalOpen = false;
  private leaveTimer?: number;

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    window.clearTimeout(this.leaveTimer);
    document.removeEventListener("pointerdown", this.handleDocumentPointerDown);
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
    if (!this.open || !getPopoverTriggers(this).includes("click")) {
      return;
    }

    if (!event.composedPath().includes(this)) {
      this.setOpen(false);
    }
  };

  private handleFocusIn = () => {
    if (getPopoverTriggers(this).includes("focus")) {
      this.setOpen(true);
    }
  };

  private handleFocusOut = () => {
    if (getPopoverTriggers(this).includes("focus")) {
      this.setOpen(false);
    }
  };

  private handlePointerEnter = () => {
    if (!getPopoverTriggers(this).includes("hover")) {
      return;
    }

    window.clearTimeout(this.leaveTimer);
    this.setOpen(true);
  };

  private handlePointerLeave = () => {
    if (getPopoverTriggers(this).includes("hover")) {
      this.leaveTimer = window.setTimeout(() => this.setOpen(false), 100);
    }
  };

  private handleClick = () => {
    if (getPopoverTriggers(this).includes("click")) {
      this.setOpen(!this.open);
    }
  };

  private handleContextMenu = (event: MouseEvent) => {
    if (!getPopoverTriggers(this).includes("contextMenu")) {
      return;
    }

    event.preventDefault();
    this.setOpen(true);
  };

  private render() {
    this.applyDefaultOpen();

    if (!this.elements) {
      this.initializeStructure();
    }

    if (!this.elements) {
      return;
    }

    this.setAttribute("placement", this.placement);
    this.elements.arrowElement.hidden = !this.arrow;
    this.elements.contentElement.textContent = this.content;
    this.elements.popupElement.dataset.open = String(this.open);
    this.elements.titleElement.textContent = this.title;
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createPopoverElements();
    this.elements.rootElement.addEventListener("pointerenter", this.handlePointerEnter);
    this.elements.rootElement.addEventListener("pointerleave", this.handlePointerLeave);
    this.elements.triggerElement.addEventListener("focusin", this.handleFocusIn);
    this.elements.triggerElement.addEventListener("focusout", this.handleFocusOut);
    this.elements.triggerElement.addEventListener("click", this.handleClick);
    this.elements.triggerElement.addEventListener("contextmenu", this.handleContextMenu);
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyPopoverStyles(shadowRoot);
    document.addEventListener("pointerdown", this.handleDocumentPointerDown);
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
}
