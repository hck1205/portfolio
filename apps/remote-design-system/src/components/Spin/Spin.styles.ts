export const SPIN_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: inline-block;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-readable);
  }

  :host([hidden]) {
    display: none;
  }

  :host([fullscreen=""]),
  :host([fullscreen="true"]) {
    inset: 0;
    position: fixed;
    z-index: var(--z-index-ds-spin, 1200);
  }

  .ds-spin {
    align-items: center;
    display: inline-grid;
    gap: var(--spacing-ds-2);
    justify-items: center;
  }

  :host([fullscreen=""]) .ds-spin,
  :host([fullscreen="true"]) .ds-spin {
    background: rgba(255, 255, 255, 0.72);
    height: 100%;
    place-content: center;
    width: 100%;
  }

  .ds-spin[hidden] {
    display: none;
  }

  .ds-spin__indicator {
    animation: ds-spin-rotate 800ms linear infinite;
    border: 2px solid var(--color-neutral-alpha-n3, rgba(0, 0, 0, 0.1));
    border-radius: 999px;
    border-top-color: var(--color-ds-primary);
    box-sizing: border-box;
    height: 28px;
    width: 28px;
  }

  .ds-spin[data-size="small"] .ds-spin__indicator {
    height: 18px;
    width: 18px;
  }

  .ds-spin[data-size="large"] .ds-spin__indicator {
    border-width: 3px;
    height: 42px;
    width: 42px;
  }

  .ds-spin__tip {
    color: var(--color-ds-muted);
    margin: 0;
  }

  .ds-spin__tip[hidden] {
    display: none;
  }

  @keyframes ds-spin-rotate {
    to {
      transform: rotate(360deg);
    }
  }
`;
