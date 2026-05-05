import { ALERT_CLOSE_EVENT, ALERT_OBSERVED_ATTRIBUTES } from "./constants/Alert.constants";
import { getAlertType, normalizeBooleanAttribute, syncNullableAttribute } from "./dom/Alert.dom";
import { applyAlertStyles, createAlertElements, syncAlertElements, type AlertElements } from "./Alert.render";
import type { AlertCloseDetail, AlertType } from "./types/Alert.types";

export class DsAlert extends HTMLElement {
  static observedAttributes = ALERT_OBSERVED_ATTRIBUTES;

  private elements?: AlertElements;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) {
      return;
    }

    this.render();
  }

  get banner() {
    return normalizeBooleanAttribute(this, "banner", false);
  }

  set banner(value: boolean) {
    this.setBooleanAttribute("banner", value);
  }

  get closable() {
    return normalizeBooleanAttribute(this, "closable", false);
  }

  set closable(value: boolean) {
    this.setBooleanAttribute("closable", value);
  }

  get closeLabel() {
    return this.getAttribute("close-label") ?? "알림 닫기";
  }

  set closeLabel(value: string) {
    syncNullableAttribute(this, "close-label", value);
  }

  get closeText() {
    return this.getAttribute("close-text") ?? "";
  }

  set closeText(value: string) {
    syncNullableAttribute(this, "close-text", value);
  }

  get description() {
    return this.getAttribute("description") ?? "";
  }

  set description(value: string) {
    syncNullableAttribute(this, "description", value);
  }

  get showIcon() {
    return normalizeBooleanAttribute(this, "show-icon", this.banner);
  }

  set showIcon(value: boolean) {
    this.setBooleanAttribute("show-icon", value);
  }

  get title() {
    return this.getAttribute("title") ?? "";
  }

  set title(value: string) {
    syncNullableAttribute(this, "title", value);
  }

  get type(): AlertType {
    return getAlertType(this);
  }

  set type(value: AlertType) {
    this.setAttribute("type", value);
  }

  close() {
    if (this.hidden) {
      return;
    }

    this.hidden = true;
    this.dispatchEvent(
      new CustomEvent<AlertCloseDetail>(ALERT_CLOSE_EVENT, {
        bubbles: true,
        detail: {
          type: this.type
        }
      })
    );
  }

  private handleClose = () => {
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

    syncAlertElements(this.elements, {
      banner: this.banner,
      closable: this.closable,
      closeLabel: this.closeLabel,
      closeText: this.closeText,
      description: this.description,
      showIcon: this.showIcon,
      title: this.title || this.textContent?.trim() || "알림",
      type: this.type
    });
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createAlertElements();
    this.elements.closeButtonElement.addEventListener("click", this.handleClose);
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyAlertStyles(shadowRoot);
  }

  private setBooleanAttribute(name: string, value: boolean) {
    if (value) {
      this.setAttribute(name, "true");
      return;
    }

    this.setAttribute(name, "false");
  }
}
