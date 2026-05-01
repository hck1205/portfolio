export const BUTTON_STYLES = `
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  :host([block]) {
    display: block;
    width: 100%;
  }

  [hidden] {
    display: none !important;
  }

  .ds-button {
    --ds-button-bg: var(--color-ds-surface);
    --ds-button-border: var(--color-ds-border);
    --ds-button-color: var(--color-ds-text);
    --ds-button-hover-bg: var(--color-ds-surface);
    --ds-button-hover-border: var(--color-ds-primary);
    --ds-button-hover-color: var(--color-ds-primary);
    --ds-button-height: var(--spacing-m3);
    --ds-button-icon-size: var(--ds-icon-size-md);
    --ds-button-padding-inline: var(--spacing-ds-5);
    align-items: center;
    appearance: none;
    background: var(--ds-button-bg);
    border: var(--ds-border-width-default) solid var(--ds-button-border);
    border-radius: var(--radius-ds-sm);
    color: var(--ds-button-color);
    cursor: pointer;
    display: inline-flex;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    font-weight: var(--ds-font-weight-strong);
    gap: var(--spacing-ds-2);
    height: var(--ds-button-height);
    justify-content: center;
    line-height: var(--leading-ds-tight);
    min-width: var(--ds-button-height);
    padding: 0 var(--ds-button-padding-inline);
    position: relative;
    text-align: center;
    text-decoration: none;
    transition:
      background-color 150ms ease-in-out,
      border-color 150ms ease-in-out,
      color 150ms ease-in-out,
      opacity 150ms ease-in-out;
    user-select: none;
    white-space: nowrap;
    width: auto;
  }

  :host([block]) .ds-button {
    width: 100%;
  }

  .ds-button:hover {
    background: var(--ds-button-hover-bg);
    border-color: var(--ds-button-hover-border);
    color: var(--ds-button-hover-color);
  }

  .ds-button:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-button[aria-disabled="true"],
  .ds-button:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  .ds-button[aria-disabled="true"]:hover,
  .ds-button:disabled:hover {
    background: var(--ds-button-bg);
    border-color: var(--ds-button-border);
    color: var(--ds-button-color);
  }

  :host([size="small"]) .ds-button {
    --ds-button-height: var(--spacing-m1);
    --ds-button-padding-inline: var(--spacing-ds-3);
    font-size: var(--text-ds-1);
  }

  :host([size="large"]) .ds-button {
    --ds-button-height: var(--spacing-m4);
    --ds-button-padding-inline: var(--spacing-ds-6);
    font-size: var(--text-ds-3);
  }

  :host([shape="round"]) .ds-button {
    border-radius: var(--radius-full);
  }

  :host([shape="circle"]) .ds-button {
    border-radius: var(--radius-full);
    padding-inline: 0;
    width: var(--ds-button-height);
  }

  :host([data-color="primary"][data-variant="solid"]) .ds-button {
    --ds-button-bg: var(--color-ds-primary);
    --ds-button-border: var(--color-ds-primary);
    --ds-button-color: var(--color-neutral-static-light);
    --ds-button-hover-bg: var(--color-ds-primary-hover);
    --ds-button-hover-border: var(--color-ds-primary-hover);
    --ds-button-hover-color: var(--color-neutral-static-light);
  }

  :host([data-color="danger"][data-variant="solid"]) .ds-button {
    --ds-button-bg: var(--color-ds-danger);
    --ds-button-border: var(--color-ds-danger);
    --ds-button-color: var(--color-neutral-static-light);
    --ds-button-hover-bg: var(--color-ds-danger-hover);
    --ds-button-hover-border: var(--color-ds-danger-hover);
    --ds-button-hover-color: var(--color-neutral-static-light);
  }

  :host([data-color="primary"][data-variant="outlined"]),
  :host([data-color="primary"][data-variant="dashed"]) {
    --ds-button-border: var(--color-ds-primary);
    --ds-button-color: var(--color-ds-primary);
    --ds-button-hover-border: var(--color-ds-primary-hover);
    --ds-button-hover-color: var(--color-ds-primary-hover);
  }

  :host([data-color="danger"][data-variant="outlined"]),
  :host([data-color="danger"][data-variant="dashed"]) {
    --ds-button-border: var(--color-ds-danger);
    --ds-button-color: var(--color-ds-danger);
    --ds-button-hover-border: var(--color-ds-danger-hover);
    --ds-button-hover-color: var(--color-ds-danger-hover);
  }

  :host([data-variant="dashed"]) .ds-button {
    border-style: dashed;
  }

  :host([data-variant="filled"]) .ds-button {
    --ds-button-bg: var(--ds-color-subtle-surface);
    --ds-button-border: transparent;
    --ds-button-hover-bg: var(--color-neutral-alpha-n2);
  }

  :host([data-color="primary"][data-variant="filled"]) .ds-button {
    --ds-button-bg: var(--color-indigo-alpha-indigo1);
    --ds-button-border: transparent;
    --ds-button-color: var(--color-ds-primary);
    --ds-button-hover-bg: var(--color-indigo-alpha-indigo2);
    --ds-button-hover-color: var(--color-ds-primary-hover);
  }

  :host([data-color="danger"][data-variant="filled"]) .ds-button {
    --ds-button-bg: var(--color-coral-alpha-coral1);
    --ds-button-border: transparent;
    --ds-button-color: var(--color-ds-danger);
    --ds-button-hover-bg: var(--color-coral-alpha-coral2);
    --ds-button-hover-color: var(--color-ds-danger-hover);
  }

  :host([data-variant="text"]) .ds-button,
  :host([data-variant="link"]) .ds-button {
    --ds-button-bg: transparent;
    --ds-button-border: transparent;
    --ds-button-hover-bg: var(--ds-color-subtle-surface);
    --ds-button-hover-border: transparent;
  }

  :host([data-variant="link"]) .ds-button {
    --ds-button-color: var(--color-ds-primary);
    --ds-button-hover-bg: transparent;
    --ds-button-hover-color: var(--color-ds-primary-hover);
    min-width: auto;
    padding-inline: 0;
  }

  :host([data-color="danger"][data-variant="text"]) .ds-button,
  :host([data-color="danger"][data-variant="link"]) .ds-button {
    --ds-button-color: var(--color-ds-danger);
    --ds-button-hover-color: var(--color-ds-danger-hover);
  }

  :host([ghost]) .ds-button {
    --ds-button-bg: transparent;
    --ds-button-border: var(--color-neutral-static-light);
    --ds-button-color: var(--color-neutral-static-light);
    --ds-button-hover-bg: rgba(255, 255, 255, 0.12);
    --ds-button-hover-border: var(--color-neutral-static-light);
    --ds-button-hover-color: var(--color-neutral-static-light);
  }

  :host([ghost][data-color="primary"]) .ds-button {
    --ds-button-border: var(--color-ds-primary);
    --ds-button-color: var(--color-ds-primary);
    --ds-button-hover-bg: transparent;
    --ds-button-hover-border: var(--color-ds-primary-hover);
    --ds-button-hover-color: var(--color-ds-primary-hover);
  }

  :host([ghost][data-color="danger"]) .ds-button {
    --ds-button-border: var(--color-ds-danger);
    --ds-button-color: var(--color-ds-danger);
    --ds-button-hover-bg: transparent;
    --ds-button-hover-border: var(--color-ds-danger-hover);
    --ds-button-hover-color: var(--color-ds-danger-hover);
  }

  :host([ghost][data-variant="text"]) .ds-button,
  :host([ghost][data-variant="link"]) .ds-button {
    --ds-button-border: transparent;
  }

  .ds-button__icon,
  .ds-button__loading {
    align-items: center;
    display: inline-flex;
    flex: none;
    height: var(--ds-button-icon-size);
    justify-content: center;
    width: var(--ds-button-icon-size);
  }

  .ds-button__loading svg {
    animation: ds-button-spin 850ms linear infinite;
    display: block;
    height: var(--ds-button-icon-size);
    width: var(--ds-button-icon-size);
  }

  .ds-button__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @keyframes ds-button-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
