import { MODAL_CLOSE_EVENT, MODAL_OBSERVED_ATTRIBUTES, MODAL_OPEN_CHANGE_EVENT } from "./constants/Modal.constants";
import { normalizeBooleanAttribute, syncBooleanAttribute, syncNullableAttribute } from "./dom/Modal.dom";
import { ModalPortalController } from "./dom/Modal.portal";
import { lockModalDocumentScroll, unlockModalDocumentScroll } from "./dom/Modal.scrollLock";
import {
  applyModalStyles,
  createModalElements,
  syncModalElements,
  syncModalFooterVisibility,
  type ModalElements
} from "./Modal.render";
import type { ModalOpenChangeDetail } from "./types/Modal.types";

export class DsModal extends HTMLElement {
  static observedAttributes = MODAL_OBSERVED_ATTRIBUTES;

  private elements?: ModalElements;
  private isScrollLocked = false;
  private portal = new ModalPortalController(this);
  private previousFocusedElement?: HTMLElement;

  connectedCallback() {
    this.render();
    this.syncGlobalListeners();
    this.syncOpenEffects();

    if (this.open) {
      this.syncFocusAfterOpenChange();
    }
  }

  disconnectedCallback() {
    this.ownerDocument.removeEventListener("keydown", this.handleDocumentKeyDown);

    if (!this.portal.isMoving) {
      this.elements?.footerSlotElement.removeEventListener("slotchange", this.handleSlotChange);
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
      this.syncOpenEffects();
      this.syncFocusAfterOpenChange();
    }
  }

  get centered() {
    return normalizeBooleanAttribute(this, "centered", false);
  }

  set centered(value: boolean) {
    syncBooleanAttribute(this, "centered", value);
  }

  get closable() {
    return normalizeBooleanAttribute(this, "closable", true);
  }

  set closable(value: boolean) {
    syncBooleanAttribute(this, "closable", value);
  }

  get closeLabel() {
    return this.getAttribute("close-label") ?? "모달 닫기";
  }

  set closeLabel(value: string) {
    syncNullableAttribute(this, "close-label", value);
  }

  get closeOnEscape() {
    return normalizeBooleanAttribute(this, "close-on-escape", true);
  }

  set closeOnEscape(value: boolean) {
    syncBooleanAttribute(this, "close-on-escape", value);
  }

  get closeOnMask() {
    return normalizeBooleanAttribute(this, "close-on-mask", true);
  }

  set closeOnMask(value: boolean) {
    syncBooleanAttribute(this, "close-on-mask", value);
  }

  get mask() {
    return normalizeBooleanAttribute(this, "mask", true);
  }

  set mask(value: boolean) {
    syncBooleanAttribute(this, "mask", value);
  }

  get open() {
    return normalizeBooleanAttribute(this, "open", false);
  }

  set open(value: boolean) {
    this.setOpen(value, "api");
  }

  get title() {
    return this.getAttribute("title") ?? "모달";
  }

  set title(value: string) {
    syncNullableAttribute(this, "title", value);
  }

  get width() {
    return this.getAttribute("width") ?? "520px";
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
    if (this.elements) {
      syncModalFooterVisibility(this.elements);
    }
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

    syncModalElements(this.elements, {
      centered: this.centered,
      closable: this.closable,
      closeLabel: this.closeLabel,
      mask: this.mask,
      open: this.open,
      title: this.title,
      width: this.width
    });
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createModalElements();
    this.elements.closeButtonElement.addEventListener("click", this.handleCloseButtonClick);
    this.elements.footerSlotElement.addEventListener("slotchange", this.handleSlotChange);
    this.elements.maskElement.addEventListener("pointerdown", this.handleMaskPointerDown);
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyModalStyles(shadowRoot);
  }

  private setOpen(open: boolean, source: ModalOpenChangeDetail["source"]) {
    const previousOpen = this.open;

    syncBooleanAttribute(this, "open", open);

    if (previousOpen !== open) {
      this.dispatchEvent(
        new CustomEvent<ModalOpenChangeDetail>(MODAL_OPEN_CHANGE_EVENT, {
          bubbles: true,
          detail: {
            open,
            source
          }
        })
      );

      if (!open) {
        this.dispatchEvent(new CustomEvent(MODAL_CLOSE_EVENT, { bubbles: true }));
      }
    }
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
        const focusTarget = this.closable ? this.elements?.closeButtonElement : this.elements?.dialogElement;

        focusTarget?.focus();
      });
      return;
    }

    this.previousFocusedElement?.focus();
    this.previousFocusedElement = undefined;
  }

  private syncOpenEffects() {
    this.syncPortal();
    this.syncScrollLock(this.open);
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
      lockModalDocumentScroll(this.ownerDocument);
      return;
    }

    unlockModalDocumentScroll(this.ownerDocument);
  }
}
