import { createThinScrollbarStyles } from "../shared/styles/scrollbar";

export const CASCADER_STYLES = `
  :host {
    --ds-cascader-control-height: 32px;
    --ds-cascader-padding-x: 11px;
    --ds-cascader-popup-min-width: 184px;
    --ds-cascader-column-width: 144px;
    --ds-cascader-column-height: 212px;
    display: inline-block;
    font-family: var(--ds-font-family-interface, var(--font-family-interface));
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-normal, 1.5);
    min-width: 0;
    position: relative;
    width: var(--ds-cascader-width, 184px);
  }

  :host([size="small"]) {
    --ds-cascader-control-height: 24px;
    --ds-cascader-padding-x: 7px;
    font-size: var(--text-ds-1);
  }

  :host([size="large"]) {
    --ds-cascader-control-height: 40px;
    font-size: var(--text-ds-3);
  }

  :host([disabled]) {
    cursor: not-allowed;
  }

  .ds-cascader {
    min-width: 0;
    position: relative;
    width: 100%;
  }

  .ds-cascader__selector {
    align-items: center;
    appearance: none;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-sizing: border-box;
    color: var(--color-ds-text);
    cursor: pointer;
    display: grid;
    font: inherit;
    gap: var(--spacing-ds-2);
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    min-height: var(--ds-cascader-control-height);
    padding: 0 var(--ds-cascader-padding-x);
    text-align: left;
    transition:
      background-color 160ms ease,
      border-color 160ms ease,
      box-shadow 160ms ease;
    width: 100%;
  }

  .ds-cascader__selector:hover {
    border-color: var(--color-ds-primary-hover);
  }

  .ds-cascader__selector:focus-visible,
  :host([open]) .ds-cascader__selector {
    border-color: var(--color-ds-primary);
    box-shadow: 0 0 0 var(--ds-focus-ring-width) var(--color-indigo-alpha-indigo3);
    outline: 0;
  }

  :host([variant="filled"]) .ds-cascader__selector {
    background: var(--color-ds-subtle-surface);
  }

  :host([variant="borderless"]) .ds-cascader__selector {
    border-color: transparent;
    box-shadow: none;
  }

  :host([variant="underlined"]) .ds-cascader__selector {
    border-color: transparent transparent var(--color-ds-border);
    border-radius: 0;
    box-shadow: none;
  }

  :host([status="error"]) .ds-cascader__selector {
    border-color: var(--color-ds-danger);
  }

  :host([status="warning"]) .ds-cascader__selector {
    border-color: var(--color-amber-solid-amber6);
  }

  :host([disabled]) .ds-cascader__selector {
    background: var(--color-neutral-alpha-n1);
    border-color: var(--color-ds-border);
    color: var(--color-neutral-alpha-n6);
    cursor: not-allowed;
  }

  .ds-cascader__prefix,
  .ds-cascader__suffix {
    align-items: center;
    color: var(--color-ds-muted);
    display: inline-flex;
    flex: none;
  }

  .ds-cascader__value {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    min-width: 0;
  }

  .ds-cascader__placeholder {
    color: var(--color-ds-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ds-cascader__tag {
    align-items: center;
    background: var(--color-neutral-alpha-n1);
    border: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-sizing: border-box;
    color: var(--color-ds-text);
    display: inline-flex;
    font-size: var(--text-ds-1);
    gap: 4px;
    line-height: var(--leading-ds-tight);
    max-width: 100%;
    min-height: 22px;
    overflow: hidden;
    padding: 2px 6px;
  }

  .ds-cascader__tag-text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ds-cascader__tag-remove {
    align-items: center;
    border-radius: 999px;
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    flex: none;
    height: 14px;
    justify-content: center;
    width: 14px;
  }

  .ds-cascader__tag-remove svg {
    display: block;
    flex: none;
  }

  .ds-cascader__tag-remove:hover {
    background: var(--color-neutral-alpha-n2);
    color: var(--color-ds-text);
  }

  .ds-cascader__clear {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: 999px;
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    height: 22px;
    justify-content: center;
    padding: 0;
    width: 22px;
  }

  .ds-cascader__clear:hover {
    background: var(--color-neutral-alpha-n2);
    color: var(--color-ds-text);
  }

  .ds-cascader__clear[hidden] {
    display: none;
  }

  .ds-cascader__popup {
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: var(--shadow-ds-card);
    box-sizing: border-box;
    color: var(--color-ds-text);
    min-width: var(--ds-cascader-popup-min-width);
    overflow: hidden;
    position: absolute;
    width: max-content;
    z-index: var(--ds-cascader-z-index, 1050);
  }

  .ds-cascader__popup[hidden] {
    display: none;
  }

  .ds-cascader__popup[data-placement^="bottom"] {
    margin-block-start: var(--spacing-ds-1);
    top: 100%;
  }

  .ds-cascader__popup[data-placement^="top"] {
    bottom: 100%;
    margin-block-end: var(--spacing-ds-1);
  }

  .ds-cascader__popup[data-placement$="Left"] {
    left: 0;
  }

  .ds-cascader__popup[data-placement$="Right"] {
    right: 0;
  }

  .ds-cascader__search {
    border-bottom: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    padding: var(--spacing-ds-2);
  }

  .ds-cascader__search-input {
    appearance: none;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-sizing: border-box;
    color: var(--color-ds-text);
    font: inherit;
    min-height: 28px;
    outline: 0;
    padding: 0 var(--spacing-ds-2);
    width: 100%;
  }

  .ds-cascader__search-input:focus {
    border-color: var(--color-ds-primary);
  }

  .ds-cascader__menus {
    display: flex;
    max-width: min(720px, calc(100vw - 48px));
  }

  .ds-cascader__column {
    border-inline-end: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    box-sizing: border-box;
    list-style: none;
    margin: 0;
    max-height: var(--ds-cascader-column-height);
    min-width: max(var(--ds-cascader-column-width), var(--ds-cascader-popup-min-width));
    overflow: auto;
    padding: var(--spacing-ds-1);
  }

  ${createThinScrollbarStyles(".ds-cascader__column")}

  .ds-cascader__column:last-child {
    border-inline-end: 0;
  }

  .ds-cascader__option,
  .ds-cascader__empty {
    align-items: center;
    border-radius: var(--radius-ds-sm);
    box-sizing: border-box;
    display: grid;
    gap: var(--spacing-ds-2);
    grid-template-columns: auto minmax(0, 1fr) auto;
    min-height: 32px;
    padding: 5px 12px;
  }

  .ds-cascader__option {
    cursor: pointer;
  }

  .ds-cascader__option:hover,
  .ds-cascader__option[data-active="true"] {
    background: var(--color-neutral-alpha-n1);
  }

  .ds-cascader__option[aria-selected="true"] {
    background: var(--color-indigo-alpha-indigo2);
    color: var(--color-ds-primary);
    font-weight: 600;
  }

  .ds-cascader__option[aria-disabled="true"] {
    color: var(--color-neutral-alpha-n6);
    cursor: not-allowed;
  }

  .ds-cascader__option-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ds-cascader__option-check,
  .ds-cascader__option-expand {
    align-items: center;
    color: currentColor;
    display: inline-flex;
    justify-content: center;
    min-width: 14px;
  }

  .ds-cascader__option-checkbox {
    align-items: center;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default, 1px) solid var(--color-ds-border);
    border-radius: calc(var(--radius-ds-sm) / 2);
    box-sizing: border-box;
    color: var(--color-ds-surface);
    display: inline-flex;
    height: 14px;
    justify-content: center;
    width: 14px;
  }

  .ds-cascader__option-checkbox[data-checked="true"] {
    background: var(--color-ds-primary);
    border-color: var(--color-ds-primary);
  }

  .ds-cascader__option[aria-disabled="true"] .ds-cascader__option-checkbox {
    background: var(--color-neutral-alpha-n1);
    border-color: var(--color-ds-border);
  }

  .ds-cascader__empty {
    color: var(--color-ds-muted);
    min-width: var(--ds-cascader-column-width);
  }

  .ds-cascader__search-results {
    display: grid;
    list-style: none;
    margin: 0;
    max-height: var(--ds-cascader-column-height);
    min-width: 260px;
    overflow: auto;
    padding: var(--spacing-ds-1);
  }

  ${createThinScrollbarStyles(".ds-cascader__search-results")}

  .ds-cascader__search-result {
    border-radius: var(--radius-ds-sm);
    cursor: pointer;
    padding: 6px 12px;
  }

  .ds-cascader__search-result:hover {
    background: var(--color-neutral-alpha-n1);
  }
`;
