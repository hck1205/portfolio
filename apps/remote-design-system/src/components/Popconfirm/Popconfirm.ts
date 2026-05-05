import {
  POPCONFIRM_CANCEL_EVENT,
  POPCONFIRM_CONFIRM_EVENT,
  POPCONFIRM_OBSERVED_ATTRIBUTES,
  POPCONFIRM_OPEN_CHANGE_EVENT
} from "./constants/Popconfirm.constants";
import { getPlacement, normalizeBooleanAttribute, syncBooleanAttribute, syncNullableAttribute } from "./dom/Popconfirm.dom";
import {
  applyPopconfirmStyles,
  createPopconfirmElements,
  syncPopconfirmElements,
  type PopconfirmElements
} from "./Popconfirm.render";
import type { PopconfirmOpenChangeDetail, PopconfirmPlacement } from "./types/Popconfirm.types";

export class DsPopconfirm extends HTMLElement {
  static observedAttributes = POPCONFIRM_OBSERVED_ATTRIBUTES;

  private elements?: PopconfirmElements;
  private internalOpen = false;
  private isDocumentPointerListenerAttached = false;

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.detachDocumentPointerListener();
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) {
      return;
    }

    this.render();
  }

  get cancelText() {
    return this.getAttribute("cancel-text") ?? "취소";
  }

  set cancelText(value: string) {
    syncNullableAttribute(this, "cancel-text", value);
  }

  get description() {
    return this.getAttribute("description") ?? "";
  }

  set description(value: string) {
    syncNullableAttribute(this, "description", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    syncBooleanAttribute(this, "disabled", value);
  }

  get okText() {
    return this.getAttribute("ok-text") ?? "확인";
  }

  set okText(value: string) {
    syncNullableAttribute(this, "ok-text", value);
  }

  get open() {
    return this.hasAttribute("open") ? normalizeBooleanAttribute(this, "open", false) : this.internalOpen;
  }

  set open(value: boolean) {
    this.setOpen(value);
  }

  get placement(): PopconfirmPlacement {
    return getPlacement(this);
  }

  set placement(value: PopconfirmPlacement) {
    this.setAttribute("placement", value);
  }

  get title() {
    return this.getAttribute("title") ?? "정말 진행할까요?";
  }

  set title(value: string) {
    syncNullableAttribute(this, "title", value);
  }

  private handleTriggerClick = () => {
    if (!this.disabled) {
      this.setOpen(!this.open);
    }
  };

  private handleCancelClick = () => {
    this.setOpen(false);
    this.dispatchEvent(new CustomEvent(POPCONFIRM_CANCEL_EVENT, { bubbles: true }));
  };

  private handleOkClick = () => {
    this.setOpen(false);
    this.dispatchEvent(new CustomEvent(POPCONFIRM_CONFIRM_EVENT, { bubbles: true }));
  };

  private handleDocumentPointerDown = (event: PointerEvent) => {
    if (!this.open || event.composedPath().includes(this)) {
      return;
    }

    this.setOpen(false);
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

    this.syncPlacementAttribute();
    syncPopconfirmElements(this.elements, {
      cancelText: this.cancelText,
      description: this.description,
      okText: this.okText,
      open: this.open,
      title: this.title
    });
    this.syncDocumentPointerListener();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createPopconfirmElements();
    this.elements.triggerElement.addEventListener("click", this.handleTriggerClick);
    this.elements.cancelButtonElement.addEventListener("click", this.handleCancelClick);
    this.elements.okButtonElement.addEventListener("click", this.handleOkClick);
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyPopconfirmStyles(shadowRoot);
  }

  private syncPlacementAttribute() {
    const placement = this.placement;

    if (this.getAttribute("placement") !== placement) {
      this.setAttribute("placement", placement);
    }
  }

  private setOpen(open: boolean) {
    const previousOpen = this.open;
    const isControlled = this.hasAttribute("open");

    this.internalOpen = open;

    if (isControlled) {
      syncBooleanAttribute(this, "open", open);
    } else {
      this.render();
    }

    if (previousOpen !== open) {
      this.dispatchEvent(
        new CustomEvent<PopconfirmOpenChangeDetail>(POPCONFIRM_OPEN_CHANGE_EVENT, {
          bubbles: true,
          detail: { open }
        })
      );
    }
  }

  private syncDocumentPointerListener() {
    if (this.open && !this.isDocumentPointerListenerAttached) {
      this.ownerDocument.addEventListener("pointerdown", this.handleDocumentPointerDown);
      this.isDocumentPointerListenerAttached = true;
      return;
    }

    if (!this.open) {
      this.detachDocumentPointerListener();
    }
  }

  private detachDocumentPointerListener() {
    if (!this.isDocumentPointerListenerAttached) {
      return;
    }

    this.ownerDocument.removeEventListener("pointerdown", this.handleDocumentPointerDown);
    this.isDocumentPointerListenerAttached = false;
  }
}
