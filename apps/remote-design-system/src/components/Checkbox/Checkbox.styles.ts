const CHECKBOX_HOST_STYLES = `
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

export const CHECKBOX_STYLES = `
  ${CHECKBOX_HOST_STYLES}

  .ds-checkbox {
    --ds-checkbox-size: var(--spacing-ds-4);
    --ds-checkbox-bg: var(--color-ds-surface);
    --ds-checkbox-border: var(--color-ds-border);
    --ds-checkbox-color: var(--color-neutral-static-light);
    align-items: flex-start;
    cursor: pointer;
    display: inline-flex;
    gap: var(--spacing-ds-2);
    min-width: 0;
    position: relative;
    user-select: none;
  }

  .ds-checkbox__input {
    height: var(--ds-checkbox-size);
    inset-block-start: 0.18em;
    inset-inline-start: 0;
    margin: 0;
    opacity: 0;
    position: absolute;
    width: var(--ds-checkbox-size);
  }

  .ds-checkbox__control {
    align-items: center;
    background: var(--ds-checkbox-bg);
    border: var(--ds-border-width-default) solid var(--ds-checkbox-border);
    border-radius: calc(var(--radius-ds-sm) / 2);
    box-sizing: border-box;
    color: var(--ds-checkbox-color);
    display: inline-flex;
    flex: none;
    height: var(--ds-checkbox-size);
    justify-content: center;
    margin-block-start: 0.18em;
    transition:
      background-color 150ms ease-in-out,
      border-color 150ms ease-in-out,
      box-shadow 150ms ease-in-out;
    width: var(--ds-checkbox-size);
  }

  .ds-checkbox__input:hover + .ds-checkbox__control {
    border-color: var(--color-ds-primary);
  }

  .ds-checkbox__input:focus-visible + .ds-checkbox__control {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-checkbox__mark {
    border: solid currentColor;
    border-width: 0 2px 2px 0;
    display: none;
    height: 8px;
    margin-block-start: -2px;
    transform: rotate(45deg);
    width: 4px;
  }

  :host([data-checked]) .ds-checkbox__control,
  :host([data-indeterminate]) .ds-checkbox__control {
    --ds-checkbox-bg: var(--color-ds-primary);
    --ds-checkbox-border: var(--color-ds-primary);
  }

  :host([data-checked]) .ds-checkbox__mark {
    display: block;
  }

  :host([data-indeterminate]) .ds-checkbox__mark {
    border-width: 0;
    display: block;
    height: 2px;
    margin-block-start: 0;
    transform: none;
    width: 8px;
    background: currentColor;
  }

  .ds-checkbox__label {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  :host([data-disabled]) .ds-checkbox {
    cursor: not-allowed;
    opacity: 0.48;
  }

  :host([data-disabled]) .ds-checkbox__input:hover + .ds-checkbox__control {
    border-color: var(--ds-checkbox-border);
  }
`;

export const CHECKBOX_GROUP_STYLES = `
  ${CHECKBOX_HOST_STYLES}

  .ds-checkbox-group {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-ds-3) var(--spacing-ds-5);
    min-width: 0;
  }

  slot {
    display: contents;
  }

  :host([disabled]) .ds-checkbox-group {
    cursor: not-allowed;
  }
`;
