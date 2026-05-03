export const COLOR_PICKER_STYLES = `
  :host {
    --ds-color-picker-control-height: var(--spacing-ds-8);
    display: inline-block;
    font-family: var(--font-sans);
    position: relative;
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none;
  }

  [hidden] {
    display: none !important;
  }

  .ds-color-picker {
    display: inline-block;
    position: relative;
  }

  .ds-color-picker__trigger {
    --ds-color-picker-trigger-height: calc(var(--spacing-m1) - var(--spacing-ds-1));
    --ds-color-picker-swatch-size: calc(
      var(--ds-color-picker-trigger-height) - var(--spacing-ds-2)
    );
    align-items: center;
    appearance: none;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: calc(var(--radius-ds-sm) * 0.75);
    box-sizing: border-box;
    caret-color: transparent;
    color: var(--color-ds-text);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    gap: var(--spacing-ds-2);
    height: var(--ds-color-picker-trigger-height);
    justify-content: center;
    min-width: var(--ds-color-picker-trigger-height);
    padding: var(--spacing-ds-1);
    transition:
      border-color 150ms ease-in-out,
      box-shadow 150ms ease-in-out,
      color 150ms ease-in-out,
      opacity 150ms ease-in-out;
    -webkit-user-select: none;
    user-select: none;
    width: var(--ds-color-picker-trigger-height);
  }

  :host([show-text]) .ds-color-picker__trigger {
    height: max(var(--ds-color-picker-trigger-height), var(--spacing-ds-8));
    justify-content: flex-start;
    padding: var(--spacing-ds-1);
    width: auto;
  }

  .ds-color-picker__trigger:hover {
    border-color: var(--color-ds-primary);
  }

  .ds-color-picker__trigger:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-color-picker__trigger:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  .ds-color-picker__swatch {
    background:
      linear-gradient(45deg, var(--color-neutral-alpha-n3) 25%, transparent 25%),
      linear-gradient(-45deg, var(--color-neutral-alpha-n3) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--color-neutral-alpha-n3) 75%),
      linear-gradient(-45deg, transparent 75%, var(--color-neutral-alpha-n3) 75%);
    background-position: 0 0, 0 8px, 8px -8px, -8px 0;
    background-size: 16px 16px;
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-level1);
    display: inline-flex;
    flex: none;
    height: var(--ds-color-picker-swatch-size);
    overflow: hidden;
    width: var(--ds-color-picker-swatch-size);
  }

  .ds-color-picker__swatch-color {
    display: block;
    height: 100%;
    width: 100%;
  }

  .ds-color-picker__text {
    font-size: var(--text-ds-2);
    line-height: 1.4;
    max-width: 13rem;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ds-color-picker__chevron {
    color: var(--color-ds-muted);
    display: inline-flex;
    flex: none;
  }

  :host(:not([show-text])) .ds-color-picker__chevron {
    display: none;
  }

  .ds-color-picker__popup {
    --ds-color-picker-popup-gap: var(--spacing-ds-2);
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: var(--shadow-ds-card);
    color: var(--color-ds-text);
    display: grid;
    gap: var(--spacing-ds-3);
    inline-size: 16.125rem;
    inset-block-end: auto;
    inset-block-start: calc(100% + var(--ds-color-picker-popup-gap));
    inset-inline-end: auto;
    inset-inline-start: 0;
    padding: var(--spacing-ds-3);
    position: absolute;
    z-index: 20;
  }

  :host([placement="bottomRight"]) .ds-color-picker__popup,
  :host([placement="topRight"]) .ds-color-picker__popup {
    inset-inline-end: 0;
    inset-inline-start: auto;
  }

  :host([placement="topLeft"]) .ds-color-picker__popup,
  :host([placement="topRight"]) .ds-color-picker__popup {
    inset-block-end: calc(100% + var(--ds-color-picker-popup-gap));
    inset-block-start: auto;
  }

  :host([picker-placement="top"]) .ds-color-picker__popup {
    inset-block-end: calc(100% + var(--ds-color-picker-popup-gap));
    inset-block-start: auto;
    inset-inline-end: auto;
    inset-inline-start: 0;
  }

  :host([picker-placement="right"]) .ds-color-picker__popup {
    inset-block-end: auto;
    inset-block-start: 0;
    inset-inline-end: auto;
    inset-inline-start: calc(100% + var(--ds-color-picker-popup-gap));
  }

  :host([picker-placement="left"]) .ds-color-picker__popup {
    inset-block-end: auto;
    inset-block-start: 0;
    inset-inline-end: calc(100% + var(--ds-color-picker-popup-gap));
    inset-inline-start: auto;
  }

  .ds-color-picker__board {
    aspect-ratio: 1.32;
    background:
      linear-gradient(0deg, #000 0%, rgba(0, 0, 0, 0) 100%),
      linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0) 100%),
      var(--ds-color-picker-board-color);
    border-radius: var(--radius-ds-sm);
    cursor: pointer;
    overflow: hidden;
    position: relative;
    touch-action: none;
  }

  .ds-color-picker__board:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-color-picker__board-thumb {
    background: transparent;
    border: var(--ds-border-width-default) solid var(--color-neutral-static-light);
    border-radius: var(--radius-full);
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.25),
      var(--shadow-light-1dp);
    block-size: var(--spacing-ds-4);
    inline-size: var(--spacing-ds-4);
    position: absolute;
    transform: translate(-50%, -50%);
  }

  .ds-color-picker__native {
    block-size: 1px;
    inline-size: 1px;
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
  }

  .ds-color-picker__native::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  .ds-color-picker__native::-webkit-color-swatch {
    border: 0;
    border-radius: calc(var(--radius-ds-sm) / 2);
  }

  .ds-color-picker__controls,
  .ds-color-picker__field {
    display: grid;
    gap: var(--spacing-ds-2);
  }

  .ds-color-picker__sliders {
    display: grid;
    gap: var(--spacing-ds-2);
    grid-template-columns: minmax(0, 1fr) var(--spacing-m2);
  }

  .ds-color-picker__slider-field {
    align-items: center;
    display: grid;
    gap: var(--spacing-ds-2);
    grid-column: 1;
    grid-template-columns: minmax(0, 1fr);
  }

  .ds-color-picker__panel-preview {
    align-self: stretch;
    background:
      linear-gradient(45deg, var(--color-neutral-alpha-n3) 25%, transparent 25%),
      linear-gradient(-45deg, var(--color-neutral-alpha-n3) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--color-neutral-alpha-n3) 75%),
      linear-gradient(-45deg, transparent 75%, var(--color-neutral-alpha-n3) 75%);
    background-position: 0 0, 0 6px, 6px -6px, -6px 0;
    background-size: 12px 12px;
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-level1);
    display: inline-flex;
    grid-column: 2;
    grid-row: 1 / span 2;
    min-block-size: var(--spacing-m2);
    overflow: hidden;
  }

  .ds-color-picker__panel-preview-color {
    display: block;
    inline-size: 100%;
  }

  .ds-color-picker__sr-label {
    height: 1px;
    margin: -1px;
    overflow: hidden;
    position: absolute;
    width: 1px;
  }

  .ds-color-picker__field label {
    color: var(--color-ds-muted);
    font-size: var(--text-ds-1);
    font-weight: var(--ds-font-weight-strong);
    line-height: var(--leading-ds-tight);
  }

  .ds-color-picker__input-row {
    display: grid;
    gap: var(--spacing-ds-2, var(--spacing-xs1));
    grid-template-columns: 3.875rem minmax(0, 1fr) 3rem;
  }

  :host([allow-clear]) .ds-color-picker__input-row {
    grid-template-columns:
      3.875rem minmax(0, 1fr) 3rem var(--ds-color-picker-control-height);
  }

  .ds-color-picker__text-input,
  .ds-color-picker__alpha-input {
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-level1);
    box-sizing: border-box;
    block-size: var(--ds-color-picker-control-height);
    color: var(--color-ds-text);
    font-family: var(--font-sans);
    font-size: var(--text-ds-1);
    line-height: var(--leading-ds-tight);
    min-width: 0;
    padding: 0 var(--spacing-ds-2);
  }

  .ds-color-picker__format-dropdown {
    --ds-dropdown-font-size: var(--text-ds-1);
    --ds-dropdown-min-width: 4.25rem;
    --ds-dropdown-padding: var(--spacing-ds-1);
    --ds-dropdown-trigger-background: var(--color-ds-surface);
    --ds-dropdown-trigger-border: var(--ds-border-width-default) solid var(--color-ds-border);
    --ds-dropdown-trigger-border-radius: var(--radius-level1);
    --ds-dropdown-trigger-color: var(--color-ds-text);
    --ds-dropdown-trigger-height: var(--ds-color-picker-control-height);
    --ds-dropdown-trigger-justify-content: space-between;
    --ds-dropdown-trigger-min-height: 0;
    --ds-dropdown-trigger-padding: 0 var(--spacing-ds-2);
    --ds-dropdown-trigger-width: 100%;
    block-size: var(--ds-color-picker-control-height);
    display: block;
    min-width: 0;
    width: 100%;
  }

  .ds-color-picker__alpha-input {
    text-align: center;
  }

  .ds-color-picker__text-input:focus-visible,
  .ds-color-picker__alpha-input:focus-visible,
  .ds-color-picker__hue:focus-visible,
  .ds-color-picker__alpha:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-color-picker__hue,
  .ds-color-picker__alpha {
    appearance: none;
    background: transparent;
    block-size: var(--spacing-ds-4);
    inline-size: 100%;
    margin: 0;
  }

  .ds-color-picker__hue::-webkit-slider-runnable-track,
  .ds-color-picker__alpha::-webkit-slider-runnable-track {
    border-radius: var(--radius-full);
    block-size: var(--spacing-ds-2);
  }

  .ds-color-picker__hue::-webkit-slider-runnable-track {
    background: linear-gradient(
      90deg,
      #ff0000 0%,
      #ffff00 17%,
      #00ff00 33%,
      #00ffff 50%,
      #0000ff 67%,
      #ff00ff 83%,
      #ff0000 100%
    );
  }

  .ds-color-picker__alpha::-webkit-slider-runnable-track {
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0), var(--ds-color-picker-alpha-color)),
      linear-gradient(45deg, var(--color-neutral-alpha-n3) 25%, transparent 25%),
      linear-gradient(-45deg, var(--color-neutral-alpha-n3) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--color-neutral-alpha-n3) 75%),
      linear-gradient(-45deg, transparent 75%, var(--color-neutral-alpha-n3) 75%);
    background-position: 0 0, 0 0, 0 4px, 4px -4px, -4px 0;
    background-size: auto, 8px 8px, 8px 8px, 8px 8px, 8px 8px;
  }

  .ds-color-picker__hue::-webkit-slider-thumb,
  .ds-color-picker__alpha::-webkit-slider-thumb {
    appearance: none;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-light-1dp);
    block-size: var(--spacing-ds-4);
    cursor: pointer;
    inline-size: var(--spacing-ds-4);
    margin-block-start: calc(var(--spacing-ds-1) * -1);
  }

  .ds-color-picker__hue::-moz-range-track,
  .ds-color-picker__alpha::-moz-range-track {
    border-radius: var(--radius-full);
    block-size: var(--spacing-ds-2);
  }

  .ds-color-picker__hue::-moz-range-track {
    background: linear-gradient(
      90deg,
      #ff0000 0%,
      #ffff00 17%,
      #00ff00 33%,
      #00ffff 50%,
      #0000ff 67%,
      #ff00ff 83%,
      #ff0000 100%
    );
  }

  .ds-color-picker__alpha::-moz-range-track {
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0), var(--ds-color-picker-alpha-color)),
      linear-gradient(45deg, var(--color-neutral-alpha-n3) 25%, transparent 25%);
  }

  .ds-color-picker__hue::-moz-range-thumb,
  .ds-color-picker__alpha::-moz-range-thumb {
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-full);
    block-size: var(--spacing-ds-4);
    cursor: pointer;
    inline-size: var(--spacing-ds-4);
  }

  .ds-color-picker__alpha-value {
    color: var(--color-ds-muted);
    font-size: var(--text-ds-1);
    font-weight: var(--ds-font-weight-strong);
    text-align: end;
  }

  .ds-color-picker__clear {
    align-items: center;
    appearance: none;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-level1);
    block-size: var(--ds-color-picker-control-height);
    box-sizing: border-box;
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-grid;
    inline-size: var(--ds-color-picker-control-height);
    justify-content: center;
    padding: 0;
  }

  .ds-color-picker__clear:hover {
    border-color: var(--color-ds-primary);
    color: var(--color-ds-primary);
  }

  .ds-color-picker__clear svg {
    display: block;
  }

  .ds-color-picker__clear:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-color-picker__clear:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  .ds-color-picker__presets {
    border-block-start: var(--ds-border-width-default) solid var(--color-ds-border);
    display: grid;
    gap: var(--spacing-ds-3);
    padding-block-start: var(--spacing-ds-3);
  }

  .ds-color-picker__preset {
    display: grid;
    gap: var(--spacing-ds-2);
  }

  .ds-color-picker__preset-label {
    color: var(--color-ds-muted);
    font-size: var(--text-ds-1);
    font-weight: var(--ds-font-weight-strong);
  }

  .ds-color-picker__preset-colors {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-ds-2);
  }

  .ds-color-picker__preset-color {
    appearance: none;
    background: var(--preset-color);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-full);
    cursor: pointer;
    height: var(--spacing-ds-5);
    padding: 0;
    width: var(--spacing-ds-5);
  }

  .ds-color-picker__preset-color:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  :host([size="small"]) .ds-color-picker__trigger {
    --ds-color-picker-trigger-height: var(--spacing-ds-6);
  }

  :host([show-text][size="small"]) .ds-color-picker__trigger {
    padding: var(--spacing-ds-1);
  }

  :host([size="large"]) .ds-color-picker__trigger {
    --ds-color-picker-trigger-height: var(--spacing-m2);
  }

  :host([show-text][size="large"]) .ds-color-picker__trigger {
    padding: var(--spacing-ds-1) var(--spacing-ds-2);
  }
`;
