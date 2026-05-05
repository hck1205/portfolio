import { MESSAGE_CLOSE_EVENT, MESSAGE_OBSERVED_ATTRIBUTES } from "./constants/Message.constants";
import { appendFloatingMessage, removeFloatingMessage } from "./dom/Message.container";
import { getMessageDuration, getMessageType, normalizeBooleanAttribute, syncNullableAttribute } from "./dom/Message.dom";
import { applyMessageStyles, createMessageElements, syncMessageElements, type MessageElements } from "./Message.render";
import type { MessageCloseDetail, MessageShowOptions, MessageType } from "./types/Message.types";

export class DsMessage extends HTMLElement {
  static observedAttributes = MESSAGE_OBSERVED_ATTRIBUTES;

  private autoCloseTimer?: number;
  private elements?: MessageElements;

  static show(options: MessageShowOptions) {
    const message = document.createElement("ds-message") as DsMessage;

    message.content = options.content;
    message.type = options.type ?? "info";
    message.duration = options.duration ?? 3;
    message.closable = options.closable ?? false;
    message.floating = true;
    appendFloatingMessage(message, document);

    return message;
  }

  connectedCallback() {
    this.render();
    this.syncAutoCloseTimer();
  }

  disconnectedCallback() {
    window.clearTimeout(this.autoCloseTimer);
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) {
      return;
    }

    this.render();
    this.syncAutoCloseTimer();
  }

  get closable() {
    return normalizeBooleanAttribute(this, "closable", false);
  }

  set closable(value: boolean) {
    this.setBooleanAttribute("closable", value);
  }

  get content() {
    return this.getAttribute("content") ?? this.textContent?.trim() ?? "";
  }

  set content(value: string) {
    syncNullableAttribute(this, "content", value);
  }

  get duration() {
    return getMessageDuration(this);
  }

  set duration(value: number) {
    this.setAttribute("duration", String(value));
  }

  get floating() {
    return normalizeBooleanAttribute(this, "floating", false);
  }

  set floating(value: boolean) {
    this.setBooleanAttribute("floating", value);
  }

  get type(): MessageType {
    return getMessageType(this);
  }

  set type(value: MessageType) {
    this.setAttribute("type", value);
  }

  close() {
    window.clearTimeout(this.autoCloseTimer);
    this.hidden = true;
    this.dispatchEvent(
      new CustomEvent<MessageCloseDetail>(MESSAGE_CLOSE_EVENT, {
        bubbles: true,
        detail: {
          type: this.type
        }
      })
    );

    if (this.floating) {
      removeFloatingMessage(this);
    }
  }

  private handleCloseClick = () => {
    this.close();
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

    syncMessageElements(this.elements, {
      closable: this.closable,
      content: this.content || "메시지",
      type: this.type
    });
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createMessageElements();
    this.elements.closeButtonElement.addEventListener("click", this.handleCloseClick);
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyMessageStyles(shadowRoot);
  }

  private setBooleanAttribute(name: string, value: boolean) {
    if (value) {
      this.setAttribute(name, "true");
      return;
    }

    this.setAttribute(name, "false");
  }

  private syncAutoCloseTimer() {
    window.clearTimeout(this.autoCloseTimer);

    if (!this.isConnected || this.duration === 0 || this.hidden) {
      return;
    }

    this.autoCloseTimer = window.setTimeout(() => this.close(), this.duration * 1000);
  }
}
