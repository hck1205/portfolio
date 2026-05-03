export const CAROUSEL_STYLES = `
  :host {
    display: block;
    font-family: var(--font-sans);
    max-width: 100%;
  }

  :host([hidden]) {
    display: none;
  }

  .ds-carousel {
    display: grid;
    gap: var(--spacing-ds-3);
    max-width: 100%;
    position: relative;
  }

  .ds-carousel__viewport {
    border-radius: var(--radius-ds-sm);
    overflow: hidden;
    position: relative;
    touch-action: pan-y;
  }

  :host([data-axis="vertical"]) .ds-carousel__viewport {
    block-size: var(--ds-carousel-viewport-height, 220px);
    touch-action: pan-x;
  }

  .ds-carousel__track {
    display: flex;
    transform: translateX(calc(var(--ds-carousel-index, 0) * -100%));
    transition: transform 500ms ease;
    will-change: transform;
  }

  :host([data-axis="vertical"]) .ds-carousel__track {
    block-size: 100%;
    flex-direction: column;
    transform: translateY(calc(var(--ds-carousel-index, 0) * -100%));
  }

  .ds-carousel__track[data-instant] {
    transition: none;
  }

  :host([effect="fade"]) .ds-carousel__track {
    display: grid;
    transform: none;
  }

  ::slotted(*) {
    box-sizing: border-box;
    flex: 0 0 100%;
    min-width: 100%;
  }

  :host([data-axis="vertical"]) ::slotted(*) {
    flex-basis: 100%;
    min-height: 100%;
    min-width: 0;
    width: 100%;
  }

  :host([effect="fade"]) ::slotted(*) {
    grid-area: 1 / 1;
    opacity: 0;
    transition: opacity 500ms ease;
  }

  :host([effect="fade"]) ::slotted([data-active="true"]) {
    opacity: 1;
    z-index: 1;
  }

  .ds-carousel__arrow {
    align-items: center;
    appearance: none;
    background: rgba(0, 0, 0, 0.32);
    border: 0;
    border-radius: var(--radius-full);
    color: var(--color-white, #fff);
    cursor: pointer;
    display: inline-flex;
    height: 32px;
    justify-content: center;
    padding: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    z-index: 2;
  }

  .ds-carousel__arrow:hover {
    background: rgba(0, 0, 0, 0.48);
  }

  .ds-carousel__arrow[data-direction="prev"] {
    left: var(--spacing-ds-2);
  }

  .ds-carousel__arrow[data-direction="next"] {
    right: var(--spacing-ds-2);
  }

  :host([data-axis="vertical"]) .ds-carousel__arrow {
    left: 50%;
    top: auto;
    transform: translateX(-50%);
  }

  :host([data-axis="vertical"]) .ds-carousel__arrow[data-direction="prev"] {
    top: var(--spacing-ds-2);
  }

  :host([data-axis="vertical"]) .ds-carousel__arrow[data-direction="next"] {
    bottom: var(--spacing-ds-2);
    right: auto;
  }

  .ds-carousel__arrow[hidden] {
    display: none;
  }

  .ds-carousel__dots {
    align-items: center;
    display: flex;
    gap: var(--spacing-ds-1);
    justify-content: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .ds-carousel__dots[hidden] {
    display: none;
  }

  :host([dot-placement="top"]) .ds-carousel__dots {
    order: -1;
  }

  :host([dot-placement="start"]) .ds-carousel,
  :host([dot-placement="end"]) .ds-carousel {
    align-items: center;
    grid-template-columns: auto minmax(0, 1fr);
  }

  :host([dot-placement="end"]) .ds-carousel {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  :host([dot-placement="start"]) .ds-carousel__dots,
  :host([dot-placement="end"]) .ds-carousel__dots {
    flex-direction: column;
  }

  :host([dot-placement="start"]) .ds-carousel__dot,
  :host([dot-placement="end"]) .ds-carousel__dot {
    height: 16px;
    width: 3px;
  }

  :host([dot-placement="start"]) .ds-carousel__dot[data-active="true"],
  :host([dot-placement="end"]) .ds-carousel__dot[data-active="true"] {
    height: 24px;
    width: 3px;
  }

  :host([dot-placement="start"]) .ds-carousel__dots {
    order: -1;
  }

  .ds-carousel__dot {
    appearance: none;
    background: var(--color-neutral-alpha-n5);
    border: 0;
    border-radius: var(--radius-full);
    cursor: pointer;
    height: 3px;
    padding: 0;
    transition:
      background 150ms ease,
      height 150ms ease,
      width 150ms ease;
    width: 16px;
  }

  .ds-carousel__dot[data-active="true"] {
    background: var(--color-ds-primary);
    width: 24px;
  }
`;

let carouselStyleSheet: CSSStyleSheet | undefined;

export function applyCarouselStyles(shadowRoot: ShadowRoot) {
  if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
    carouselStyleSheet ??= new CSSStyleSheet();
    carouselStyleSheet.replaceSync(CAROUSEL_STYLES);
    shadowRoot.adoptedStyleSheets = [carouselStyleSheet];
    return;
  }

  const style = document.createElement("style");

  style.textContent = CAROUSEL_STYLES;
  shadowRoot.append(style);
}
