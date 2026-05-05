export const AVATAR_STYLES = `
  :host {
    --ds-avatar-size: 32px;
    --ds-avatar-radius: var(--radius-full);
    display: inline-flex;
    font-family: var(--font-sans);
    line-height: 1;
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none;
  }

  :host([size="small"]) {
    --ds-avatar-size: 24px;
  }

  :host([size="large"]) {
    --ds-avatar-size: 40px;
  }

  :host([shape="square"]) {
    --ds-avatar-radius: var(--radius-ds-sm);
  }

  .ds-avatar {
    align-items: center;
    background: var(--color-neutral-alpha-n3);
    border-radius: var(--ds-avatar-radius);
    box-sizing: border-box;
    color: var(--color-ds-text);
    display: inline-grid;
    flex: none;
    font-size: var(--ds-avatar-font-size, 14px);
    font-weight: var(--font-weight-ds-medium, 500);
    height: var(--ds-avatar-size);
    line-height: 1;
    max-width: 100%;
    overflow: hidden;
    place-items: center;
    position: relative;
    user-select: none;
    white-space: nowrap;
    width: var(--ds-avatar-size);
  }

  .ds-avatar[data-tone="image"] {
    background: var(--color-ds-surface);
  }

  .ds-avatar[data-tone="icon"] {
    background: var(--color-ds-primary-subtle, #e6f4ff);
    color: var(--color-ds-primary);
  }

  .ds-avatar__image {
    display: block;
    height: 100%;
    object-fit: var(--ds-avatar-fit, cover);
    width: 100%;
  }

  .ds-avatar__text {
    align-items: center;
    display: inline-grid;
    height: 100%;
    justify-items: center;
    line-height: 1;
    max-width: calc(100% - var(--ds-avatar-gap, 4px) * 2);
    min-width: max-content;
    overflow: hidden;
    text-align: center;
    text-overflow: clip;
    width: max-content;
  }

  .ds-avatar__icon {
    display: block;
    margin: auto;
  }
`;

export const AVATAR_GROUP_STYLES = `
  :host {
    --ds-avatar-group-overlap: -8px;
    display: inline-flex;
    font-family: var(--font-sans);
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none;
  }

  .ds-avatar-group {
    align-items: center;
    display: inline-flex;
  }

  .ds-avatar-group__slot {
    align-items: center;
    display: inline-flex;
  }

  ::slotted(ds-avatar) {
    border-radius: var(--ds-avatar-radius, var(--radius-full));
    box-shadow: 0 0 0 2px var(--color-ds-surface);
    position: relative;
  }

  ::slotted(ds-avatar:hover) {
    z-index: 1;
  }

  .ds-avatar-group__overflow {
    align-items: center;
    background: var(--color-neutral-alpha-n3);
    border-radius: var(--ds-avatar-radius, var(--radius-full));
    box-shadow: 0 0 0 2px var(--color-ds-surface);
    box-sizing: border-box;
    color: var(--color-ds-text);
    display: none;
    flex: none;
    font-size: var(--text-ds-1);
    font-weight: var(--font-weight-ds-medium, 500);
    height: var(--ds-avatar-size, 32px);
    justify-content: center;
    margin-inline-start: var(--ds-avatar-group-overlap);
    min-width: 0;
    padding: 0;
    width: var(--ds-avatar-size, 32px);
  }

  .ds-avatar-group__overflow[data-visible="true"] {
    display: inline-flex;
  }

  :host([size="small"]) {
    --ds-avatar-size: 24px;
  }

  :host([size="large"]) {
    --ds-avatar-size: 40px;
  }

  :host([shape="square"]) {
    --ds-avatar-radius: var(--radius-ds-sm);
  }
`;

let avatarStyleSheet: CSSStyleSheet | undefined;
let avatarGroupStyleSheet: CSSStyleSheet | undefined;

export function applyAvatarStyles(shadowRoot: ShadowRoot) {
  if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
    avatarStyleSheet ??= new CSSStyleSheet();
    avatarStyleSheet.replaceSync(AVATAR_STYLES);
    shadowRoot.adoptedStyleSheets = [avatarStyleSheet];
    return;
  }

  const style = document.createElement("style");

  style.textContent = AVATAR_STYLES;
  shadowRoot.append(style);
}

export function applyAvatarGroupStyles(shadowRoot: ShadowRoot) {
  if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
    avatarGroupStyleSheet ??= new CSSStyleSheet();
    avatarGroupStyleSheet.replaceSync(AVATAR_GROUP_STYLES);
    shadowRoot.adoptedStyleSheets = [avatarGroupStyleSheet];
    return;
  }

  const style = document.createElement("style");

  style.textContent = AVATAR_GROUP_STYLES;
  shadowRoot.append(style);
}
