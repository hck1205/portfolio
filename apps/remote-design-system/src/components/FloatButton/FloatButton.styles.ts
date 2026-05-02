export const FLOAT_BUTTON_STYLES = `
  :host {
    --ds-float-button-size: var(--spacing-m3);
    --ds-float-button-icon-size: var(--ds-icon-size-md);
    display: inline-block;
    position: fixed;
    inset-block-end: var(--spacing-ds-8);
    inset-inline-end: var(--spacing-ds-8);
    z-index: 1000;
  }

  :host([hidden]) {
    display: none !important;
  }

  [hidden] {
    display: none !important;
  }

  .ds-float-button {
    align-items: center;
    appearance: none;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-full);
    box-shadow: var(--ds-shadow-card);
    color: var(--color-ds-text);
    cursor: pointer;
    display: inline-flex;
    flex-direction: column;
    font-family: var(--font-sans);
    font-size: var(--text-ds-1);
    font-weight: var(--ds-font-weight-strong);
    gap: var(--spacing-ds-1);
    height: var(--ds-float-button-size);
    justify-content: center;
    line-height: var(--leading-ds-tight);
    min-width: var(--ds-float-button-size);
    padding: 0;
    position: relative;
    text-align: center;
    text-decoration: none;
    transition:
      background-color 150ms ease-in-out,
      border-color 150ms ease-in-out,
      color 150ms ease-in-out,
      opacity 150ms ease-in-out,
      transform 150ms ease-in-out;
    user-select: none;
    width: var(--ds-float-button-size);
  }

  .ds-float-button:hover {
    background: var(--color-ds-subtle-surface);
    border-color: var(--color-ds-primary);
    color: var(--color-ds-primary);
    transform: translateY(-1px);
  }

  .ds-float-button:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-float-button[aria-disabled="true"],
  .ds-float-button:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  .ds-float-button[aria-disabled="true"]:hover,
  .ds-float-button:disabled:hover {
    background: var(--color-ds-surface);
    border-color: var(--color-ds-border);
    color: var(--color-ds-text);
    transform: none;
  }

  :host([type="primary"]) .ds-float-button {
    background: var(--color-ds-primary);
    border-color: var(--color-ds-primary);
    color: var(--color-neutral-static-light);
  }

  :host([type="primary"]) .ds-float-button:hover {
    background: var(--color-ds-primary-hover);
    border-color: var(--color-ds-primary-hover);
    color: var(--color-neutral-static-light);
  }

  :host([shape="square"]) .ds-float-button {
    border-radius: var(--radius-ds-sm);
    padding: var(--spacing-ds-2);
  }

  :host([shape="square"]) .ds-float-button:has(.ds-float-button__content:not([hidden])) {
    min-height: var(--spacing-m4);
    width: var(--spacing-l1);
  }

  .ds-float-button__icon {
    align-items: center;
    display: inline-flex;
    flex: none;
    height: var(--ds-float-button-icon-size);
    justify-content: center;
    width: var(--ds-float-button-icon-size);
  }

  .ds-float-button__icon svg {
    display: block;
    height: var(--ds-float-button-icon-size);
    width: var(--ds-float-button-icon-size);
  }

  .ds-float-button__content {
    display: block;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :host([shape="circle"]) .ds-float-button__content {
    display: none;
  }

  .ds-float-button__badge {
    align-items: center;
    background: var(--color-ds-danger);
    border: var(--ds-border-width-default) solid var(--color-ds-surface);
    border-radius: var(--radius-full);
    color: var(--color-neutral-static-light);
    display: inline-flex;
    font-size: var(--text-ds-1);
    font-weight: var(--ds-font-weight-strong);
    inset-block-start: calc(var(--spacing-ds-1) * -1);
    inset-inline-end: calc(var(--spacing-ds-1) * -1);
    justify-content: center;
    line-height: 1;
    min-height: var(--spacing-ds-4);
    min-width: var(--spacing-ds-4);
    padding: 0 var(--spacing-ds-1);
    position: absolute;
  }
`;

export const FLOAT_BUTTON_GROUP_STYLES = `
  :host {
    display: inline-flex;
    flex-direction: column;
    gap: var(--spacing-ds-2);
    position: fixed;
    inset-block-end: var(--spacing-ds-8);
    inset-inline-end: var(--spacing-ds-8);
    z-index: 1000;
  }

  [hidden] {
    display: none !important;
  }

  .ds-float-button-group {
    display: inline-flex;
    flex-direction: column;
    gap: var(--spacing-ds-2);
  }

  :host([placement="bottom"]) .ds-float-button-group {
    flex-direction: column-reverse;
  }

  :host([placement="left"]) .ds-float-button-group {
    flex-direction: row-reverse;
  }

  :host([placement="right"]) .ds-float-button-group {
    flex-direction: row;
  }

  .ds-float-button-group__list {
    display: inline-flex;
    flex-direction: column;
    gap: var(--spacing-ds-2);
  }

  :host([placement="left"]) .ds-float-button-group__list,
  :host([placement="right"]) .ds-float-button-group__list {
    flex-direction: row;
  }

  ::slotted(ds-float-button) {
    position: static;
  }

  .ds-float-button-group__trigger {
    align-items: center;
    background: var(--color-ds-primary);
    border: var(--ds-border-width-default) solid var(--color-ds-primary);
    border-radius: var(--radius-full);
    box-shadow: var(--ds-shadow-card);
    color: var(--color-neutral-static-light);
    cursor: pointer;
    display: inline-flex;
    height: var(--spacing-m3);
    justify-content: center;
    padding: 0;
    width: var(--spacing-m3);
  }

  :host([shape="square"]) .ds-float-button-group__trigger {
    border-radius: var(--radius-ds-sm);
  }

  .ds-float-button-group__trigger:hover {
    background: var(--color-ds-primary-hover);
    border-color: var(--color-ds-primary-hover);
  }

  .ds-float-button-group__trigger:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-float-button-group__trigger-icon {
    display: inline-flex;
    transition: transform 150ms ease-in-out;
  }

  :host([open]) .ds-float-button-group__trigger-icon {
    transform: rotate(45deg);
  }
`;
