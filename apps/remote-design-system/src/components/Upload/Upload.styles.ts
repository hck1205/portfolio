export const UPLOAD_STYLES = `
  :host {
    display: inline-block;
    font-family: var(--font-sans);
    max-width: 100%;
    vertical-align: middle;
  }

  [hidden] {
    display: none !important;
  }

  .ds-upload {
    color: var(--color-ds-text);
    display: grid;
    gap: var(--spacing-ds-3);
  }

  .ds-upload__input {
    display: none;
  }

  .ds-upload__trigger,
  .ds-upload__dropzone {
    align-items: center;
    appearance: none;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    color: var(--color-ds-text);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    gap: var(--spacing-ds-2);
    justify-content: center;
    min-height: var(--spacing-m2);
    padding: 0 var(--spacing-ds-4);
  }

  .ds-upload__dropzone {
    border-style: dashed;
    display: grid;
    justify-items: center;
    min-height: 10rem;
    min-width: 20rem;
    padding: var(--spacing-ds-6);
    place-content: center;
    text-align: center;
  }

  .ds-upload__dropzone-content {
    align-items: center;
    display: grid;
    gap: var(--spacing-ds-2);
    justify-items: center;
    max-width: 24rem;
  }

  .ds-upload__dropzone-icon {
    color: var(--color-ds-primary);
  }

  .ds-upload__dropzone-title {
    font-weight: var(--font-weight-ds-medium, 500);
  }

  .ds-upload__dropzone-hint {
    color: var(--color-ds-muted);
    font-size: var(--text-ds-1);
    line-height: var(--leading-ds-normal, 1.5);
  }

  .ds-upload__dropzone[data-dragging="true"] {
    background: var(--color-ds-subtle-surface, var(--color-neutral-alpha-n2));
    border-color: var(--color-ds-primary);
  }

  .ds-upload__trigger:hover,
  .ds-upload__dropzone:hover {
    border-color: var(--color-ds-primary);
    color: var(--color-ds-primary);
  }

  .ds-upload__trigger:disabled,
  .ds-upload__dropzone[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.56;
  }

  .ds-upload__list {
    display: grid;
    gap: var(--spacing-ds-2);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .ds-upload__item {
    align-items: center;
    background: var(--color-ds-surface);
    border: var(--ds-border-width-default) solid var(--color-ds-border);
    border-radius: var(--radius-ds-sm);
    display: grid;
    gap: var(--spacing-ds-3);
    grid-template-columns: auto minmax(0, 1fr) auto;
    min-height: var(--spacing-m2);
    overflow: hidden;
    padding: var(--spacing-ds-2) var(--spacing-ds-3);
  }

  .ds-upload__item:hover {
    background: var(--color-ds-surface-hover, var(--color-neutral-alpha-n2));
  }

  .ds-upload__thumb {
    align-items: center;
    background: var(--color-neutral-alpha-n2);
    border-radius: var(--radius-level1);
    color: var(--color-ds-muted);
    display: inline-flex;
    height: var(--spacing-m1);
    justify-content: center;
    overflow: hidden;
    width: var(--spacing-m1);
  }

  .ds-upload__thumb img {
    border-radius: inherit;
    display: block;
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  :host([list-type="picture"]) .ds-upload__thumb {
    height: 2.5rem;
    width: 2.5rem;
  }

  .ds-upload__name {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ds-upload__meta {
    color: var(--color-ds-muted);
    display: block;
    font-size: var(--text-ds-1);
    margin-block-start: var(--spacing-ds-1);
  }

  .ds-upload__actions {
    align-items: center;
    display: inline-flex;
    gap: var(--spacing-ds-1);
  }

  .ds-upload__action,
  .ds-upload__remove {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: var(--radius-level1);
    color: var(--color-ds-muted);
    cursor: pointer;
    display: inline-flex;
    height: var(--spacing-ds-6);
    justify-content: center;
    padding: 0;
    width: var(--spacing-ds-6);
  }

  .ds-upload__action:hover {
    background: var(--color-ds-surface-hover, var(--color-neutral-alpha-n2));
    color: var(--color-ds-primary);
  }

  .ds-upload__remove:hover {
    background: var(--color-ds-surface-hover, var(--color-neutral-alpha-n2));
    color: var(--color-ds-danger);
  }

  :host([list-type="picture-card"]) .ds-upload__list,
  :host([list-type="picture-circle"]) .ds-upload__list {
    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
  }

  :host([list-type="picture-card"]) .ds-upload__item,
  :host([list-type="picture-circle"]) .ds-upload__item {
    align-content: center;
    grid-template-columns: 1fr;
    justify-items: center;
    min-height: 8rem;
    padding: var(--spacing-ds-3);
    position: relative;
    text-align: center;
  }

  :host([list-type="picture-card"]) .ds-upload__thumb,
  :host([list-type="picture-circle"]) .ds-upload__thumb {
    height: 5rem;
    min-height: 4.5rem;
    width: 100%;
  }

  :host([list-type="picture-card"]) .ds-upload__body,
  :host([list-type="picture-circle"]) .ds-upload__body {
    min-width: 0;
    width: 100%;
  }

  :host([list-type="picture-card"]) .ds-upload__actions,
  :host([list-type="picture-circle"]) .ds-upload__actions {
    inset-block-start: var(--spacing-ds-2);
    inset-inline-end: var(--spacing-ds-2);
    position: absolute;
  }

  :host([list-type="picture-circle"]) .ds-upload__item,
  :host([list-type="picture-circle"]) .ds-upload__thumb {
    border-radius: var(--radius-full);
  }

  :host([list-type="picture-circle"]) .ds-upload__list {
    grid-template-columns: repeat(auto-fill, minmax(8rem, 8rem));
  }

  :host([list-type="picture-circle"]) .ds-upload__item {
    aspect-ratio: 1;
    grid-template-rows: 1fr auto;
    min-height: 0;
    padding: var(--spacing-ds-2);
    width: 8rem;
  }

  :host([list-type="picture-circle"]) .ds-upload__thumb {
    align-self: center;
    height: 5.75rem;
    min-height: 0;
    width: 5.75rem;
  }

  :host([list-type="picture-circle"]) .ds-upload__body {
    max-width: 6.5rem;
    overflow: hidden;
  }

  :host([list-type="picture-circle"]) .ds-upload__meta {
    display: none;
  }

  :host([list-type="picture-circle"]) .ds-upload__actions {
    background: var(--color-neutral-alpha-n9, rgba(0, 0, 0, 0.56));
    border-radius: var(--radius-full);
    color: var(--color-white, #fff);
    gap: var(--spacing-ds-1);
    inset-block-start: 50%;
    inset-inline-end: auto;
    inset-inline-start: 50%;
    overflow: hidden;
    padding: var(--spacing-ds-1);
    transform: translate(-50%, -62%);
    z-index: 1;
  }

  :host([list-type="picture-circle"]) .ds-upload__action,
  :host([list-type="picture-circle"]) .ds-upload__remove {
    color: inherit;
    height: var(--spacing-ds-6);
    width: var(--spacing-ds-6);
  }

  :host([list-type="picture-circle"]) .ds-upload__action:hover,
  :host([list-type="picture-circle"]) .ds-upload__remove:hover {
    background: rgba(255, 255, 255, 0.16);
    color: inherit;
  }
`;

let uploadStyleSheet: CSSStyleSheet | undefined;

export function applyUploadStyles(shadowRoot: ShadowRoot) {
  if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
    uploadStyleSheet ??= new CSSStyleSheet();
    uploadStyleSheet.replaceSync(UPLOAD_STYLES);
    shadowRoot.adoptedStyleSheets = [uploadStyleSheet];
    return;
  }

  const style = document.createElement("style");

  style.textContent = UPLOAD_STYLES;
  shadowRoot.append(style);
}
