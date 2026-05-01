export const COLLAPSE_ITEM_STYLES = `
  :host {
    display: block;
  }

  [hidden] {
    display: none !important;
  }

  .ds-collapse__item {
    background: var(--color-ds-surface);
    border-bottom: var(--ds-border-width-default) solid var(--color-ds-border);
  }

  :host(:last-child) .ds-collapse__item {
    border-bottom: 0;
  }

  :host-context(ds-collapse[data-ghost]) .ds-collapse__item {
    background: transparent;
    border-bottom: 0;
  }

  .ds-collapse__heading {
    align-items: stretch;
    background: var(--ds-color-subtle-surface);
    color: var(--color-ds-text);
    display: flex;
    font-size: var(--text-ds-3);
    font-weight: var(--font-weight-ds-strong);
    line-height: var(--leading-ds-tight);
    margin: 0;
    transition: color 150ms ease-in-out, background-color 150ms ease-in-out;
  }

  :host-context(ds-collapse[size="small"]) .ds-collapse__heading {
    font-size: var(--text-ds-2);
  }

  :host-context(ds-collapse[size="large"]) .ds-collapse__heading {
    font-size: var(--text-ds-4);
  }

  :host-context(ds-collapse[data-ghost]) .ds-collapse__heading {
    background: transparent;
  }

  .ds-collapse__trigger {
    align-items: center;
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: flex;
    flex: 1;
    font-family: var(--font-sans);
    font-size: inherit;
    gap: var(--spacing-ds-4);
    line-height: inherit;
    min-width: 0;
    padding: var(--spacing-ds-4) var(--spacing-ds-5);
    text-align: left;
  }

  .ds-collapse__trigger[data-icon-only="true"] {
    flex: none;
    padding: var(--spacing-ds-4) var(--spacing-ds-5);
  }

  .ds-collapse__heading[data-collapsible="icon"] .ds-collapse__label,
  .ds-collapse__heading[data-collapsible="icon"] .ds-collapse__extra {
    align-items: center;
    display: flex;
    padding-bottom: var(--spacing-ds-4);
    padding-top: var(--spacing-ds-4);
  }

  .ds-collapse__heading[data-collapsible="icon"][data-icon-placement="start"] .ds-collapse__extra {
    padding-right: var(--spacing-ds-5);
  }

  .ds-collapse__heading[data-collapsible="icon"][data-icon-placement="end"] .ds-collapse__label {
    padding-left: var(--spacing-ds-5);
  }

  :host-context(ds-collapse[size="small"]) .ds-collapse__trigger {
    padding: var(--spacing-ds-3) var(--spacing-ds-4);
  }

  :host-context(ds-collapse[size="large"]) .ds-collapse__trigger {
    padding: var(--spacing-ds-5) var(--spacing-ds-6);
  }

  .ds-collapse__trigger:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-collapse__trigger:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .ds-collapse__label {
    flex: 1;
    min-width: 0;
    text-align: left;
  }

  .ds-collapse__extra {
    color: var(--color-ds-muted);
    flex: none;
    font-size: var(--text-ds-2);
    font-weight: var(--font-weight-ds-strong);
  }

  .ds-collapse__icon {
    align-items: center;
    color: var(--color-ds-muted);
    display: inline-flex;
    flex: none;
    font-size: var(--text-ds-2);
    justify-content: center;
    text-align: center;
    transition: transform 150ms ease-in-out, color 150ms ease-in-out;
    width: var(--spacing-ds-4);
  }

  .ds-collapse__icon-svg {
    display: block;
    height: var(--ds-icon-size-md);
    pointer-events: none;
    width: var(--ds-icon-size-md);
  }

  :host([open]) .ds-collapse__icon {
    color: var(--color-ds-text);
    transform: rotate(90deg);
  }

  .ds-collapse__body {
    background: var(--color-ds-surface);
    border-top: var(--ds-border-width-default) solid var(--color-ds-border);
    color: var(--color-ds-muted);
    font-size: var(--text-ds-3);
    line-height: var(--leading-ds-readable);
    overflow-y: auto;
    padding: var(--spacing-ds-4) var(--spacing-ds-5);
    transition: border-color 100ms ease-in-out, background-color 100ms ease-in-out, color 100ms ease-in-out;
  }

  :host-context(ds-collapse[size="small"]) .ds-collapse__body {
    font-size: var(--text-ds-2);
    padding: var(--spacing-ds-3) var(--spacing-ds-4);
  }

  :host-context(ds-collapse[size="large"]) .ds-collapse__body {
    padding: var(--spacing-ds-5) var(--spacing-ds-6);
  }

  :host-context(ds-collapse[data-ghost]) .ds-collapse__body {
    background: transparent;
    border-top: 0;
  }
`;
