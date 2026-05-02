export const PAGINATION_STYLES = `
  :host {
    display: block;
    max-width: 100%;
  }

  :host([hidden]) {
    display: none;
  }

  [hidden] {
    display: none !important;
  }

  .ds-pagination {
    align-items: center;
    color: var(--color-ds-text);
    display: flex;
    flex-wrap: wrap;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    gap: var(--spacing-ds-2);
    justify-content: flex-start;
    line-height: var(--leading-ds-tight);
    max-width: 100%;
  }

  :host([align="center"]) .ds-pagination {
    justify-content: center;
  }

  :host([align="end"]) .ds-pagination {
    justify-content: flex-end;
  }

  .ds-pagination__list {
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--spacing-ds-1);
    list-style: none;
    margin: 0;
    min-width: 0;
    padding: 0;
  }

  .ds-pagination__button {
    align-items: center;
    appearance: none;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    color: var(--color-ds-text);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    font-weight: var(--ds-font-weight-strong);
    height: var(--ds-pagination-item-size, var(--spacing-m2));
    justify-content: center;
    min-width: var(--ds-pagination-item-size, var(--spacing-m2));
    padding: 0 var(--spacing-ds-2);
    text-align: center;
    transition:
      background-color 150ms ease-in-out,
      border-color 150ms ease-in-out,
      color 150ms ease-in-out,
      opacity 150ms ease-in-out;
    user-select: none;
    white-space: nowrap;
  }

  .ds-pagination__button:hover {
    border-color: var(--color-ds-primary);
    color: var(--color-ds-primary);
  }

  .ds-pagination__button:focus-visible,
  .ds-pagination__quick-input:focus-visible,
  .ds-pagination__size-select:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-pagination__button[aria-current="page"] {
    border-color: var(--color-ds-primary);
    color: var(--color-ds-primary);
  }

  .ds-pagination__button:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  .ds-pagination__button:disabled:hover {
    border-color: var(--color-ds-border);
    color: var(--color-ds-text);
  }

  .ds-pagination__button--jump {
    color: var(--color-ds-muted);
  }

  .ds-pagination__size-select,
  .ds-pagination__quick-input {
    appearance: none;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    color: var(--color-ds-text);
    font: inherit;
    height: var(--ds-pagination-item-size, var(--spacing-m2));
  }

  .ds-pagination__size-changer {
    display: inline-grid;
    position: relative;
  }

  .ds-pagination__size-select {
    cursor: pointer;
    padding: 0 var(--spacing-ds-6) 0 var(--spacing-ds-3);
  }

  .ds-pagination__size-icon {
    align-items: center;
    color: var(--color-ds-muted);
    display: inline-flex;
    height: 100%;
    justify-content: center;
    pointer-events: none;
    position: absolute;
    right: var(--spacing-ds-2);
    top: 0;
    width: var(--ds-icon-size-sm);
  }

  .ds-pagination__quick {
    align-items: center;
    color: var(--color-ds-muted);
    display: inline-flex;
    gap: var(--spacing-ds-2);
    white-space: nowrap;
  }

  .ds-pagination__quick-input {
    padding: 0 var(--spacing-ds-2);
    text-align: center;
    width: calc(var(--ds-pagination-item-size, var(--spacing-m2)) * 2);
  }

  .ds-pagination__simple {
    align-items: center;
    color: var(--color-ds-muted);
    display: inline-flex;
    gap: var(--spacing-ds-2);
  }

  .ds-pagination__simple-current {
    color: var(--color-ds-text);
    font-weight: var(--ds-font-weight-strong);
  }

  :host([size="small"]) {
    --ds-pagination-item-size: var(--spacing-m1);
  }

  :host([size="large"]) {
    --ds-pagination-item-size: var(--spacing-m3);
  }

  :host([disabled]) .ds-pagination {
    opacity: 0.72;
  }
`;
