const RADIO_HOST_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: inline-flex;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-readable);
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none;
  }
`;

export const RADIO_STYLES = `
  ${RADIO_HOST_STYLES}

  .ds-radio {
    --ds-radio-size: var(--spacing-ds-4);
    --ds-radio-bg: var(--color-ds-surface);
    --ds-radio-border: var(--color-ds-border);
    --ds-radio-dot-size: calc(var(--ds-radio-size) / 2);
    align-items: flex-start;
    cursor: pointer;
    display: inline-flex;
    gap: var(--spacing-ds-2);
    min-width: 0;
    position: relative;
    user-select: none;
  }

  .ds-radio__input {
    height: var(--ds-radio-size);
    inset-block-start: 0.18em;
    inset-inline-start: 0;
    margin: 0;
    opacity: 0;
    position: absolute;
    width: var(--ds-radio-size);
  }

  .ds-radio__control {
    align-items: center;
    background: var(--ds-radio-bg);
    border: var(--ds-border-width-default) solid var(--ds-radio-border);
    border-radius: var(--radius-full);
    box-sizing: border-box;
    display: inline-flex;
    flex: none;
    height: var(--ds-radio-size);
    justify-content: center;
    margin-block-start: 0.18em;
    transition:
      background-color 150ms ease-in-out,
      border-color 150ms ease-in-out,
      box-shadow 150ms ease-in-out;
    width: var(--ds-radio-size);
  }

  .ds-radio__dot {
    background: var(--color-ds-primary);
    border-radius: var(--radius-full);
    display: none;
    height: var(--ds-radio-dot-size);
    width: var(--ds-radio-dot-size);
  }

  .ds-radio__input:hover + .ds-radio__control {
    border-color: var(--color-ds-primary);
  }

  .ds-radio__input:focus-visible + .ds-radio__control {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  :host([data-checked]) .ds-radio__control {
    --ds-radio-border: var(--color-ds-primary);
  }

  :host([data-checked]) .ds-radio__dot {
    display: block;
  }

  .ds-radio__label {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  :host([data-option-type="button"]) {
    display: inline-flex;
  }

  :host([data-option-type="button"]) .ds-radio {
    align-items: center;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-inline-start-width: 0;
    box-sizing: border-box;
    gap: 0;
    justify-content: center;
    min-height: var(--ds-radio-button-height, var(--spacing-m2));
    padding: 0 var(--spacing-ds-4);
  }

  :host([data-option-type="button"]:first-child) .ds-radio {
    border-end-start-radius: var(--radius-ds-sm);
    border-start-start-radius: var(--radius-ds-sm);
    border-inline-start-width: var(--ds-border-width-default);
  }

  :host([data-option-type="button"]:last-child) .ds-radio {
    border-end-end-radius: var(--radius-ds-sm);
    border-start-end-radius: var(--radius-ds-sm);
  }

  :host([data-option-type="button"]) .ds-radio__input,
  :host([data-option-type="button"]) .ds-radio__control {
    height: 1px;
    margin: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    width: 1px;
  }

  :host([data-option-type="button"][data-checked]) .ds-radio {
    border-color: var(--color-ds-primary);
    color: var(--color-ds-primary);
    z-index: 1;
  }

  :host([data-option-type="button"][data-button-style="solid"][data-checked]) .ds-radio {
    background: var(--color-ds-primary);
    color: var(--color-neutral-static-light);
  }

  :host([data-size="small"]) {
    --ds-radio-button-height: var(--spacing-m1);
  }

  :host([data-size="large"]) {
    --ds-radio-button-height: var(--spacing-m3);
  }

  :host([data-disabled]) .ds-radio {
    cursor: not-allowed;
    opacity: 0.48;
  }

  :host([data-disabled]) .ds-radio__input:hover + .ds-radio__control {
    border-color: var(--ds-radio-border);
  }
`;

export const RADIO_GROUP_STYLES = `
  ${RADIO_HOST_STYLES}

  :host {
    display: inline-flex;
  }

  :host([block]) {
    display: flex;
    width: 100%;
  }

  .ds-radio-group {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-ds-3) var(--spacing-ds-5);
    min-width: 0;
  }

  :host([block]) .ds-radio-group {
    width: 100%;
  }

  :host([orientation="vertical"]) .ds-radio-group {
    flex-direction: column;
  }

  :host([option-type="button"]) .ds-radio-group {
    align-items: stretch;
    gap: 0;
  }

  :host([option-type="button"][block]) .ds-radio-group ::slotted(ds-radio) {
    flex: 1 1 0;
  }

  slot {
    display: contents;
  }

  :host([disabled]) .ds-radio-group {
    cursor: not-allowed;
  }
`;
