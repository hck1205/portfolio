import { DRAWER_CLOSE_EVENT, DRAWER_OBSERVED_ATTRIBUTES, DRAWER_OPEN_CHANGE_EVENT } from "./constants/Drawer.constants";
import { getDrawerPlacement, normalizeBooleanAttribute, syncNullableAttribute } from "./dom/Drawer.dom";
import { DrawerPortalController } from "./dom/Drawer.portal";
import { lockDrawerDocumentScroll, unlockDrawerDocumentScroll } from "./dom/Drawer.scrollLock";
import { applyDrawerStyles, createDrawerElements, syncDrawerElements, type DrawerElements } from "./Drawer.render";
import type { DrawerOpenChangeDetail, DrawerPlacement } from "./types/Drawer.types";

export class DsDrawer extends HTMLElement {
  static observedAttributes = DRAWER_OBSERVED_ATTRIBUTES;

  private elements?: DrawerElements;
  private isScrollLocked = false;
  private portal = new DrawerPortalController(this);
  private previousFocusedElement?: HTMLElement;

  connectedCallback() {
    this.render();
    this.syncGlobalListeners();
  }

  disconnectedCallback() {
    this.ownerDocument.removeEventListener("keydown", this.handleDocumentKeyDown);

    if (!this.portal.isMoving) {
      this.syncScrollLock(false);
    }

    this.portal.disconnect();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) {
      return;
    }

    this.render();

    if (name === "open") {
      this.syncGlobalListeners();
      this.syncFocusAfterOpenChange();
    }
  }

  get closable() {
    return normalizeBooleanAttribute(this, "closable", true);
  }

  set closable(value: boolean) {
    this.setBooleanAttribute("closable", value);
  }

  get closeLabel() {
    return this.getAttribute("close-label") ?? "드로어 닫기";
  }

  set closeLabel(value: string) {
    syncNullableAttribute(this, "close-label", value);
  }

  get closeOnEscape() {
    return normalizeBooleanAttribute(this, "close-on-escape", true);
  }

  set closeOnEscape(value: boolean) {
    this.setBooleanAttribute("close-on-escape", value);
  }

  get closeOnMask() {
    return normalizeBooleanAttribute(this, "close-on-mask", true);
  }

  set closeOnMask(value: boolean) {
    this.setBooleanAttribute("close-on-mask", value);
  }

  get height() {
    return this.getAttribute("height") ?? "320px";
  }

  set height(value: string) {
    syncNullableAttribute(this, "height", value);
  }

  get mask() {
    return normalizeBooleanAttribute(this, "mask", true);
  }

  set mask(value: boolean) {
    this.setBooleanAttribute("mask", value);
  }

  get open() {
    return normalizeBooleanAttribute(this, "open", false);
  }

  set open(value: boolean) {
    this.setOpen(value, "api");
  }

  get placement(): DrawerPlacement {
    return getDrawerPlacement(this);
  }

  set placement(value: DrawerPlacement) {
    this.setAttribute("placement", value);
  }

  get title() {
    return this.getAttribute("title") ?? "드로어";
  }

  set title(value: string) {
    syncNullableAttribute(this, "title", value);
  }

  get width() {
    return this.getAttribute("width") ?? "378px";
  }

  set width(value: string) {
    syncNullableAttribute(this, "width", value);
  }

  close() {
    this.setOpen(false, "close");
  }

  show() {
    this.setOpen(true, "api");
  }

  private handleCloseButtonClick = () => {
    this.setOpen(false, "close");
  };

  private handleMaskPointerDown = () => {
    if (this.closeOnMask) {
      this.setOpen(false, "mask");
    }
  };

  private handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (!this.open || !this.closeOnEscape || event.key !== "Escape") {
      return;
    }

    event.preventDefault();
    this.setOpen(false, "escape");
  };

  private handleSlotChange = () => {
    this.render();
  };

  private render() {
    if (!this.isConnected && !this.elements) {
      return;
    }

    if (!this.elements) {
      this.initializeStructure();
    }

    if (!this.elements) {
      return;
    }

    syncDrawerElements(this.elements, {
      closable: this.closable,
      closeLabel: this.closeLabel,
      height: this.height,
      mask: this.mask,
      open: this.open,
      placement: this.placement,
      title: this.title,
      width: this.width
    });
    this.syncPortal();
    this.syncScrollLock(this.open);
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createDrawerElements();
    this.elements.closeButtonElement.addEventListener("click", this.handleCloseButtonClick);
    this.elements.extraSlotElement.addEventListener("slotchange", this.handleSlotChange);
    this.elements.footerSlotElement.addEventListener("slotchange", this.handleSlotChange);
    this.elements.maskElement.addEventListener("pointerdown", this.handleMaskPointerDown);
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyDrawerStyles(shadowRoot);
  }

  private setOpen(open: boolean, source: DrawerOpenChangeDetail["source"]) {
    const previousOpen = this.open;

    this.setBooleanAttribute("open", open);

    if (previousOpen !== open) {
      this.dispatchEvent(
        new CustomEvent<DrawerOpenChangeDetail>(DRAWER_OPEN_CHANGE_EVENT, {
          bubbles: true,
          detail: {
            open,
            source
          }
        })
      );

      if (!open) {
        this.dispatchEvent(new CustomEvent(DRAWER_CLOSE_EVENT, { bubbles: true }));
      }
    }
  }

  private setBooleanAttribute(name: string, value: boolean) {
    if (value) {
      this.setAttribute(name, "true");
      return;
    }

    this.setAttribute(name, "false");
  }

  private syncGlobalListeners() {
    this.ownerDocument.removeEventListener("keydown", this.handleDocumentKeyDown);

    if (this.open) {
      this.ownerDocument.addEventListener("keydown", this.handleDocumentKeyDown);
    }
  }

  private syncFocusAfterOpenChange() {
    if (!this.elements) {
      return;
    }

    if (this.open) {
      this.previousFocusedElement =
        this.ownerDocument.activeElement instanceof HTMLElement ? this.ownerDocument.activeElement : undefined;
      requestAnimationFrame(() => {
        const focusTarget = this.closable ? this.elements?.closeButtonElement : this.elements?.panelElement;

        focusTarget?.focus();
      });
      return;
    }

    this.previousFocusedElement?.focus();
    this.previousFocusedElement = undefined;
  }

  private syncPortal() {
    if (this.open) {
      this.portal.mount();
      return;
    }

    this.portal.restore();
  }

  private syncScrollLock(locked: boolean) {
    if (this.isScrollLocked === locked) {
      return;
    }

    this.isScrollLocked = locked;

    if (locked) {
      lockDrawerDocumentScroll(this.ownerDocument);
      return;
    }

    unlockDrawerDocumentScroll(this.ownerDocument);
  }
}
