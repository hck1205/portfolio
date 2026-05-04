export const EMPTY_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: block;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-normal);
    text-align: center;
  }

  :host([hidden]) {
    display: none;
  }

  :host([size="small"]) {
    font-size: var(--text-ds-1);
  }

  .ds-empty {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-inline: auto;
    max-width: 320px;
    min-width: 0;
    padding: var(--spacing-ds-5) var(--spacing-ds-4);
  }

  :host([size="large"]) .ds-empty {
    max-width: 360px;
    padding: var(--spacing-ds-6) var(--spacing-ds-4);
  }

  :host([size="small"]) .ds-empty {
    max-width: 260px;
    padding: var(--spacing-ds-4) var(--spacing-ds-3);
  }

  .ds-empty__image {
    align-items: center;
    color: var(--color-ds-muted);
    display: inline-flex;
    height: 72px;
    justify-content: center;
    margin-bottom: var(--spacing-ds-4);
    overflow: visible;
    width: 104px;
  }

  :host([size="large"]) .ds-empty__image {
    height: 88px;
    width: 124px;
  }

  :host([size="small"]) .ds-empty__image {
    height: 56px;
    margin-bottom: var(--spacing-ds-3);
    width: 80px;
  }

  .ds-empty__image > img,
  .ds-empty__image > svg {
    display: block;
    height: 100%;
    max-width: 100%;
    object-fit: contain;
    width: 100%;
  }

  .ds-empty__image > svg,
  .ds-empty__icon {
    overflow: visible;
  }

  .ds-empty__illustration {
    align-items: center;
    background:
      linear-gradient(180deg, var(--color-neutral-alpha-n2, rgba(0, 0, 0, 0.05)), var(--color-ds-surface)),
      var(--color-ds-surface);
    border: 1px solid var(--color-ds-border);
    border-radius: 999px;
    box-shadow:
      0 14px 36px rgba(24, 39, 75, 0.08),
      inset 0 -10px 22px rgba(24, 39, 75, 0.05);
    box-sizing: border-box;
    color: var(--color-ds-muted);
    display: inline-flex;
    height: 60px;
    justify-content: center;
    position: relative;
    width: 60px;
  }

  :host([size="large"]) .ds-empty__illustration {
    height: 72px;
    width: 72px;
  }

  :host([size="small"]) .ds-empty__illustration {
    height: 48px;
    width: 48px;
  }

  .ds-empty__icon {
    color: currentColor;
    height: 42px;
    position: relative;
    stroke: currentColor;
    width: 42px;
    z-index: 1;
  }

  :host([size="large"]) .ds-empty__icon {
    height: 50px;
    width: 50px;
  }

  :host([size="small"]) .ds-empty__icon {
    height: 34px;
    width: 34px;
  }

  .ds-empty__illustration[data-variant="simple"] {
    background:
      linear-gradient(180deg, var(--color-neutral-alpha-n2, rgba(0, 0, 0, 0.05)), var(--color-ds-surface)),
      var(--color-ds-surface);
    border-color: var(--color-ds-border);
    box-shadow: inset 0 -8px 18px rgba(24, 39, 75, 0.05);
    color: var(--color-ds-muted);
    height: 44px;
    width: 44px;
  }

  :host([size="large"]) .ds-empty__illustration[data-variant="simple"] {
    height: 52px;
    width: 52px;
  }

  :host([size="small"]) .ds-empty__illustration[data-variant="simple"] {
    height: 36px;
    width: 36px;
  }

  .ds-empty__illustration[data-variant="simple"] .ds-empty__icon {
    height: 32px;
    width: 32px;
  }

  :host([size="large"]) .ds-empty__illustration[data-variant="simple"] .ds-empty__icon {
    height: 38px;
    width: 38px;
  }

  :host([size="small"]) .ds-empty__illustration[data-variant="simple"] .ds-empty__icon {
    height: 26px;
    width: 26px;
  }

  .ds-empty__description {
    color: var(--color-ds-muted);
    margin: 0;
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .ds-empty__description[hidden] {
    display: none;
  }

  .ds-empty__footer {
    align-items: center;
    display: inline-flex;
    gap: var(--spacing-ds-2);
    justify-content: center;
    margin-top: var(--spacing-ds-4);
  }

  .ds-empty__footer:empty {
    display: none;
  }
`;
