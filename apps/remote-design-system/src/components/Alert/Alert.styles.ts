export const ALERT_STYLES = `
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

  .ds-alert {
    --ds-alert-bg: var(--color-neutral-alpha-n1, rgba(0, 0, 0, 0.03));
    --ds-alert-border: var(--color-ds-border);
    --ds-alert-icon: var(--color-ds-muted);
    align-items: flex-start;
    background: var(--ds-alert-bg);
    border: var(--ds-border-width-default, 1px) solid var(--ds-alert-border);
    border-radius: var(--radius-ds-sm);
    box-sizing: border-box;
    display: grid;
    gap: var(--spacing-ds-3);
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    min-width: min(100%, 280px);
    padding: var(--spacing-ds-3) var(--spacing-ds-4);
  }

  .ds-alert[data-type="success"] {
    --ds-alert-bg: var(--color-green-alpha-green1, rgba(82, 196, 26, 0.12));
    --ds-alert-border: var(--color-green-alpha-green3, rgba(82, 196, 26, 0.28));
    --ds-alert-icon: var(--color-ds-success, #389e0d);
  }

  .ds-alert[data-type="info"] {
    --ds-alert-bg: var(--color-blue-alpha-blue1, rgba(22, 119, 255, 0.1));
    --ds-alert-border: var(--color-blue-alpha-blue3, rgba(22, 119, 255, 0.24));
    --ds-alert-icon: var(--color-ds-primary);
  }

  .ds-alert[data-type="warning"] {
    --ds-alert-bg: var(--color-yellow-alpha-yellow1, rgba(250, 173, 20, 0.14));
    --ds-alert-border: var(--color-yellow-alpha-yellow3, rgba(250, 173, 20, 0.3));
    --ds-alert-icon: var(--color-ds-warning, #d48806);
  }

  .ds-alert[data-type="error"] {
    --ds-alert-bg: var(--color-red-alpha-red1, rgba(255, 77, 79, 0.1));
    --ds-alert-border: var(--color-red-alpha-red3, rgba(255, 77, 79, 0.28));
    --ds-alert-icon: var(--color-ds-danger);
  }

  .ds-alert[data-banner="true"] {
    border-inline: 0;
    border-radius: 0;
    min-width: 100%;
  }

  .ds-alert__icon {
    color: var(--ds-alert-icon);
    display: inline-flex;
    grid-column: 1;
    line-height: 1;
    margin-block-start: 2px;
  }

  .ds-alert__icon[hidden] {
    display: none;
  }

  .ds-alert__icon svg {
    display: block;
    height: var(--size-ds-icon-md);
    stroke: currentColor;
    width: var(--size-ds-icon-md);
  }

  .ds-alert__section {
    display: grid;
    gap: var(--spacing-ds-1);
    grid-column: 2;
    min-width: 0;
  }

  .ds-alert__title {
    color: var(--color-ds-text);
    font-weight: var(--font-weight-ds-strong);
    line-height: var(--leading-ds-tight);
    margin: 0;
    overflow-wrap: anywhere;
  }

  .ds-alert__description {
    color: var(--color-ds-muted);
    margin: 0;
    overflow-wrap: anywhere;
  }

  .ds-alert__description[hidden] {
    display: none;
  }

  .ds-alert__actions {
    align-items: center;
    display: inline-flex;
    gap: var(--spacing-ds-2);
    grid-column: 3;
    justify-content: flex-end;
  }

  .ds-alert__actions:empty {
    display: none;
  }

  .ds-alert__close {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-ds-sm);
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    grid-column: 4;
    height: 28px;
    justify-content: center;
    margin: -4px;
    padding: 0;
    width: 28px;
  }

  .ds-alert__close:hover {
    background: var(--color-neutral-alpha-n2, rgba(0, 0, 0, 0.05));
    color: var(--color-ds-text);
  }

  .ds-alert__close:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-alert__close[hidden] {
    display: none;
  }

  .ds-alert__close svg {
    height: var(--size-ds-icon-md);
    width: var(--size-ds-icon-md);
  }
`;
