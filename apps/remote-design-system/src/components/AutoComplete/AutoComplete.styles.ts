import { createThinScrollbarStyles } from "../shared/styles/scrollbar";

export const AUTO_COMPLETE_STYLES = `
  :host {
    --ds-auto-complete-height: 32px;
    --ds-auto-complete-padding-x: 11px;
    --ds-auto-complete-popup-max-height: 256px;
    display: inline-block;
    font-family: var(--ds-font-family-interface, var(--font-family-interface));
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-normal, 1.5);
    min-width: 0;
    position: relative;
    width: var(--ds-auto-complete-width, 240px);
  }

  :host([size="small"]) {
    --ds-auto-complete-height: 24px;
    --ds-auto-complete-padding-x: 7px;
    font-size: var(--text-ds-1);
  }

  :host([size="large"]) {
    --ds-auto-complete-height: 40px;
    --ds-auto-complete-padding-x: 11px;
    font-size: var(--text-ds-3);
  }

  :host([disabled]) {
    cursor: not-allowed;
  }

  .ds-auto-complete {
    min-width: 0;
    position: relative;
    width: 100%;
  }

  .ds-auto-complete__control {
    align-items: center;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-sizing: border-box;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    min-height: var(--ds-auto-complete-height);
    overflow: hidden;
    transition:
      border-color 160ms ease,
      box-shadow 160ms ease,
      background-color 160ms ease;
    width: 100%;
  }

  .ds-auto-complete__control:hover {
    border-color: var(--color-ds-primary-hover);
  }

  .ds-auto-complete__control:focus-within {
    border-color: var(--color-ds-primary);
    box-shadow: 0 0 0 var(--ds-focus-ring-width) var(--color-indigo-alpha-indigo3);
  }

  :host([variant="filled"]) .ds-auto-complete__control {
    background: var(--color-ds-subtle-surface);
  }

  :host([variant="borderless"]) .ds-auto-complete__control {
    border-color: transparent;
    box-shadow: none;
  }

  :host([variant="underlined"]) .ds-auto-complete__control {
    border-color: transparent transparent var(--color-ds-border);
    border-radius: 0;
    box-shadow: none;
  }

  :host([status="error"]) .ds-auto-complete__control {
    border-color: var(--color-ds-danger);
  }

  :host([status="warning"]) .ds-auto-complete__control {
    border-color: var(--color-amber-solid-amber6, #d97706);
  }

  :host([disabled]) .ds-auto-complete__control {
    background: var(--color-neutral-alpha-n1);
    border-color: var(--color-ds-border);
  }

  .ds-auto-complete__input,
  .ds-auto-complete__textarea {
    appearance: none;
    background: transparent;
    border: 0;
    box-sizing: border-box;
    color: var(--color-ds-text);
    font: inherit;
    min-height: calc(var(--ds-auto-complete-height) - 2px);
    min-width: 0;
    outline: 0;
    padding: 0 var(--ds-auto-complete-padding-x);
    width: 100%;
  }

  .ds-auto-complete__textarea {
    line-height: var(--leading-ds-readable);
    min-height: 76px;
    padding-block: 7px;
    resize: vertical;
  }

  .ds-auto-complete__input::placeholder,
  .ds-auto-complete__textarea::placeholder {
    color: var(--color-ds-muted);
  }

  .ds-auto-complete__input:disabled,
  .ds-auto-complete__textarea:disabled {
    color: var(--color-neutral-alpha-n6);
    cursor: not-allowed;
  }

  .ds-auto-complete__clear {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: 999px;
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    height: 24px;
    justify-content: center;
    margin-inline-end: 4px;
    padding: 0;
    width: 24px;
  }

  .ds-auto-complete__clear:hover {
    background: var(--color-neutral-alpha-n2);
    color: var(--color-ds-text);
  }

  .ds-auto-complete__clear:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-auto-complete__clear[hidden] {
    display: none;
  }

  .ds-auto-complete__popup {
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: var(--shadow-ds-card);
    box-sizing: border-box;
    color: var(--color-ds-text);
    left: 0;
    margin-block-start: var(--spacing-ds-1);
    max-height: var(--ds-auto-complete-popup-max-height);
    overflow: auto;
    padding: var(--spacing-ds-1);
    position: absolute;
    top: 100%;
    width: 100%;
    z-index: var(--ds-auto-complete-z-index, 1050);
  }

  ${createThinScrollbarStyles(".ds-auto-complete__popup")}

  .ds-auto-complete__popup[hidden] {
    display: none;
  }

  .ds-auto-complete__list {
    display: grid;
    gap: 2px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .ds-auto-complete__option,
  .ds-auto-complete__empty {
    border-radius: var(--radius-ds-sm);
    box-sizing: border-box;
    min-height: 32px;
    padding: 5px 12px;
  }

  .ds-auto-complete__option {
    align-items: center;
    cursor: pointer;
    display: flex;
  }

  .ds-auto-complete__option[data-active="true"] {
    background: var(--color-neutral-alpha-n1);
  }

  .ds-auto-complete__option[aria-selected="true"] {
    background: var(--color-indigo-alpha-indigo2);
    color: var(--color-ds-primary);
    font-weight: 600;
  }

  .ds-auto-complete__option[aria-disabled="true"] {
    color: var(--color-neutral-alpha-n6);
    cursor: not-allowed;
  }

  .ds-auto-complete__empty {
    color: var(--color-ds-muted);
  }

  ds-auto-complete-option {
    display: none;
  }
`;
