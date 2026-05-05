export const NOTIFICATION_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: block;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-readable);
  }

  :host([hidden]) {
    display: none;
  }

  :host([floating]) {
    position: fixed;
    z-index: var(--z-index-ds-notification, 1120);
  }

  :host([placement="topRight"]),
  :host([placement="bottomRight"]) {
    right: var(--spacing-ds-6);
  }

  :host([placement="topLeft"]),
  :host([placement="bottomLeft"]) {
    left: var(--spacing-ds-6);
  }

  :host([placement="top"]) {
    left: 50%;
    top: var(--spacing-ds-6);
    transform: translateX(-50%);
  }

  :host([placement="bottom"]) {
    bottom: var(--spacing-ds-6);
    left: 50%;
    transform: translateX(-50%);
  }

  :host([placement="topRight"]),
  :host([placement="topLeft"]) {
    top: var(--spacing-ds-6);
  }

  :host([placement="bottomRight"]),
  :host([placement="bottomLeft"]) {
    bottom: var(--spacing-ds-6);
  }

  .ds-notification {
    --ds-notification-icon: var(--color-ds-primary);
    background: var(--color-ds-surface);
    border: 1px solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: var(--shadow-ds-card);
    box-sizing: border-box;
    display: grid;
    gap: var(--spacing-ds-2) var(--spacing-ds-3);
    grid-template-columns: auto minmax(0, 1fr) auto;
    max-width: min(384px, calc(100vw - 32px));
    min-width: min(384px, calc(100vw - 32px));
    overflow: hidden;
    padding: var(--spacing-ds-4);
  }

  .ds-notification[data-type="success"] {
    --ds-notification-icon: var(--color-ds-success, #389e0d);
  }

  .ds-notification[data-type="warning"] {
    --ds-notification-icon: var(--color-ds-warning, #d48806);
  }

  .ds-notification[data-type="error"] {
    --ds-notification-icon: var(--color-ds-danger);
  }

  .ds-notification__icon {
    color: var(--ds-notification-icon);
    display: inline-flex;
    grid-column: 1;
    margin-block-start: 2px;
  }

  .ds-notification__icon svg {
    height: var(--size-ds-icon-md);
    stroke: currentColor;
    width: var(--size-ds-icon-md);
  }

  .ds-notification__section {
    display: grid;
    gap: var(--spacing-ds-1);
    grid-column: 2;
    min-width: 0;
  }

  .ds-notification__title {
    font-weight: var(--font-weight-ds-strong);
    line-height: var(--leading-ds-tight);
    margin: 0;
    overflow-wrap: anywhere;
  }

  .ds-notification__description {
    color: var(--color-ds-muted);
    margin: 0;
    overflow-wrap: anywhere;
  }

  .ds-notification__close {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-ds-sm);
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    grid-column: 3;
    height: 28px;
    justify-content: center;
    margin: -4px;
    padding: 0;
    width: 28px;
  }

  .ds-notification__close:hover {
    background: var(--color-neutral-alpha-n2, rgba(0, 0, 0, 0.05));
    color: var(--color-ds-text);
  }

  .ds-notification__close:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-notification__close[hidden] {
    display: none;
  }

  .ds-notification__close svg {
    height: 14px;
    width: 14px;
  }

  .ds-notification__progress {
    background: linear-gradient(90deg, var(--color-ds-primary), var(--color-ds-primary-hover));
    grid-column: 1 / -1;
    height: 3px;
    margin: var(--spacing-ds-2) calc(var(--spacing-ds-4) * -1) calc(var(--spacing-ds-4) * -1);
    transform-origin: left;
  }

  .ds-notification__progress[hidden] {
    display: none;
  }
`;
