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
    max-width: 360px;
    min-width: 0;
    padding: var(--spacing-ds-6) var(--spacing-ds-4);
  }

  :host([size="small"]) .ds-empty {
    max-width: 260px;
    padding: var(--spacing-ds-4) var(--spacing-ds-3);
  }

  .ds-empty__image {
    align-items: center;
    display: inline-flex;
    height: 112px;
    justify-content: center;
    margin-bottom: var(--spacing-ds-4);
    width: 160px;
  }

  :host([size="small"]) .ds-empty__image {
    height: 72px;
    margin-bottom: var(--spacing-ds-3);
    width: 112px;
  }

  .ds-empty__image img,
  .ds-empty__image svg {
    display: block;
    height: 100%;
    max-width: 100%;
    object-fit: contain;
    width: 100%;
  }

  .ds-empty__description {
    color: var(--color-ds-text-secondary);
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
