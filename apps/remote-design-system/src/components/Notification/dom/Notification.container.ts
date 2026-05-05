import { NOTIFICATION_CONTAINER_PREFIX } from "../constants/Notification.constants";
import type { NotificationPlacement } from "../types/Notification.types";

function getContainerId(placement: NotificationPlacement) {
  return `${NOTIFICATION_CONTAINER_PREFIX}-${placement}`;
}

function getNotificationContainer(document: Document, placement: NotificationPlacement) {
  const containerId = getContainerId(placement);
  const existingContainer = document.getElementById(containerId);

  if (existingContainer) {
    return existingContainer;
  }

  const container = document.createElement("div");

  container.className = NOTIFICATION_CONTAINER_PREFIX;
  container.dataset.placement = placement;
  container.id = containerId;
  document.body.append(container);

  return container;
}

export function appendFloatingNotification(notification: HTMLElement, placement: NotificationPlacement) {
  const currentContainer = notification.parentElement;
  const nextContainer = getNotificationContainer(notification.ownerDocument, placement);

  if (currentContainer === nextContainer) {
    return;
  }

  nextContainer.append(notification);
  removeContainerIfEmpty(currentContainer);
}

export function removeFloatingNotification(notification: HTMLElement) {
  const container = notification.parentElement;

  notification.remove();
  removeContainerIfEmpty(container);
}

function removeContainerIfEmpty(container: Element | null) {
  if (container?.classList.contains(NOTIFICATION_CONTAINER_PREFIX) && container.children.length === 0) {
    container.remove();
  }
}
