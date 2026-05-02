export const INPUT_NUMBER_STYLES = `
  :host {
    display: inline-block;
    max-width: 100%;
    vertical-align: middle;
  }

  :host([block]) {
    display: block;
    width: 100%;
  }

  [hidden] {
    display: none !important;
  }

  .ds-input-number {
    --ds-input-number-bg: var(--color-ds-surface);
    --ds-input-number-border: var(--color-ds-border);
    --ds-input-number-color: var(--color-ds-text);
    --ds-input-number-control-width: 22px;
    --ds-input-number-height: 32px;
    --ds-input-number-hover-border: var(--color-ds-primary-hover);
    --ds-input-number-padding-inline: 11px;
    --ds-input-number-shadow: transparent;
    align-items: stretch;
    background: var(--ds-input-number-bg);
    border: var(--ds-border-width-default) solid var(--ds-input-number-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: 0 0 0 0 var(--ds-input-number-shadow);
    box-sizing: border-box;
    color: var(--ds-input-number-color);
    display: inline-flex;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    min-height: var(--ds-input-number-height);
    min-width: 120px;
    overflow: hidden;
    transition:
      background-color 150ms ease-in-out,
      border-color 150ms ease-in-out,
      box-shadow 150ms ease-in-out,
      color 150ms ease-in-out;
    width: 100%;
  }

  :host(:not([block])) .ds-input-number {
    width: 160px;
  }

  .ds-input-number:hover {
    border-color: var(--ds-input-number-hover-border);
  }

  .ds-input-number:focus-within {
    border-color: var(--color-ds-primary);
    box-shadow: 0 0 0 2px var(--ds-input-number-shadow);
  }

  .ds-input-number__affix {
    align-items: center;
    color: var(--color-ds-muted);
    display: inline-flex;
    flex: 0 0 auto;
    line-height: 0;
    padding-inline: var(--spacing-ds-3) 0;
  }

  .ds-input-number__body {
    align-items: center;
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
  }

  .ds-input-number__control {
    appearance: textfield;
    background: transparent;
    border: 0;
    box-sizing: border-box;
    color: inherit;
    flex: 1 1 auto;
    font: inherit;
    line-height: var(--leading-ds-normal);
    min-width: 0;
    outline: 0;
    padding: 0 var(--ds-input-number-padding-inline);
    width: 100%;
  }

  .ds-input-number__control::placeholder {
    color: var(--color-ds-muted);
  }

  .ds-input-number__control::-webkit-inner-spin-button,
  .ds-input-number__control::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }

  .ds-input-number__actions {
    border-inline-start: var(--ds-border-width-default) solid var(--color-ds-border);
    display: flex;
    flex: 0 0 var(--ds-input-number-control-width);
    flex-direction: column;
  }

  .ds-input-number__step {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    flex: 1 1 0;
    justify-content: center;
    margin: 0;
    min-height: 0;
    padding: 0;
    transition:
      background-color 150ms ease-in-out,
      color 150ms ease-in-out;
  }

  .ds-input-number__step + .ds-input-number__step {
    border-block-start: var(--ds-border-width-default) solid var(--color-ds-border);
  }

  .ds-input-number__step:hover {
    background: var(--color-ds-subtle-surface);
    color: var(--color-ds-primary);
  }

  .ds-input-number__step:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-input-number__step:disabled {
    color: var(--color-neutral-alpha-n5);
    cursor: not-allowed;
  }

  :host([size="small"]) .ds-input-number {
    --ds-input-number-control-width: 20px;
    --ds-input-number-height: 24px;
    --ds-input-number-padding-inline: 7px;
    font-size: var(--text-ds-1);
  }

  :host([size="large"]) .ds-input-number {
    --ds-input-number-control-width: 24px;
    --ds-input-number-height: 40px;
    --ds-input-number-padding-inline: 11px;
    font-size: var(--text-ds-3);
  }

  :host([variant="filled"]) .ds-input-number {
    --ds-input-number-bg: var(--color-ds-subtle-surface);
    --ds-input-number-border: transparent;
    --ds-input-number-hover-border: transparent;
  }

  :host([variant="borderless"]) .ds-input-number {
    --ds-input-number-border: transparent;
    --ds-input-number-hover-border: transparent;
  }

  :host([variant="borderless"]) .ds-input-number:focus-within {
    box-shadow: none;
  }

  :host([variant="underlined"]) .ds-input-number {
    border-color: transparent transparent var(--ds-input-number-border);
    border-radius: 0;
  }

  :host([variant="underlined"]) .ds-input-number:focus-within {
    border-bottom-color: var(--color-ds-primary);
    box-shadow: 0 1px 0 0 var(--color-ds-primary);
  }

  :host([status="error"]) .ds-input-number {
    --ds-input-number-border: var(--color-ds-danger);
    --ds-input-number-hover-border: var(--color-ds-danger-hover);
    --ds-input-number-shadow: var(--color-coral-alpha-coral3);
  }

  :host([status="warning"]) .ds-input-number {
    --ds-input-number-border: var(--color-amber-solid-amber6);
    --ds-input-number-hover-border: var(--color-amber-solid-amber7);
    --ds-input-number-shadow: var(--color-amber-alpha-amber3);
  }

  :host([disabled]) .ds-input-number {
    --ds-input-number-bg: var(--color-ds-subtle-surface);
    color: var(--color-ds-muted);
    cursor: not-allowed;
  }

  :host([disabled]) .ds-input-number:hover {
    border-color: var(--ds-input-number-border);
  }

  :host([disabled]) .ds-input-number__control,
  :host([readonly]) .ds-input-number__control {
    cursor: not-allowed;
  }

  :host([disabled]) .ds-input-number__step,
  :host([readonly]) .ds-input-number__step {
    cursor: not-allowed;
    pointer-events: none;
  }

  :host([data-controls="false"]) .ds-input-number__actions {
    display: none;
  }
`;
