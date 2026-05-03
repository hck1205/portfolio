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
    min-height: 10rem;
    min-width: 20rem;
    padding: var(--spacing-ds-6);
    text-align: center;
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
    padding: var(--spacing-ds-2) var(--spacing-ds-3);
  }

  .ds-upload__thumb {
    align-items: center;
    background: var(--color-neutral-alpha-n2);
    border-radius: var(--radius-level1);
    color: var(--color-ds-muted);
    display: inline-flex;
    height: var(--spacing-m1);
    justify-content: center;
    width: var(--spacing-m1);
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
    grid-template-columns: 1fr auto;
    min-height: 7rem;
  }

  :host([list-type="picture-circle"]) .ds-upload__item,
  :host([list-type="picture-circle"]) .ds-upload__thumb {
    border-radius: var(--radius-full);
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
