export const SLIDER_STYLES = `
  :host {
    display: inline-block;
    max-width: 100%;
    vertical-align: middle;
  }

  :host([vertical]) {
    height: 180px;
  }

  .ds-slider {
    --ds-slider-handle-size: 14px;
    --ds-slider-rail-size: 4px;
    --ds-slider-tooltip-offset: 22px;
    box-sizing: border-box;
    color: var(--color-ds-text);
    font-family: var(--font-sans);
    min-width: 180px;
    padding: var(--spacing-ds-3) calc(var(--ds-slider-handle-size) / 2);
    position: relative;
    touch-action: none;
    width: 100%;
  }

  .ds-slider[data-vertical="true"] {
    height: 100%;
    min-height: 160px;
    min-width: 42px;
    padding: calc(var(--ds-slider-handle-size) / 2) var(--spacing-ds-4);
    width: 42px;
  }

  .ds-slider__rail {
    background: var(--color-neutral-alpha-n3);
    border-radius: var(--radius-full);
    cursor: pointer;
    height: var(--ds-slider-rail-size);
    position: relative;
    transition: background-color 150ms ease-in-out;
    width: 100%;
  }

  .ds-slider__rail:hover {
    background: var(--color-neutral-alpha-n4);
  }

  .ds-slider[data-vertical="true"] .ds-slider__rail {
    height: 100%;
    width: var(--ds-slider-rail-size);
  }

  .ds-slider__track {
    background: var(--color-ds-primary);
    border-radius: inherit;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transition: background-color 150ms ease-in-out;
  }

  .ds-slider[data-vertical="true"] .ds-slider__track {
    bottom: 0;
    height: auto;
    left: 0;
    top: auto;
    width: 100%;
  }

  .ds-slider__thumb {
    align-items: center;
    appearance: none;
    background: var(--color-ds-surface);
    border: 2px solid var(--color-ds-primary);
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-1dp);
    box-sizing: border-box;
    cursor: grab;
    display: inline-flex;
    height: var(--ds-slider-handle-size);
    justify-content: center;
    margin: 0;
    padding: 0;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    transition:
      border-color 150ms ease-in-out,
      box-shadow 150ms ease-in-out,
      transform 150ms ease-in-out;
    width: var(--ds-slider-handle-size);
    z-index: 2;
  }

  .ds-slider[data-vertical="true"] .ds-slider__thumb {
    left: 50%;
    top: auto;
    transform: translate(-50%, 50%);
  }

  .ds-slider__thumb:hover,
  .ds-slider__thumb:focus-visible {
    border-color: var(--color-ds-primary-hover);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-ds-primary) 18%, transparent);
    outline: 0;
  }

  .ds-slider__thumb:active {
    cursor: grabbing;
    transform: translate(-50%, -50%) scale(1.08);
  }

  .ds-slider[data-vertical="true"] .ds-slider__thumb:active {
    transform: translate(-50%, 50%) scale(1.08);
  }

  .ds-slider__thumb[hidden] {
    display: none;
  }

  .ds-slider__thumb::after {
    background: var(--color-ds-surface);
    border-radius: inherit;
    content: "";
    height: 4px;
    width: 4px;
  }

  .ds-slider__thumb::before {
    background: var(--color-neutral-solid-n12);
    border-radius: var(--radius-ds-sm);
    color: var(--color-neutral-solid-n1);
    content: attr(data-tooltip);
    font-size: var(--text-ds-1);
    font-weight: var(--font-weight-ds-medium);
    left: 50%;
    line-height: var(--leading-ds-tight);
    opacity: 0;
    padding: var(--spacing-ds-1) var(--spacing-ds-2);
    pointer-events: none;
    position: absolute;
    top: calc(var(--ds-slider-tooltip-offset) * -1);
    transform: translateX(-50%);
    transition: opacity 120ms ease-in-out;
    white-space: nowrap;
  }

  .ds-slider[data-vertical="true"] .ds-slider__thumb::before {
    left: calc(100% + var(--spacing-ds-2));
    top: 50%;
    transform: translateY(-50%);
  }

  .ds-slider[data-tooltip="open"] .ds-slider__thumb::before,
  .ds-slider[data-tooltip="auto"] .ds-slider__thumb:hover::before,
  .ds-slider[data-tooltip="auto"] .ds-slider__thumb:focus-visible::before {
    opacity: 1;
  }

  .ds-slider[data-tooltip="closed"] .ds-slider__thumb::before {
    display: none;
  }

  .ds-slider__marks {
    inset: 0 calc(var(--ds-slider-handle-size) / 2);
    pointer-events: none;
    position: absolute;
  }

  .ds-slider[data-vertical="true"] .ds-slider__marks {
    inset: calc(var(--ds-slider-handle-size) / 2) 0;
  }

  .ds-slider__mark {
    color: var(--color-ds-muted);
    font-size: var(--text-ds-1);
    line-height: var(--leading-ds-normal);
    position: absolute;
    top: calc(50% + var(--spacing-ds-4));
    transform: translateX(-50%);
    white-space: nowrap;
  }

  .ds-slider[data-vertical="true"] .ds-slider__mark {
    left: calc(50% + var(--spacing-ds-4));
    top: auto;
    transform: translateY(50%);
  }

  .ds-slider__mark::before {
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-neutral-alpha-n5);
    border-radius: var(--radius-full);
    content: "";
    height: 8px;
    left: 50%;
    position: absolute;
    top: calc((var(--spacing-ds-4) + 8px) * -1);
    transform: translateX(-50%);
    width: 8px;
  }

  .ds-slider[data-vertical="true"] .ds-slider__mark::before {
    left: calc((var(--spacing-ds-4) + 8px) * -1);
    top: 50%;
    transform: translateY(-50%);
  }

  :host([disabled]) .ds-slider {
    color: var(--color-ds-muted);
  }

  :host([disabled]) .ds-slider__rail {
    background: var(--color-neutral-alpha-n3);
    cursor: not-allowed;
  }

  :host([disabled]) .ds-slider__track {
    background: var(--color-neutral-alpha-n5);
  }

  :host([disabled]) .ds-slider__thumb {
    border-color: var(--color-neutral-alpha-n6);
    box-shadow: none;
    cursor: not-allowed;
  }
`;

let sliderStyleSheet: CSSStyleSheet | undefined;

export function applySliderStyles(shadowRoot: ShadowRoot) {
  if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
    sliderStyleSheet ??= new CSSStyleSheet();
    sliderStyleSheet.replaceSync(SLIDER_STYLES);
    shadowRoot.adoptedStyleSheets = [sliderStyleSheet];
    return;
  }

  const style = document.createElement("style");

  style.textContent = SLIDER_STYLES;
  shadowRoot.append(style);
}
