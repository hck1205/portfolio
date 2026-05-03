export const INPUT_STYLES = `
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

  .ds-input {
    --ds-input-bg: var(--color-ds-surface);
    --ds-input-border: var(--color-ds-border);
    --ds-input-color: var(--color-ds-text);
    --ds-input-height: 32px;
    --ds-input-padding-inline: 11px;
    --ds-input-shadow: transparent;
    --ds-input-hover-border: var(--color-ds-primary-hover);
    --ds-input-active-border: var(--color-ds-primary);
    --ds-input-count-color: var(--color-ds-muted);
    align-items: center;
    background: var(--ds-input-bg);
    border: var(--ds-border-width-default) solid var(--ds-input-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: 0 0 0 0 var(--ds-input-shadow);
    box-sizing: border-box;
    color: var(--ds-input-color);
    display: inline-flex;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    gap: var(--spacing-ds-2);
    min-height: var(--ds-input-height);
    padding: 0 var(--ds-input-padding-inline);
    transition:
      background-color 150ms ease-in-out,
      border-color 150ms ease-in-out,
      box-shadow 150ms ease-in-out,
      color 150ms ease-in-out;
    width: 100%;
  }

  :host(:not([block])) .ds-input {
    min-width: 220px;
  }

  .ds-input:hover {
    border-color: var(--ds-input-hover-border);
  }

  .ds-input:focus-within {
    border-color: var(--ds-input-active-border);
    box-shadow: 0 0 0 2px var(--ds-input-shadow);
  }

  .ds-input__control {
    appearance: none;
    background: transparent;
    border: 0;
    box-sizing: border-box;
    color: inherit;
    flex: 1 1 auto;
    font: inherit;
    line-height: var(--leading-ds-normal);
    margin: 0;
    min-width: 0;
    outline: 0;
    padding: 0;
    width: 100%;
  }

  .ds-input__control::placeholder {
    color: var(--color-ds-muted);
  }

  .ds-input__control:disabled {
    cursor: not-allowed;
  }

  .ds-input__control[type="search"]::-webkit-search-cancel-button,
  .ds-input__control[type="search"]::-webkit-search-decoration {
    appearance: none;
  }

  .ds-input__prefix,
  .ds-input__suffix {
    align-items: center;
    color: var(--color-ds-muted);
    display: inline-flex;
    flex: 0 0 auto;
    line-height: 0;
  }

  .ds-input__action {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-ds-xs);
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    height: 24px;
    justify-content: center;
    margin: 0;
    padding: 0;
    transition:
      background-color 150ms ease-in-out,
      color 150ms ease-in-out;
    width: 24px;
  }

  .ds-input__action:hover {
    background: var(--color-ds-subtle-surface);
    color: var(--color-ds-text);
  }

  .ds-input__action:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-input__count {
    color: var(--ds-input-count-color);
    flex: 0 0 auto;
    font-size: var(--text-ds-1);
    line-height: var(--leading-ds-tight);
  }

  .ds-input__spinner {
    animation: ds-input-spin 0.9s linear infinite;
  }

  :host([size="small"]) .ds-input {
    --ds-input-height: 24px;
    --ds-input-padding-inline: 7px;
    font-size: var(--text-ds-1);
  }

  :host([size="large"]) .ds-input {
    --ds-input-height: 40px;
    --ds-input-padding-inline: 11px;
    font-size: var(--text-ds-3);
  }

  :host([variant="filled"]) .ds-input {
    --ds-input-bg: var(--color-ds-subtle-surface);
    --ds-input-border: transparent;
    --ds-input-hover-border: transparent;
  }

  :host([variant="filled"]) .ds-input:hover,
  :host([variant="filled"]) .ds-input:focus-within {
    --ds-input-bg: var(--color-ds-subtle-surface);
  }

  :host([variant="borderless"]) .ds-input {
    --ds-input-border: transparent;
    --ds-input-hover-border: transparent;
  }

  :host([variant="borderless"]) .ds-input:focus-within {
    box-shadow: none;
  }

  :host([variant="underlined"]) .ds-input {
    border-color: transparent transparent var(--ds-input-border);
    border-radius: 0;
  }

  :host([variant="underlined"]) .ds-input:hover {
    border-bottom-color: var(--ds-input-hover-border);
  }

  :host([variant="underlined"]) .ds-input:focus-within {
    border-bottom-color: var(--ds-input-active-border);
    box-shadow: 0 1px 0 0 var(--ds-input-active-border);
  }

  :host([status="error"]) .ds-input {
    --ds-input-active-border: var(--color-ds-danger);
    --ds-input-border: var(--color-ds-danger);
    --ds-input-hover-border: var(--color-ds-danger-hover);
    --ds-input-shadow: color-mix(in srgb, var(--color-ds-danger) 14%, transparent);
    --ds-input-count-color: var(--color-ds-danger);
  }

  :host([status="warning"]) .ds-input {
    --ds-input-active-border: #d97706;
    --ds-input-border: #d97706;
    --ds-input-hover-border: #b45309;
    --ds-input-shadow: rgb(217 119 6 / 16%);
    --ds-input-count-color: #b45309;
  }

  :host([disabled]) .ds-input {
    --ds-input-bg: var(--color-ds-subtle-surface);
    --ds-input-border: var(--color-ds-border);
    color: var(--color-ds-muted);
    cursor: not-allowed;
  }

  :host([disabled]) .ds-input:hover {
    border-color: var(--ds-input-border);
  }

  :host([data-mode="textarea"]) .ds-input {
    align-items: flex-start;
    padding-block: 6px;
  }

  :host([data-mode="textarea"]) .ds-input__control {
    min-height: calc(var(--ds-input-height) * 2);
    resize: vertical;
  }

  :host([data-has-enter-button]) .ds-input {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
    border-inline-end: 0;
    min-width: 0;
  }

  .ds-input-search {
    align-items: stretch;
    display: inline-flex;
    width: 100%;
  }

  :host([data-mode="search"]:not([block])) .ds-input-search {
    min-width: 320px;
  }

  .ds-input-search__button {
    align-items: center;
    appearance: none;
    background: var(--color-ds-primary);
    border: var(--ds-border-width-default) solid var(--color-ds-primary);
    border-radius: 0 var(--radius-ds-sm) var(--radius-ds-sm) 0;
    color: var(--color-neutral-static-light);
    cursor: pointer;
    display: inline-flex;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    font-weight: var(--ds-font-weight-strong);
    gap: var(--spacing-ds-2);
    justify-content: center;
    min-height: var(--ds-input-height);
    min-width: 78px;
    padding: 0 var(--spacing-ds-5);
    transition:
      background-color 150ms ease-in-out,
      border-color 150ms ease-in-out;
  }

  .ds-input-search__button > svg,
  .ds-input-search__button > span {
    flex: 0 0 auto;
  }

  .ds-input-search__button:hover {
    background: var(--color-ds-primary-hover);
    border-color: var(--color-ds-primary-hover);
  }

  .ds-input-search__button:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  :host([disabled]) .ds-input__action,
  :host([disabled]) .ds-input-search__button {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }

  @keyframes ds-input-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
