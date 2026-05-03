export const DATE_PICKER_STYLES = `
  :host {
    --ds-date-picker-height: var(--spacing-m2);
    display: inline-block;
    font-family: var(--font-sans);
    max-width: 100%;
    position: relative;
    vertical-align: middle;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  :host([size="small"]) {
    --ds-date-picker-height: var(--spacing-m1);
  }

  :host([size="large"]) {
    --ds-date-picker-height: var(--spacing-m3);
  }

  .ds-date-picker {
    color: var(--color-ds-text);
    display: inline-grid;
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-tight);
    position: relative;
    width: 100%;
  }

  .ds-date-picker__field {
    align-items: center;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-sizing: border-box;
    display: grid;
    gap: var(--spacing-ds-2);
    grid-template-columns: minmax(0, 1fr) auto auto;
    min-height: var(--ds-date-picker-height);
    min-width: 11.5rem;
    padding: 0 var(--spacing-ds-2);
    transition:
      background-color 150ms ease-in-out,
      border-color 150ms ease-in-out,
      box-shadow 150ms ease-in-out,
      color 150ms ease-in-out,
      opacity 150ms ease-in-out;
  }

  :host([variant="filled"]) .ds-date-picker__field {
    background: var(--color-ds-subtle-surface, var(--color-ds-surface-muted));
  }

  :host([variant="borderless"]) .ds-date-picker__field {
    border-color: transparent;
  }

  :host([variant="underlined"]) .ds-date-picker__field {
    border-color: transparent transparent var(--color-ds-border);
    border-radius: 0;
  }

  :host([status="error"]) .ds-date-picker__field {
    border-color: var(--color-ds-danger);
  }

  :host([status="warning"]) .ds-date-picker__field {
    border-color: var(--color-ds-warning);
  }

  .ds-date-picker__field:focus-within,
  .ds-date-picker__field:hover {
    border-color: var(--color-ds-primary);
  }

  .ds-date-picker__suffix {
    color: var(--color-ds-muted);
    display: inline-flex;
  }

  .ds-date-picker__input {
    appearance: none;
    background: transparent;
    border: 0;
    color: var(--color-ds-text);
    font: inherit;
    min-width: 0;
    outline: 0;
    padding: 0;
  }

  .ds-date-picker__input::placeholder {
    color: var(--color-ds-muted);
  }

  .ds-date-picker__clear,
  .ds-date-picker__nav-button {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-level1);
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    height: var(--spacing-ds-6);
    justify-content: center;
    padding: 0;
    width: var(--spacing-ds-6);
  }

  .ds-date-picker__clear:hover,
  .ds-date-picker__nav-button:hover {
    background: var(--color-ds-surface-hover, var(--color-neutral-alpha-n2));
    color: var(--color-ds-primary);
  }

  .ds-date-picker__clear:focus-visible,
  .ds-date-picker__nav-button:focus-visible,
  .ds-date-picker__cell:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-date-picker__popup {
    --ds-date-picker-popup-gap: var(--spacing-ds-2);
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: var(--shadow-ds-card);
    box-sizing: border-box;
    display: grid;
    gap: var(--spacing-ds-3);
    inset-block-start: calc(100% + var(--ds-date-picker-popup-gap));
    inset-inline-start: 0;
    min-width: 18rem;
    padding: var(--spacing-ds-3);
    position: absolute;
    z-index: 20;
  }

  :host([placement="bottomRight"]) .ds-date-picker__popup,
  :host([placement="topRight"]) .ds-date-picker__popup {
    inset-inline-end: 0;
    inset-inline-start: auto;
  }

  :host([placement="topLeft"]) .ds-date-picker__popup,
  :host([placement="topRight"]) .ds-date-picker__popup {
    inset-block-end: calc(100% + var(--ds-date-picker-popup-gap));
    inset-block-start: auto;
  }

  .ds-date-picker__header {
    align-items: center;
    display: grid;
    gap: var(--spacing-ds-1);
    grid-template-columns: auto auto minmax(0, 1fr) auto auto;
  }

  .ds-date-picker__title {
    font-weight: var(--ds-font-weight-strong);
    text-align: center;
  }

  .ds-date-picker__weekdays,
  .ds-date-picker__grid {
    display: grid;
    gap: var(--spacing-ds-1);
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .ds-date-picker__grid--month,
  .ds-date-picker__grid--year {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .ds-date-picker__weekday {
    color: var(--color-ds-muted);
    font-size: var(--text-ds-1);
    font-weight: var(--ds-font-weight-strong);
    text-align: center;
  }

  .ds-date-picker__cell {
    appearance: none;
    background: transparent;
    border: var(--ds-border-width-default) solid transparent;
    border-radius: var(--radius-level1);
    color: var(--color-ds-text);
    cursor: pointer;
    font: inherit;
    height: var(--spacing-m1);
    padding: 0;
    text-align: center;
  }

  .ds-date-picker__grid--month .ds-date-picker__cell,
  .ds-date-picker__grid--year .ds-date-picker__cell {
    height: var(--spacing-m2);
  }

  .ds-date-picker__cell:hover {
    background: var(--color-ds-surface-hover, var(--color-neutral-alpha-n2));
  }

  .ds-date-picker__cell[aria-current="date"] {
    border-color: var(--color-ds-primary);
  }

  .ds-date-picker__cell[aria-selected="true"] {
    background: var(--color-ds-primary);
    color: var(--color-neutral-static-light);
  }

  .ds-date-picker__cell[data-outside="true"] {
    color: var(--color-ds-muted);
  }

  .ds-date-picker__cell:disabled {
    cursor: not-allowed;
    opacity: 0.42;
  }

  :host([disabled]) .ds-date-picker,
  :host([read-only]) .ds-date-picker {
    opacity: 0.72;
  }

  :host([disabled]) .ds-date-picker__field {
    cursor: not-allowed;
  }
`;
