export const RESULT_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: block;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-readable);
    text-align: center;
  }

  :host([hidden]) {
    display: none;
  }

  .ds-result {
    align-items: center;
    display: grid;
    gap: var(--spacing-ds-4);
    justify-items: center;
    margin-inline: auto;
    max-width: 520px;
    padding: var(--spacing-ds-8) var(--spacing-ds-5);
  }

  .ds-result__icon {
    --ds-result-icon-color: var(--color-ds-primary);
    align-items: center;
    background: var(--color-neutral-alpha-n1, rgba(0, 0, 0, 0.03));
    border-radius: 999px;
    color: var(--ds-result-icon-color);
    display: inline-flex;
    height: 72px;
    justify-content: center;
    width: 72px;
  }

  .ds-result[data-status="success"] .ds-result__icon {
    --ds-result-icon-color: var(--color-ds-success, #389e0d);
  }

  .ds-result[data-status="warning"] .ds-result__icon {
    --ds-result-icon-color: var(--color-ds-warning, #d48806);
  }

  .ds-result[data-status="error"],
  .ds-result[data-status="403"],
  .ds-result[data-status="404"],
  .ds-result[data-status="500"] {
    --ds-result-icon-color: var(--color-ds-danger);
  }

  .ds-result__icon svg {
    height: 42px;
    stroke: currentColor;
    width: 42px;
  }

  .ds-result__status-code {
    font-size: 28px;
    font-weight: var(--font-weight-ds-emphasis);
    letter-spacing: 0;
  }

  .ds-result__copy {
    display: grid;
    gap: var(--spacing-ds-2);
  }

  .ds-result__title {
    font-size: var(--text-ds-5);
    font-weight: var(--font-weight-ds-strong);
    line-height: var(--leading-ds-tight);
    margin: 0;
    overflow-wrap: anywhere;
  }

  .ds-result__subtitle {
    color: var(--color-ds-muted);
    margin: 0;
    overflow-wrap: anywhere;
  }

  .ds-result__extra {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-ds-2);
    justify-content: center;
  }

  .ds-result__extra:empty {
    display: none;
  }
`;
