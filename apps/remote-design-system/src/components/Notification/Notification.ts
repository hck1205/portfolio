import { NOTIFICATION_CLOSE_EVENT, NOTIFICATION_OBSERVED_ATTRIBUTES } from "./constants/Notification.constants";
import {
  getDuration,
  getNotificationPlacement,
  getNotificationType,
  normalizeBooleanAttribute,
  syncBooleanAttribute,
  syncNullableAttribute
} from "./dom/Notification.dom";
import { appendFloatingNotification, removeFloatingNotification } from "./dom/Notification.container";
import {
  applyNotificationStyles,
  createNotificationElements,
  syncNotificationElements,
  type NotificationElements
} from "./Notification.render";
import type {
  NotificationCloseDetail,
  NotificationPlacement,
  NotificationShowOptions,
  NotificationType
} from "./types/Notification.types";

const AUTO_CLOSE_ATTRIBUTES = new Set(["duration", "show-progress"]);
const FLOATING_PLACEMENT_ATTRIBUTES = new Set(["floating", "placement"]);

export class DsNotification extends HTMLElement {
  static observedAttributes = NOTIFICATION_OBSERVED_ATTRIBUTES;

  private autoCloseTimer?: number;
  private elements?: NotificationElements;
  private progressAnimationFrame?: number;
  private progressStartedAt = 0;

  static show(options: NotificationShowOptions) {
    const notification = document.createElement("ds-notification") as DsNotification;

    notification.title = options.title;
    notification.description = options.description;
    notification.type = options.type ?? "info";
    notification.duration = options.duration ?? 4.5;
    notification.placement = options.placement ?? "topRight";
    notification.showProgress = options.showProgress ?? false;
    notification.closable = options.closable ?? true;
    notification.floating = true;
    appendFloatingNotification(notification, notification.placement);

    return notification;
  }

  connectedCallback() {
    this.render();
    this.syncFloatingPlacement();
    this.startAutoClose();
  }

  disconnectedCallback() {
    this.stopTimers();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) {
      return;
    }

    this.render();

    if (FLOATING_PLACEMENT_ATTRIBUTES.has(name)) {
      this.syncFloatingPlacement();
    }

    if (AUTO_CLOSE_ATTRIBUTES.has(name)) {
      this.startAutoClose();
    }
  }

  get closable() {
    return normalizeBooleanAttribute(this, "closable", true);
  }

  set closable(value: boolean) {
    syncBooleanAttribute(this, "closable", value);
  }

  get description() {
    return this.getAttribute("description") ?? "";
  }

  set description(value: string) {
    syncNullableAttribute(this, "description", value);
  }

  get duration() {
    return getDuration(this);
  }

  set duration(value: number) {
    this.setAttribute("duration", String(value));
  }

  get floating() {
    return normalizeBooleanAttribute(this, "floating", false);
  }

  set floating(value: boolean) {
    syncBooleanAttribute(this, "floating", value);
  }

  get pauseOnHover() {
    return normalizeBooleanAttribute(this, "pause-on-hover", true);
  }

  set pauseOnHover(value: boolean) {
    syncBooleanAttribute(this, "pause-on-hover", value);
  }

  get placement(): NotificationPlacement {
    return getNotificationPlacement(this);
  }

  set placement(value: NotificationPlacement) {
    this.setAttribute("placement", value);
  }

  get showProgress() {
    return normalizeBooleanAttribute(this, "show-progress", false);
  }

  set showProgress(value: boolean) {
    syncBooleanAttribute(this, "show-progress", value);
  }

  get title() {
    return this.getAttribute("title") ?? "알림";
  }

  set title(value: string) {
    syncNullableAttribute(this, "title", value);
  }

  get type(): NotificationType {
    return getNotificationType(this);
  }

  set type(value: NotificationType) {
    this.setAttribute("type", value);
  }

  close() {
    this.stopTimers();
    this.hidden = true;
    this.dispatchEvent(
      new CustomEvent<NotificationCloseDetail>(NOTIFICATION_CLOSE_EVENT, {
        bubbles: true,
        detail: {
          placement: this.placement,
          type: this.type
        }
      })
    );

    if (this.floating) {
      removeFloatingNotification(this);
    }
  }

  private handleCloseClick = () => {
    this.close();
  };

  private handlePointerEnter = () => {
    if (this.pauseOnHover) {
      this.stopTimers();
    }
  };

  private handlePointerLeave = () => {
    if (this.pauseOnHover) {
      this.startAutoClose();
    }
  };

  private render(progress = 1) {
    if (!this.isConnected && !this.elements) {
      return;
    }

    if (!this.elements) {
      this.initializeStructure();
    }

    if (!this.elements) {
      return;
    }

    this.setAttribute("placement", this.placement);
    syncNotificationElements(this.elements, {
      closable: this.closable,
      description: this.description,
      progress,
      showProgress: this.showProgress && this.duration > 0,
      title: this.title,
      type: this.type
    });
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createNotificationElements();
    this.elements.closeButtonElement.addEventListener("click", this.handleCloseClick);
    this.elements.rootElement.addEventListener("pointerenter", this.handlePointerEnter);
    this.elements.rootElement.addEventListener("pointerleave", this.handlePointerLeave);
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyNotificationStyles(shadowRoot);
  }

  private startAutoClose() {
    this.stopTimers();

    if (!this.isConnected || this.duration === 0 || this.hidden) {
      return;
    }

    this.progressStartedAt = performance.now();
    this.autoCloseTimer = window.setTimeout(() => this.close(), this.duration * 1000);
    this.animateProgress();
  }

  private animateProgress = () => {
    if (!this.showProgress || this.duration === 0) {
      return;
    }

    const elapsed = performance.now() - this.progressStartedAt;
    const progress = Math.max(0, 1 - elapsed / (this.duration * 1000));

    this.render(progress);
    this.progressAnimationFrame = window.requestAnimationFrame(this.animateProgress);
  };

  private syncFloatingPlacement() {
    if (this.floating && this.isConnected) {
      appendFloatingNotification(this, this.placement);
    }
  }

  private stopTimers() {
    window.clearTimeout(this.autoCloseTimer);

    if (this.progressAnimationFrame) {
      window.cancelAnimationFrame(this.progressAnimationFrame);
      this.progressAnimationFrame = undefined;
    }
  }
}
