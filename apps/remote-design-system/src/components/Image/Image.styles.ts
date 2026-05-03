export const IMAGE_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: inline-block;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
    line-height: 1;
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none;
  }

  .ds-image {
    display: inline-block;
    max-width: 100%;
    position: relative;
  }

  .ds-image__figure {
    background: var(--color-neutral-alpha-n2);
    border-radius: var(--radius-ds-2);
    display: block;
    line-height: 0;
    margin: 0;
    max-width: 100%;
    overflow: hidden;
    position: relative;
  }

  .ds-image__img {
    display: block;
    height: var(--ds-image-height, auto);
    max-width: 100%;
    object-fit: cover;
    opacity: 1;
    transition: opacity 160ms ease-in-out;
    width: var(--ds-image-width, auto);
  }

  .ds-image__img[data-loading="true"] {
    opacity: 0;
  }

  .ds-image__placeholder {
    align-items: center;
    background:
      linear-gradient(90deg, transparent, var(--color-neutral-alpha-n3), transparent),
      var(--color-neutral-alpha-n2);
    background-size: 180% 100%;
    display: none;
    inset: 0;
    justify-content: center;
    position: absolute;
  }

  .ds-image__placeholder[data-visible="true"] {
    animation: ds-image-shimmer 1.2s linear infinite;
    display: flex;
  }

  .ds-image__mask {
    align-items: center;
    background: rgba(0, 0, 0, 0.46);
    border: 0;
    color: #fff;
    cursor: zoom-in;
    display: inline-flex;
    font: inherit;
    gap: var(--spacing-ds-2);
    inset: 0;
    justify-content: center;
    opacity: 0;
    padding: var(--spacing-ds-3);
    position: absolute;
    transition: opacity 160ms ease-in-out;
  }

  .ds-image__figure:hover .ds-image__mask,
  .ds-image__mask:focus-visible {
    opacity: 1;
  }

  .ds-image__mask:focus-visible {
    outline: var(--ds-focus-ring-width) solid var(--color-ds-primary);
    outline-offset: calc(var(--ds-focus-ring-offset) * -1);
  }

  .ds-image__mask[hidden] {
    display: none;
  }

  .ds-image__fallback {
    align-items: center;
    background: var(--color-neutral-alpha-n2);
    color: var(--color-ds-text-secondary);
    display: none;
    inset: 0;
    justify-content: center;
    padding: var(--spacing-ds-4);
    position: absolute;
    text-align: center;
  }

  .ds-image__fallback[data-visible="true"] {
    display: flex;
  }

  .ds-image__preview {
    align-items: center;
    background: rgba(0, 0, 0, 0.86);
    display: none;
    inset: 0;
    justify-content: center;
    padding: 72px var(--spacing-ds-6);
    position: fixed;
    z-index: var(--z-index-ds-modal, 1080);
  }

  .ds-image__preview[data-open="true"] {
    display: flex;
  }

  .ds-image__preview-img {
    max-height: calc(100vh - 160px);
    max-width: calc(100vw - 64px);
    object-fit: contain;
    transform: scale(var(--ds-image-preview-scale, 1)) rotate(var(--ds-image-preview-rotate, 0deg));
    transition: transform 160ms ease-in-out;
    user-select: none;
  }

  .ds-image__toolbar {
    align-items: center;
    background: rgba(0, 0, 0, 0.42);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    bottom: var(--spacing-ds-6);
    display: inline-flex;
    gap: var(--spacing-ds-1);
    left: 50%;
    padding: var(--spacing-ds-1);
    position: fixed;
    transform: translateX(-50%);
  }

  .ds-image__close {
    position: fixed;
    right: var(--spacing-ds-5);
    top: var(--spacing-ds-5);
  }

  .ds-image__tool,
  .ds-image__close {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.72);
    cursor: pointer;
    display: inline-flex;
    height: 36px;
    justify-content: center;
    padding: 0;
    transition:
      background 140ms ease-in-out,
      color 140ms ease-in-out;
    width: 36px;
  }

  .ds-image__tool:hover,
  .ds-image__close:hover,
  .ds-image__tool:focus-visible,
  .ds-image__close:focus-visible {
    background: rgba(255, 255, 255, 0.14);
    color: #fff;
    outline: 0;
  }

  @keyframes ds-image-shimmer {
    from {
      background-position: 180% 0;
    }

    to {
      background-position: -180% 0;
    }
  }
`;
