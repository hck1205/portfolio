export const MESSAGE_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: inline-block;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-readable);
  }

  :host([hidden]) {
    display: none;
  }

  :host([floating]) {
    left: 50%;
    position: fixed;
    top: var(--spacing-ds-6);
    transform: translateX(-50%);
    z-index: var(--z-index-ds-toast, 1100);
  }

  .ds-message {
    --ds-message-icon: var(--color-ds-primary);
    align-items: center;
    background: var(--color-ds-surface);
    border: 1px solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: var(--shadow-ds-card);
    box-sizing: border-box;
    display: inline-flex;
    gap: var(--spacing-ds-2);
    max-width: min(420px, calc(100vw - 32px));
    min-height: 40px;
    padding: var(--spacing-ds-2) var(--spacing-ds-3);
  }

  .ds-message[data-type="success"] {
    --ds-message-icon: var(--color-ds-success, #389e0d);
  }

  .ds-message[data-type="warning"] {
    --ds-message-icon: var(--color-ds-warning, #d48806);
  }

  .ds-message[data-type="error"] {
    --ds-message-icon: var(--color-ds-danger);
  }

  .ds-message__icon {
    color: var(--ds-message-icon);
    display: inline-flex;
    flex: 0 0 auto;
  }

  .ds-message__icon svg {
    display: block;
    height: var(--size-ds-icon-md);
    stroke: currentColor;
    width: var(--size-ds-icon-md);
  }

  .ds-message[data-type="loading"] .ds-message__icon svg {
    animation: ds-message-spin 800ms linear infinite;
  }

  .ds-message__content {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .ds-message__close {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-ds-sm);
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    flex: 0 0 auto;
    height: 24px;
    justify-content: center;
    padding: 0;
    width: 24px;
  }

  .ds-message__close:hover {
    background: var(--color-neutral-alpha-n2, rgba(0, 0, 0, 0.05));
    color: var(--color-ds-text);
  }

  .ds-message__close:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-message__close[hidden] {
    display: none;
  }

  .ds-message__close svg {
    height: 14px;
    width: 14px;
  }

  @keyframes ds-message-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
