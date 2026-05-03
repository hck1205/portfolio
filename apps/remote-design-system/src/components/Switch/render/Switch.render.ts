import type { SwitchElements, SwitchSyncOptions } from "../types/Switch.types";

type SwitchRenderHandlers = {
  onClick: (event: MouseEvent) => void;
};

export function createSwitchElements(handlers: SwitchRenderHandlers): SwitchElements {
  const root = document.createElement("span");
  const button = document.createElement("button");
  const checkedContent = document.createElement("span");
  const uncheckedContent = document.createElement("span");
  const handle = document.createElement("span");
  const loadingIndicator = document.createElement("span");

  root.className = "ds-switch";
  button.className = "ds-switch__button";
  button.type = "button";
  button.setAttribute("role", "switch");
  button.addEventListener("click", handlers.onClick);
  checkedContent.className = "ds-switch__content ds-switch__content--checked";
  uncheckedContent.className = "ds-switch__content ds-switch__content--unchecked";
  handle.className = "ds-switch__handle";
  handle.setAttribute("aria-hidden", "true");
  loadingIndicator.className = "ds-switch__loading";
  loadingIndicator.setAttribute("aria-hidden", "true");
  handle.append(loadingIndicator);
  button.append(checkedContent, uncheckedContent, handle);
  root.append(button);

  return {
    button,
    checkedContent,
    handle,
    loadingIndicator,
    root,
    uncheckedContent
  };
}

export function syncSwitchElements(elements: SwitchElements, options: SwitchSyncOptions) {
  elements.button.disabled = options.disabled || options.loading;
  elements.button.dataset.loading = String(options.loading);
  elements.button.dataset.size = options.size;
  elements.button.setAttribute("aria-checked", String(options.checked));
  elements.button.setAttribute("aria-busy", String(options.loading));
  elements.checkedContent.textContent = options.checkedChildren;
  elements.uncheckedContent.textContent = options.uncheckedChildren;
  elements.checkedContent.hidden = !options.checked || !options.checkedChildren;
  elements.uncheckedContent.hidden = options.checked || !options.uncheckedChildren;
}
