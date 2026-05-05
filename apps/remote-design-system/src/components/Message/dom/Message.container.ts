import { MESSAGE_CONTAINER_ID } from "../constants/Message.constants";

function getMessageContainer(document: Document) {
  const existingContainer = document.getElementById(MESSAGE_CONTAINER_ID);

  if (existingContainer) {
    return existingContainer;
  }

  const container = document.createElement("div");

  container.id = MESSAGE_CONTAINER_ID;
  container.className = "ds-message-container";
  document.body.append(container);

  return container;
}

export function appendFloatingMessage(message: HTMLElement, document: Document) {
  getMessageContainer(document).append(message);
}

export function removeFloatingMessage(message: HTMLElement) {
  const container = message.parentElement;

  message.remove();

  if (container?.id === MESSAGE_CONTAINER_ID && container.childElementCount === 0) {
    container.remove();
  }
}
