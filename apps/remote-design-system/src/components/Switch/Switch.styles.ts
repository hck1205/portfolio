export const SWITCH_STYLES = `
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  .ds-switch {
    display: inline-flex;
  }

  .ds-switch__button {
    --ds-switch-handle-size: 18px;
    --ds-switch-height: 22px;
    --ds-switch-inner-max-margin: 24px;
    --ds-switch-inner-min-margin: 9px;
    --ds-switch-min-width: 44px;
    --ds-switch-padding: 2px;
    align-items: center;
    appearance: none;
    background: var(--color-neutral-alpha-n6);
    border: 0;
    border-radius: var(--radius-full);
    box-sizing: border-box;
    color: var(--color-neutral-static-light);
    cursor: pointer;
    display: inline-flex;
    font-family: var(--font-sans);
    font-size: var(--text-ds-1);
    font-weight: var(--font-weight-ds-strong);
    height: var(--ds-switch-height);
    line-height: var(--leading-ds-tight);
    margin: 0;
    min-width: var(--ds-switch-min-width);
    overflow: hidden;
    padding: var(--ds-switch-padding);
    position: relative;
    transition:
      background-color 150ms ease-in-out,
      box-shadow 150ms ease-in-out,
      opacity 150ms ease-in-out;
    user-select: none;
  }

  .ds-switch__button:hover {
    background: var(--color-neutral-alpha-n7);
  }

  .ds-switch__button:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-ds-primary) 22%, transparent);
    outline: 0;
  }

  .ds-switch__button[aria-checked="true"] {
    background: var(--color-ds-primary);
  }

  .ds-switch__button[aria-checked="true"]:hover {
    background: var(--color-ds-primary-hover);
  }

  .ds-switch__button:disabled {
    cursor: not-allowed;
    opacity: 0.56;
  }

  .ds-switch__handle {
    align-items: center;
    background: var(--color-ds-surface);
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-1dp);
    box-sizing: border-box;
    color: var(--color-ds-primary);
    display: inline-flex;
    height: var(--ds-switch-handle-size);
    justify-content: center;
    left: var(--ds-switch-padding);
    position: absolute;
    top: var(--ds-switch-padding);
    transition: left 150ms ease-in-out;
    width: var(--ds-switch-handle-size);
  }

  .ds-switch__button[aria-checked="true"] .ds-switch__handle {
    left: calc(100% - var(--ds-switch-handle-size) - var(--ds-switch-padding));
  }

  .ds-switch__content {
    align-items: center;
    box-sizing: border-box;
    display: inline-flex;
    inset: 0;
    justify-content: center;
    min-width: 0;
    overflow: hidden;
    padding-inline: var(--ds-switch-inner-max-margin) var(--ds-switch-inner-min-margin);
    pointer-events: none;
    position: absolute;
    text-align: center;
    text-overflow: ellipsis;
    transition: opacity 120ms ease-in-out;
    white-space: nowrap;
  }

  .ds-switch__content--checked {
    opacity: 0;
    padding-inline: var(--ds-switch-inner-min-margin) var(--ds-switch-inner-max-margin);
  }

  .ds-switch__button[aria-checked="true"] .ds-switch__content--checked {
    opacity: 1;
  }

  .ds-switch__button[aria-checked="true"] .ds-switch__content--unchecked {
    opacity: 0;
  }

  .ds-switch__loading {
    animation: ds-switch-spin 720ms linear infinite;
    border: 2px solid currentColor;
    border-block-start-color: transparent;
    border-radius: var(--radius-full);
    box-sizing: border-box;
    display: none;
    height: 12px;
    width: 12px;
  }

  .ds-switch__button[data-loading="true"] .ds-switch__loading {
    display: inline-block;
  }

  .ds-switch__button[data-loading="true"] .ds-switch__handle::before {
    display: none;
  }

  .ds-switch__button[data-size="small"] {
    --ds-switch-handle-size: 12px;
    --ds-switch-height: 16px;
    --ds-switch-inner-max-margin: 18px;
    --ds-switch-inner-min-margin: 6px;
    --ds-switch-min-width: 28px;
    font-size: 10px;
  }

  @keyframes ds-switch-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

let switchStyleSheet: CSSStyleSheet | undefined;

export function applySwitchStyles(shadowRoot: ShadowRoot) {
  if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
    switchStyleSheet ??= new CSSStyleSheet();
    switchStyleSheet.replaceSync(SWITCH_STYLES);
    shadowRoot.adoptedStyleSheets = [switchStyleSheet];
    return;
  }

  const style = document.createElement("style");

  style.textContent = SWITCH_STYLES;
  shadowRoot.append(style);
}
