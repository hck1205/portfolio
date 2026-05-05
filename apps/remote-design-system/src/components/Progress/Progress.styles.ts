export const PROGRESS_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: inline-block;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-tight);
    min-width: 180px;
  }

  :host([hidden]) {
    display: none;
  }

  .ds-progress {
    --ds-progress-color: var(--color-ds-primary);
    --ds-progress-track: var(--color-neutral-alpha-n2, rgba(0, 0, 0, 0.06));
    align-items: center;
    display: inline-grid;
    gap: var(--spacing-ds-2);
    width: 100%;
  }

  .ds-progress[data-status="success"] {
    --ds-progress-color: var(--color-ds-success, #389e0d);
  }

  .ds-progress[data-status="exception"] {
    --ds-progress-color: var(--color-ds-danger);
  }

  .ds-progress[data-size="small"] {
    font-size: var(--text-ds-1);
  }

  .ds-progress[data-type="line"] {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .ds-progress__track {
    background: var(--ds-progress-track);
    border-radius: 999px;
    height: 8px;
    overflow: hidden;
  }

  .ds-progress[data-size="small"] .ds-progress__track {
    height: 4px;
  }

  .ds-progress[data-size="large"] .ds-progress__track {
    height: 12px;
  }

  .ds-progress__bar {
    background: var(--ds-progress-color);
    border-radius: inherit;
    height: 100%;
    transition: width 200ms ease;
  }

  .ds-progress[data-status="active"] .ds-progress__bar {
    background: linear-gradient(90deg, var(--color-ds-primary), var(--color-ds-primary-hover));
  }

  .ds-progress__info {
    color: var(--color-ds-muted);
    font-variant-numeric: tabular-nums;
    min-width: 3ch;
  }

  .ds-progress__circle {
    --ds-progress-size: 96px;
    display: none;
    height: var(--ds-progress-size);
    place-items: center;
    position: relative;
    width: var(--ds-progress-size);
  }

  .ds-progress[data-type="circle"] {
    min-width: 0;
  }

  .ds-progress[data-type="circle"] .ds-progress__track {
    display: none;
  }

  .ds-progress[data-type="circle"] .ds-progress__circle {
    display: grid;
  }

  .ds-progress[data-type="circle"] .ds-progress__info {
    color: var(--color-ds-text);
    font-weight: var(--font-weight-ds-strong);
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .ds-progress__circle svg {
    display: block;
    height: 100%;
    transform: rotate(-90deg);
    width: 100%;
  }

  .ds-progress__circle-track,
  .ds-progress__circle-bar {
    fill: none;
    stroke-width: 8;
  }

  .ds-progress__circle-track {
    stroke: var(--ds-progress-track);
  }

  .ds-progress__circle-bar {
    stroke: var(--ds-progress-color);
    stroke-linecap: round;
    transition: stroke-dashoffset 200ms ease;
  }

  .ds-progress__steps {
    display: none;
    gap: var(--spacing-ds-1);
  }

  .ds-progress[data-type="steps"] .ds-progress__track,
  .ds-progress[data-type="steps"] .ds-progress__circle {
    display: none;
  }

  .ds-progress[data-type="steps"] .ds-progress__steps {
    display: flex;
  }

  .ds-progress__step {
    background: var(--ds-progress-track);
    border-radius: var(--radius-ds-sm);
    height: 8px;
    width: 24px;
  }

  .ds-progress__step[data-active="true"] {
    background: var(--ds-progress-color);
  }
`;
