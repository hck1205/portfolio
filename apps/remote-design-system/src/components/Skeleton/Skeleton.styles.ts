export const SKELETON_STYLES = `
  :host {
    color: var(--color-ds-text);
    display: block;
    font-family: var(--font-sans);
    font-size: var(--text-ds-2);
  }

  :host([hidden]) {
    display: none;
  }

  .ds-skeleton {
    display: grid;
    gap: var(--spacing-ds-4);
    width: 100%;
  }

  .ds-skeleton__placeholder {
    display: grid;
    gap: var(--spacing-ds-3);
    grid-template-columns: auto minmax(0, 1fr);
  }

  .ds-skeleton[data-avatar="false"] .ds-skeleton__placeholder {
    grid-template-columns: minmax(0, 1fr);
  }

  .ds-skeleton__placeholder[hidden],
  .ds-skeleton__content[hidden],
  .ds-skeleton__avatar[hidden],
  .ds-skeleton__title[hidden] {
    display: none;
  }

  .ds-skeleton__avatar,
  .ds-skeleton__title,
  .ds-skeleton__line {
    background:
      linear-gradient(90deg, transparent, var(--color-neutral-alpha-n2, rgba(0, 0, 0, 0.06)), transparent),
      var(--color-neutral-alpha-n2, rgba(0, 0, 0, 0.06));
    background-size: 240px 100%, 100% 100%;
    border-radius: var(--radius-ds-sm);
  }

  .ds-skeleton[data-round="true"] .ds-skeleton__title,
  .ds-skeleton[data-round="true"] .ds-skeleton__line {
    border-radius: 999px;
  }

  .ds-skeleton[data-active="true"] .ds-skeleton__avatar,
  .ds-skeleton[data-active="true"] .ds-skeleton__title,
  .ds-skeleton[data-active="true"] .ds-skeleton__line {
    animation: ds-skeleton-shimmer 1.35s ease-in-out infinite;
  }

  .ds-skeleton__avatar {
    border-radius: 999px;
    height: 40px;
    width: 40px;
  }

  .ds-skeleton__body {
    display: grid;
    gap: var(--spacing-ds-3);
    min-width: 0;
  }

  .ds-skeleton__title {
    height: 16px;
    width: 38%;
  }

  .ds-skeleton__paragraph {
    display: grid;
    gap: var(--spacing-ds-2);
  }

  .ds-skeleton__line {
    height: 14px;
    width: 100%;
  }

  .ds-skeleton__line:last-child {
    width: 62%;
  }

  @keyframes ds-skeleton-shimmer {
    from {
      background-position: -240px 0, 0 0;
    }

    to {
      background-position: 240px 0, 0 0;
    }
  }
`;
