import { createThinScrollbarStyles } from "../shared/styles/scrollbar";

export const SELECT_STYLES = `
  :host {
    --ds-select-height: var(--spacing-m2);
    color: var(--color-ds-text);
    display: inline-block;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-tight);
    max-width: 100%;
    position: relative;
    vertical-align: middle;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  :host([size="small"]) {
    --ds-select-height: var(--spacing-m1);
  }

  :host([size="large"]) {
    --ds-select-height: var(--spacing-m3);
  }

  .ds-select {
    display: inline-grid;
    min-width: var(--ds-select-min-width, 12rem);
    position: relative;
    width: 100%;
  }

  .ds-select__selector {
    align-items: center;
    appearance: none;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-sizing: border-box;
    color: var(--color-ds-text);
    cursor: pointer;
    display: grid;
    gap: var(--spacing-ds-2);
    grid-template-columns: minmax(0, 1fr) auto auto;
    min-height: var(--ds-select-height);
    padding: 0 var(--spacing-ds-2);
    text-align: start;
    transition:
      background-color 150ms ease-in-out,
      border-color 150ms ease-in-out,
      box-shadow 150ms ease-in-out,
      color 150ms ease-in-out,
      opacity 150ms ease-in-out;
  }

  :host([variant="filled"]) .ds-select__selector {
    background: var(--color-ds-subtle-surface, var(--color-ds-surface-muted));
  }

  :host([variant="borderless"]) .ds-select__selector {
    border-color: transparent;
  }

  :host([variant="underlined"]) .ds-select__selector {
    border-color: transparent transparent var(--color-ds-border);
    border-radius: 0;
  }

  :host([status="error"]) .ds-select__selector {
    border-color: var(--color-ds-danger);
  }

  :host([status="warning"]) .ds-select__selector {
    border-color: var(--color-ds-warning);
  }

  .ds-select__selector:hover,
  .ds-select__selector:focus-visible {
    border-color: var(--color-ds-primary);
  }

  .ds-select__selector:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-select__value {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-ds-1);
    min-width: 0;
  }

  .ds-select__placeholder {
    color: var(--color-ds-muted);
  }

  .ds-select__tag {
    align-items: center;
    background: var(--color-neutral-alpha-n2);
    border-radius: var(--radius-level1);
    display: inline-flex;
    gap: var(--spacing-ds-1);
    min-width: 0;
    padding: var(--spacing-ds-1) var(--spacing-ds-2);
  }

  .ds-select__tag-remove,
  .ds-select__clear {
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-level1);
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    padding: 0;
  }

  .ds-select__clear,
  .ds-select__chevron {
    align-items: center;
    color: var(--color-ds-muted);
    display: inline-flex;
    justify-content: center;
  }

  .ds-select__popup {
    --ds-select-popup-gap: var(--spacing-ds-2);
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: var(--shadow-ds-card);
    box-sizing: border-box;
    display: grid;
    gap: var(--spacing-ds-2);
    inset-block-start: calc(100% + var(--ds-select-popup-gap));
    inset-inline-start: 0;
    min-width: 100%;
    padding: var(--spacing-ds-2);
    position: absolute;
    z-index: 20;
  }

  :host([placement="bottomRight"]) .ds-select__popup,
  :host([placement="topRight"]) .ds-select__popup {
    inset-inline-end: 0;
    inset-inline-start: auto;
  }

  :host([placement="topLeft"]) .ds-select__popup,
  :host([placement="topRight"]) .ds-select__popup {
    inset-block-end: calc(100% + var(--ds-select-popup-gap));
    inset-block-start: auto;
  }

  .ds-select__search {
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-level1);
    color: var(--color-ds-text);
    font: inherit;
    min-height: var(--spacing-m1);
    padding: 0 var(--spacing-ds-2);
  }

  .ds-select__list {
    display: grid;
    gap: var(--spacing-ds-1);
    max-height: 16rem;
    overflow: auto;
  }

  ${createThinScrollbarStyles(".ds-select__list")}

  .ds-select__option {
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-level1);
    color: var(--color-ds-text);
    cursor: pointer;
    display: flex;
    font: inherit;
    justify-content: space-between;
    min-height: var(--spacing-m1);
    padding: 0 var(--spacing-ds-2);
    text-align: start;
  }

  .ds-select__option[data-active="true"] {
    background: var(--color-neutral-alpha-n2);
  }

  .ds-select__option[aria-selected="true"] {
    color: var(--color-ds-primary);
    font-weight: var(--ds-font-weight-strong);
  }

  .ds-select__option:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  :host([disabled]) .ds-select {
    opacity: 0.6;
  }

  :host([disabled]) .ds-select__selector {
    cursor: not-allowed;
  }
`;
