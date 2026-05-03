export const MENTIONS_STYLES = `
  :host {
    display: inline-block;
    max-width: 100%;
    position: relative;
    vertical-align: middle;
  }

  :host(:focus-within) {
    z-index: var(--z-index-ds-dropdown, 1050);
  }

  :host([block]) {
    display: block;
    width: 100%;
  }

  [hidden] {
    display: none !important;
  }

  .ds-mentions {
    --ds-mentions-bg: var(--color-ds-surface);
    --ds-mentions-border: var(--color-ds-border);
    --ds-mentions-color: var(--color-ds-text);
    --ds-mentions-control-content-height: calc(
      var(--ds-mentions-control-min-height) - var(--ds-mentions-padding-block) * 2
    );
    --ds-mentions-control-min-height: 32px;
    --ds-mentions-hover-border: var(--color-ds-primary-hover);
    --ds-mentions-padding-block: 0px;
    --ds-mentions-padding-inline: 11px;
    --ds-mentions-shadow: transparent;
    align-items: center;
    background: var(--ds-mentions-bg);
    border: var(--ds-border-width-default) solid var(--ds-mentions-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: 0 0 0 0 var(--ds-mentions-shadow);
    box-sizing: border-box;
    color: var(--ds-mentions-color);
    display: flex;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-normal);
    min-height: var(--ds-mentions-control-min-height);
    min-width: 260px;
    padding: var(--ds-mentions-padding-block) var(--ds-mentions-padding-inline);
    position: relative;
    transition:
      background-color 150ms ease-in-out,
      border-color 150ms ease-in-out,
      box-shadow 150ms ease-in-out,
      color 150ms ease-in-out;
    width: 100%;
  }

  :host(:not([block])) .ds-mentions {
    width: 360px;
  }

  .ds-mentions:hover {
    border-color: var(--ds-mentions-hover-border);
  }

  .ds-mentions:focus-within {
    border-color: var(--color-ds-primary);
    box-shadow: 0 0 0 2px var(--ds-mentions-shadow);
  }

  .ds-mentions__control {
    background: transparent;
    border: 0;
    box-sizing: border-box;
    color: inherit;
    flex: 1 1 auto;
    font: inherit;
    height: var(--ds-mentions-control-content-height);
    line-height: var(--ds-mentions-control-content-height);
    margin: 0;
    min-height: var(--ds-mentions-control-content-height);
    min-width: 0;
    outline: 0;
    overflow: hidden;
    padding: 0;
    resize: none;
    width: 100%;
  }

  .ds-mentions__control::placeholder {
    color: var(--color-ds-muted);
  }

  .ds-mentions__clear {
    align-items: center;
    appearance: none;
    align-self: center;
    background: transparent;
    border: 0;
    border-radius: var(--radius-ds-xs);
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    flex: 0 0 auto;
    height: 24px;
    justify-content: center;
    margin: 0;
    padding: 0;
    width: 24px;
  }

  .ds-mentions__clear:hover {
    background: var(--color-ds-subtle-surface);
    color: var(--color-ds-text);
  }

  .ds-mentions__clear:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-mentions__popup {
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    box-shadow: var(--shadow-ds-card);
    box-sizing: border-box;
    display: grid;
    gap: 2px;
    inset-inline: 0;
    max-height: 220px;
    overflow-y: auto;
    padding: var(--spacing-ds-2);
    position: absolute;
    z-index: var(--z-index-ds-dropdown, 1050);
  }

  :host([placement="bottom"]) .ds-mentions__popup {
    margin-top: var(--spacing-ds-1);
    top: 100%;
  }

  :host([placement="top"]) .ds-mentions__popup {
    bottom: 100%;
    margin-bottom: var(--spacing-ds-1);
  }

  .ds-mentions__option,
  .ds-mentions__empty {
    align-items: center;
    border-radius: var(--radius-ds-xs);
    box-sizing: border-box;
    color: var(--color-ds-text);
    display: flex;
    font: inherit;
    gap: var(--spacing-ds-2);
    min-height: 32px;
    padding: 0 var(--spacing-ds-3);
    text-align: start;
  }

  .ds-mentions__option {
    appearance: none;
    background: transparent;
    border: 0;
    cursor: pointer;
    width: 100%;
  }

  .ds-mentions__option:hover,
  .ds-mentions__option[data-active="true"] {
    background: var(--color-ds-subtle-surface);
    color: var(--color-ds-primary);
  }

  .ds-mentions__option:disabled {
    color: var(--color-ds-muted);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .ds-mentions__empty {
    color: var(--color-ds-muted);
  }

  :host([size="small"]) .ds-mentions {
    --ds-mentions-control-min-height: 24px;
    --ds-mentions-padding-block: 0px;
    --ds-mentions-padding-inline: 7px;
    font-size: var(--text-ds-1);
  }

  :host([size="large"]) .ds-mentions {
    --ds-mentions-control-min-height: 40px;
    --ds-mentions-padding-block: 0px;
    --ds-mentions-padding-inline: 11px;
    font-size: var(--text-ds-3);
  }

  :host([data-multiline="true"]) .ds-mentions {
    --ds-mentions-control-min-height: 56px;
    --ds-mentions-padding-block: 6px;
    align-items: flex-start;
  }

  :host([data-multiline="true"]) .ds-mentions__control {
    height: auto;
    line-height: inherit;
    overflow: auto;
    resize: vertical;
  }

  :host([data-multiline="true"]) .ds-mentions__clear {
    align-self: flex-start;
  }

  :host([data-multiline="true"][size="small"]) .ds-mentions {
    --ds-mentions-control-min-height: 48px;
    --ds-mentions-padding-block: 5px;
  }

  :host([data-multiline="true"][size="large"]) .ds-mentions {
    --ds-mentions-control-min-height: 72px;
    --ds-mentions-padding-block: 8px;
  }

  :host([variant="filled"]) .ds-mentions {
    --ds-mentions-bg: var(--color-ds-subtle-surface);
    --ds-mentions-border: transparent;
    --ds-mentions-hover-border: transparent;
  }

  :host([variant="borderless"]) .ds-mentions {
    --ds-mentions-border: transparent;
    --ds-mentions-hover-border: transparent;
  }

  :host([variant="borderless"]) .ds-mentions:focus-within {
    box-shadow: none;
  }

  :host([variant="underlined"]) .ds-mentions {
    border-color: transparent transparent var(--ds-mentions-border);
    border-radius: 0;
  }

  :host([variant="underlined"]) .ds-mentions:focus-within {
    border-bottom-color: var(--color-ds-primary);
    box-shadow: 0 1px 0 0 var(--color-ds-primary);
  }

  :host([status="error"]) .ds-mentions {
    --ds-mentions-border: var(--color-ds-danger);
    --ds-mentions-hover-border: var(--color-ds-danger-hover);
    --ds-mentions-shadow: var(--color-coral-alpha-coral3);
  }

  :host([status="warning"]) .ds-mentions {
    --ds-mentions-border: var(--color-amber-solid-amber6);
    --ds-mentions-hover-border: var(--color-amber-solid-amber7);
    --ds-mentions-shadow: var(--color-amber-alpha-amber3);
  }

  :host([disabled]) .ds-mentions {
    --ds-mentions-bg: var(--color-ds-subtle-surface);
    color: var(--color-ds-muted);
    cursor: not-allowed;
  }

  :host([disabled]) .ds-mentions:hover {
    border-color: var(--ds-mentions-border);
  }

  :host([disabled]) .ds-mentions__control {
    cursor: not-allowed;
  }
`;
