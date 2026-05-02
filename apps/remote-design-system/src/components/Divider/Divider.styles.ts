export const DIVIDER_STYLES = `
  :host {
    --ds-divider-border-color: var(--color-ds-border);
    --ds-divider-border-style: solid;
    --ds-divider-border-width: var(--ds-border-width-default);
    --ds-divider-content-padding: 1em;
    --ds-divider-margin-block: var(--spacing-ds-6);
    --ds-divider-margin-inline: var(--spacing-ds-3);
    --ds-divider-title-margin: 5%;
    display: block;
  }

  [hidden] {
    display: none !important;
  }

  .ds-divider {
    align-items: center;
    border: 0;
    color: var(--color-ds-muted);
    display: flex;
    font-family: var(--font-sans);
    font-size: var(--text-ds-3);
    line-height: var(--leading-ds-readable);
    margin: var(--ds-divider-margin-block) 0;
    min-width: 0;
    padding: 0;
    white-space: nowrap;
    width: 100%;
  }

  .ds-divider::before,
  .ds-divider::after {
    border-block-start: var(--ds-divider-border-width) var(--ds-divider-border-style) var(--ds-divider-border-color);
    content: "";
    flex: 1 1 auto;
    min-width: 0;
  }

  :host([data-empty]) .ds-divider::before,
  :host([data-empty]) .ds-divider::after {
    content: none;
  }

  :host([data-empty]) .ds-divider {
    border-block-start: var(--ds-divider-border-width) var(--ds-divider-border-style) var(--ds-divider-border-color);
  }

  .ds-divider__content {
    display: inline-flex;
    min-width: 0;
    padding-inline: var(--ds-divider-content-padding);
  }

  :host([plain]) .ds-divider__content {
    color: var(--color-ds-text);
    font-weight: 400;
  }

  :host(:not([plain])) .ds-divider__content {
    font-weight: var(--ds-font-weight-strong);
  }

  :host([data-title-placement="start"]) .ds-divider::before {
    flex: 0 0 var(--ds-divider-title-margin);
  }

  :host([data-title-placement="start"]) .ds-divider::after {
    flex: 1 1 auto;
  }

  :host([data-title-placement="end"]) .ds-divider::before {
    flex: 1 1 auto;
  }

  :host([data-title-placement="end"]) .ds-divider::after {
    flex: 0 0 var(--ds-divider-title-margin);
  }

  :host([data-size="small"]) {
    --ds-divider-margin-block: var(--spacing-ds-4);
  }

  :host([data-size="large"]) {
    --ds-divider-margin-block: var(--spacing-ds-8);
  }

  :host([data-variant="dashed"]) {
    --ds-divider-border-style: dashed;
  }

  :host([data-variant="dotted"]) {
    --ds-divider-border-style: dotted;
  }

  :host([data-orientation="vertical"]) {
    display: inline-block;
    vertical-align: middle;
  }

  :host([data-orientation="vertical"]) .ds-divider {
    align-self: stretch;
    border-inline-start: var(--ds-divider-border-width) var(--ds-divider-border-style) var(--ds-divider-border-color);
    display: inline-block;
    height: 0.9em;
    margin: 0 var(--ds-divider-margin-inline);
    min-height: var(--spacing-ds-4);
    width: 0;
  }

  :host([data-orientation="vertical"]) .ds-divider::before,
  :host([data-orientation="vertical"]) .ds-divider::after,
  :host([data-orientation="vertical"]) .ds-divider__content {
    display: none;
  }
`;
