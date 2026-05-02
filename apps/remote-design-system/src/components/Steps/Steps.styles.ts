export const STEPS_STYLES = `
  :host {
    display: block;
    max-width: 100%;
  }

  [hidden] {
    display: none !important;
  }

  .ds-steps {
    color: var(--color-ds-text);
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    max-width: 100%;
    --ds-step-icon-size: 32px;
    --ds-step-connector-offset: calc((var(--ds-step-icon-size, 32px) / 2) + var(--ds-step-tail-gap));
    --ds-step-tail-gap: 6px;
    --ds-step-tail-size: 2px;
    --ds-step-vertical-tail-overlap: 4px;
    --ds-step-vertical-tail-visual-size: calc(var(--ds-step-icon-size) + 3px);
  }

  .ds-steps__list {
    display: flex;
    gap: 0;
    list-style: none;
    margin: 0;
    min-width: 0;
    padding: 0;
  }

  .ds-steps[data-orientation="vertical"] .ds-steps__list,
  .ds-steps[data-type="inline"] .ds-steps__list {
    flex-direction: column;
    gap: var(--spacing-ds-3);
  }

  .ds-steps__item {
    flex: 1 1 0;
    min-width: 0;
    position: relative;
  }

  .ds-steps[data-type="inline"] .ds-steps__item,
  .ds-steps[data-type="panel"] .ds-steps__item {
    flex: none;
  }

  .ds-steps[data-orientation="horizontal"][data-type="panel"] .ds-steps__item {
    flex: 1 1 0;
  }

  .ds-steps__control {
    align-items: start;
    appearance: none;
    background: transparent;
    border: 0;
    box-sizing: border-box;
    color: inherit;
    display: grid;
    font: inherit;
    gap: var(--spacing-ds-3);
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    min-width: 0;
    padding: 0 var(--spacing-ds-3);
    position: relative;
    text-align: center;
    width: 100%;
  }

  .ds-steps[data-orientation="vertical"] .ds-steps__control,
  .ds-steps[data-type="inline"] .ds-steps__control {
    grid-template-columns: auto minmax(0, 1fr);
    justify-items: start;
    padding: 0;
    text-align: left;
  }

  .ds-steps__control--clickable {
    cursor: pointer;
  }

  .ds-steps__control--clickable:hover .ds-steps__title {
    color: var(--color-ds-primary);
  }

  .ds-steps__control:focus-visible {
    border-radius: var(--radius-ds-sm);
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: var(--ds-focus-ring-offset);
  }

  .ds-steps__control:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .ds-steps__indicator {
    align-items: center;
    background: var(--ds-step-indicator-bg, var(--color-neutral-alpha-n2));
    border: var(--ds-border-width-default) solid var(--ds-step-indicator-border, transparent);
    border-radius: var(--radius-full);
    color: var(--ds-step-indicator-color, var(--color-ds-muted));
    display: inline-flex;
    font-size: var(--text-ds-1);
    font-weight: var(--font-weight-ds-strong);
    height: var(--ds-step-icon-size, 32px);
    justify-content: center;
    line-height: 1;
    position: relative;
    width: var(--ds-step-icon-size, 32px);
    z-index: 1;
  }

  .ds-steps__icon-label {
    align-items: center;
    display: inline-flex;
    height: var(--ds-icon-size-md);
    justify-content: center;
    line-height: 1;
    width: var(--ds-icon-size-md);
  }

  .ds-steps__icon-label svg {
    display: block;
    height: var(--ds-icon-size-md);
    width: var(--ds-icon-size-md);
  }

  .ds-steps__item[data-status="process"] .ds-steps__icon-label svg {
    animation: ds-steps-spin 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    transform-origin: center;
  }

  .ds-steps__content {
    align-content: center;
    display: grid;
    gap: var(--spacing-ds-1);
    min-height: var(--ds-step-icon-size, 32px);
    min-width: 0;
  }

  .ds-steps[data-orientation="horizontal"] .ds-steps__content {
    justify-items: center;
    min-height: 0;
  }

  .ds-steps__heading {
    align-items: center;
    display: flex;
    gap: var(--spacing-ds-2);
    min-width: 0;
  }

  .ds-steps__title {
    color: var(--ds-step-title-color, var(--color-ds-text));
    font-size: var(--text-ds-3);
    font-weight: var(--font-weight-ds-strong);
    line-height: var(--leading-ds-tight);
    min-width: 0;
  }

  .ds-steps__subtitle {
    color: var(--color-ds-muted);
    flex: none;
    font-size: var(--text-ds-1);
    line-height: 1;
  }

  .ds-steps__description {
    color: var(--color-ds-muted);
    font-size: var(--text-ds-2);
    line-height: var(--leading-ds-readable);
    min-width: 0;
  }

  .ds-steps__tail {
    background: var(--ds-step-tail-color, var(--color-neutral-alpha-n3));
    height: var(--ds-step-tail-size);
    left: calc(50% + var(--ds-step-connector-offset));
    position: absolute;
    right: auto;
    top: calc((var(--ds-step-icon-size, 32px) - var(--ds-step-tail-size)) / 2);
    width: calc(100% - var(--ds-step-connector-offset) - var(--ds-step-connector-offset));
    z-index: 0;
  }

  .ds-steps[data-orientation="vertical"] .ds-steps__tail,
  .ds-steps[data-type="inline"] .ds-steps__tail {
    bottom: calc(var(--spacing-ds-3) * -1);
    height: auto;
    left: calc((var(--ds-step-vertical-tail-visual-size) - var(--ds-step-tail-size)) / 2);
    right: auto;
    top: calc(var(--ds-step-icon-size) - var(--ds-step-vertical-tail-overlap) + var(--ds-step-tail-gap));
    width: var(--ds-step-tail-size);
  }

  .ds-steps__item:last-child .ds-steps__tail {
    display: none;
  }

  .ds-steps__item[data-status="finish"] {
    --ds-step-indicator-bg: var(--color-indigo-alpha-indigo1);
    --ds-step-indicator-color: var(--color-ds-primary);
    --ds-step-tail-color: var(--color-ds-primary);
  }

  .ds-steps__item[data-status="process"] {
    --ds-step-indicator-bg: var(--color-indigo-solid-indigo1);
    --ds-step-indicator-color: var(--color-ds-primary);
    --ds-step-title-color: var(--color-ds-primary);
  }

  .ds-steps__item[data-status="error"] {
    --ds-step-indicator-bg: var(--color-ds-danger);
    --ds-step-indicator-color: var(--color-neutral-static-light);
    --ds-step-title-color: var(--color-ds-danger);
  }

  .ds-steps[data-variant="outlined"] .ds-steps__indicator {
    background: var(--color-ds-surface);
    border-color: currentColor;
  }

  .ds-steps[data-variant="outlined"] .ds-steps__item[data-status="finish"],
  .ds-steps[data-variant="outlined"] .ds-steps__item[data-status="process"] {
    --ds-step-indicator-color: var(--color-ds-primary);
  }

  .ds-steps[data-variant="outlined"] .ds-steps__item[data-status="error"] {
    --ds-step-indicator-color: var(--color-ds-danger);
  }

  .ds-steps[data-size="small"] {
    --ds-step-icon-size: 24px;
    font-size: var(--text-ds-1);
  }

  .ds-steps[data-size="small"] .ds-steps__title {
    font-size: var(--text-ds-2);
  }

  .ds-steps[data-title-placement="vertical"][data-orientation="horizontal"] .ds-steps__control,
  .ds-steps[data-type="dot"] .ds-steps__control {
    padding-inline: var(--spacing-ds-3);
  }

  .ds-steps[data-title-placement="vertical"][data-orientation="horizontal"] .ds-steps__heading,
  .ds-steps[data-type="dot"] .ds-steps__heading {
    justify-content: center;
  }

  .ds-steps[data-type="dot"] .ds-steps__indicator {
    height: var(--ds-step-dot-size, 8px);
    width: var(--ds-step-dot-size, 8px);
  }

  .ds-steps[data-type="dot"] .ds-steps__item[data-status="process"] .ds-steps__indicator {
    --ds-step-dot-size: 10px;
  }

  .ds-steps[data-type="dot"] .ds-steps__icon-label {
    display: none;
  }

  .ds-steps[data-type="dot"] .ds-steps__tail {
    left: calc(50% + (var(--ds-step-dot-size, 8px) / 2) + var(--ds-step-tail-gap));
    top: calc((var(--ds-step-dot-size, 8px) - var(--ds-step-tail-size)) / 2);
    width: calc(100% - var(--ds-step-dot-size, 8px) - var(--ds-step-tail-gap) - var(--ds-step-tail-gap));
  }

  .ds-steps[data-title-placement="vertical"] {
    --ds-step-connector-offset: calc((var(--ds-step-icon-size, 32px) / 2) + 3px + var(--ds-step-tail-gap));
  }

  .ds-steps[data-type="navigation"] .ds-steps__item {
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    background: var(--color-ds-surface);
  }

  .ds-steps[data-type="navigation"] .ds-steps__list {
    gap: var(--spacing-ds-2);
  }

  .ds-steps[data-type="navigation"] .ds-steps__control {
    padding: var(--spacing-ds-3);
  }

  .ds-steps[data-type="navigation"] .ds-steps__tail,
  .ds-steps[data-type="panel"] .ds-steps__tail,
  .ds-steps[data-type="inline"] .ds-steps__description {
    display: none;
  }

  .ds-steps[data-type="panel"] {
    --ds-step-panel-arrow-size: 42px;
    --ds-step-panel-bg: var(--color-neutral-alpha-n2);
    --ds-step-panel-border: transparent;
    --ds-step-panel-active-bg: var(--color-ds-primary);
    --ds-step-panel-active-border: transparent;
    --ds-step-panel-active-text: var(--color-neutral-static-light);
    --ds-step-panel-text: var(--color-ds-text);
    --ds-step-panel-muted-text: var(--color-ds-muted);
  }

  .ds-steps[data-type="panel"] .ds-steps__list {
    align-items: stretch;
    gap: 0;
  }

  .ds-steps[data-type="panel"] .ds-steps__item {
    background: var(--ds-step-panel-bg);
    border-block: 2px solid var(--ds-step-panel-border);
    color: var(--ds-step-panel-text);
    min-height: 88px;
    padding: var(--spacing-ds-4);
    position: relative;
    transition:
      background-color 160ms ease,
      border-color 160ms ease,
      color 160ms ease;
  }

  .ds-steps[data-type="panel"] .ds-steps__item:not(:first-child) {
    padding-inline-start: calc(var(--spacing-ds-4) + var(--ds-step-panel-arrow-size));
  }

  .ds-steps[data-type="panel"][data-variant="filled"] .ds-steps__item:not(:first-child) {
    clip-path: polygon(
      2px 0,
      calc(100% + var(--ds-step-panel-arrow-size)) 0,
      calc(100% + var(--ds-step-panel-arrow-size)) 100%,
      2px 100%,
      calc(var(--ds-step-panel-arrow-size) + 2px) 50%
    );
  }

  .ds-steps[data-type="panel"] .ds-steps__item:first-child {
    border-inline-start: 2px solid var(--ds-step-panel-border);
    border-end-start-radius: var(--radius-ds-sm);
    border-start-start-radius: var(--radius-ds-sm);
  }

  .ds-steps[data-type="panel"] .ds-steps__item:last-child {
    border-end-end-radius: var(--radius-ds-sm);
    border-inline-end: 2px solid var(--ds-step-panel-border);
    border-start-end-radius: var(--radius-ds-sm);
  }

  .ds-steps[data-type="panel"] .ds-steps__panel-arrow {
    height: calc(100% + 4px);
    inset-block-start: -2px;
    inset-inline-start: 100%;
    overflow: visible;
    position: absolute;
    width: var(--ds-step-panel-arrow-size);
    z-index: 2;
  }

  .ds-steps[data-type="panel"][data-variant="outlined"] {
    --ds-step-panel-bg: var(--color-ds-surface);
    --ds-step-panel-border: var(--color-ds-border);
    --ds-step-panel-active-bg: var(--color-indigo-alpha-indigo1);
    --ds-step-panel-active-border: var(--color-ds-primary);
    --ds-step-panel-active-text: var(--color-ds-text);
  }

  .ds-steps[data-type="panel"][data-variant="outlined"] .ds-steps__panel-arrow {
    height: calc(100% + 2px);
    inset-block-start: -1px;
  }

  .ds-steps[data-type="panel"] .ds-steps__panel-arrow path {
    fill: var(--ds-step-panel-bg);
    stroke: var(--ds-step-panel-border);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
    transition:
      fill 160ms ease,
      stroke 160ms ease;
    vector-effect: non-scaling-stroke;
  }

  .ds-steps[data-type="panel"] .ds-steps__item:last-child .ds-steps__panel-arrow {
    display: none;
  }

  .ds-steps[data-type="panel"] .ds-steps__item[data-status="process"] {
    --ds-step-panel-bg: var(--ds-step-panel-active-bg);
    --ds-step-panel-border: var(--ds-step-panel-active-border);
    --ds-step-title-color: var(--ds-step-panel-active-text);
    color: var(--ds-step-panel-active-text);
  }

  .ds-steps[data-type="panel"] .ds-steps__item[data-status="finish"] {
    --ds-step-panel-bg: var(--color-indigo-alpha-indigo1);
    --ds-step-panel-border: transparent;
    --ds-step-panel-text: var(--color-ds-text);
  }

  .ds-steps[data-type="panel"] .ds-steps__item[data-status="error"] {
    --ds-step-panel-bg: var(--color-coral-alpha-coral1);
    --ds-step-panel-border: transparent;
    --ds-step-panel-text: var(--color-ds-danger);
  }

  .ds-steps[data-type="panel"][data-variant="outlined"] .ds-steps__item[data-status="finish"] {
    --ds-step-panel-bg: var(--color-ds-surface);
    --ds-step-panel-border: var(--color-ds-primary);
  }

  .ds-steps[data-type="panel"][data-variant="outlined"] .ds-steps__item[data-status="error"] {
    --ds-step-panel-bg: var(--color-ds-surface);
    --ds-step-panel-border: var(--color-ds-danger);
  }

  .ds-steps[data-type="panel"] .ds-steps__control {
    align-content: center;
    display: grid;
    height: 100%;
    justify-items: start;
    padding: 0;
    text-align: left;
  }

  .ds-steps[data-type="panel"] .ds-steps__indicator {
    display: none;
  }

  .ds-steps[data-type="panel"] .ds-steps__content {
    min-height: 0;
  }

  .ds-steps[data-type="panel"] .ds-steps__heading {
    flex-wrap: wrap;
  }

  .ds-steps[data-type="panel"] .ds-steps__description,
  .ds-steps[data-type="panel"] .ds-steps__subtitle {
    color: currentColor;
    opacity: 0.68;
  }

  .ds-steps[data-type="panel"] .ds-steps__control--clickable:hover .ds-steps__title {
    color: var(--ds-step-title-color, var(--color-ds-primary));
  }

  .ds-steps[data-size="small"][data-type="panel"] {
    --ds-step-panel-arrow-size: 34px;
  }

  .ds-steps[data-size="small"][data-type="panel"] .ds-steps__item {
    min-height: 72px;
    padding: var(--spacing-ds-3);
  }

  .ds-steps[data-size="small"][data-type="panel"] .ds-steps__item:not(:first-child) {
    padding-inline-start: calc(var(--spacing-ds-3) + var(--ds-step-panel-arrow-size));
  }

  .ds-steps__progress {
    background: conic-gradient(var(--color-ds-primary) var(--ds-step-progress), var(--color-indigo-solid-indigo2) 0);
    border-radius: var(--radius-full);
    inset: -3px;
    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0);
    mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0);
    position: absolute;
    z-index: -1;
  }

  @keyframes ds-steps-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
