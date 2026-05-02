import { Check, Copy, Edit3, X, createElement as createLucideElement } from "lucide";

import { TYPOGRAPHY_STYLES } from "./Typography.styles";

export type TypographyElements = {
  actionsElement: HTMLSpanElement;
  cancelButtonElement: HTMLButtonElement;
  contentSlotElement: HTMLSlotElement;
  copyButtonElement: HTMLButtonElement;
  editButtonElement: HTMLButtonElement;
  editorElement: HTMLTextAreaElement;
  editorWrapElement: HTMLSpanElement;
  rootElement: HTMLElement;
  saveButtonElement: HTMLButtonElement;
};

export type SyncTypographyElementsOptions = {
  copied: boolean;
  copyable: boolean;
  disabled: boolean;
  display?: string;
  editable: boolean;
  editing: boolean;
  elements: TypographyElements;
  href: string;
  onCancel: (event: Event) => void;
  onCopy: (event: Event) => void;
  onEdit: (event: Event) => void;
  onSave: (event: Event) => void;
  rel: string;
  rows: number;
  tagName: string;
  target: string;
  textAlign?: string;
  textDecoration?: string;
  textOverflow: "truncate" | "break" | "none";
  value: string;
};

let typographyStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getTypographyStyleSheet() {
  if (!typographyStyleSheet) {
    typographyStyleSheet = new CSSStyleSheet();
    typographyStyleSheet.replaceSync(TYPOGRAPHY_STYLES);
  }

  return typographyStyleSheet;
}

export function applyTypographyStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    const styleSheet = getTypographyStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-typography]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsTypography = "";
  styleElement.textContent = TYPOGRAPHY_STYLES;
  shadowRoot.prepend(styleElement);
}

function createIcon(icon: typeof Copy) {
  return createLucideElement(icon, {
    "aria-hidden": "true",
    focusable: "false",
    height: 16,
    width: 16,
    "stroke-width": 2.25
  });
}

function createActionButton({
  icon,
  label,
  onClick
}: {
  icon: typeof Copy;
  label: string;
  onClick: (event: Event) => void;
}) {
  const button = document.createElement("button");

  button.className = "ds-typography__action";
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.title = label;
  button.append(createIcon(icon));
  button.addEventListener("click", onClick);

  return button;
}

function createRootElement(tagName: string) {
  const rootElement = document.createElement(tagName);

  rootElement.className = "cds-typography ds-typography";

  return rootElement;
}

export function createTypographyElements({
  onCancel,
  onCopy,
  onEdit,
  onSave,
  tagName
}: {
  onCancel: (event: Event) => void;
  onCopy: (event: Event) => void;
  onEdit: (event: Event) => void;
  onSave: (event: Event) => void;
  tagName: string;
}): TypographyElements {
  const rootElement = createRootElement(tagName);
  const mainElement = document.createElement("span");
  const contentSlotElement = document.createElement("slot");
  const actionsElement = document.createElement("span");
  const copyButtonElement = createActionButton({ icon: Copy, label: "Copy", onClick: onCopy });
  const editButtonElement = createActionButton({ icon: Edit3, label: "Edit", onClick: onEdit });
  const editorWrapElement = document.createElement("span");
  const editorElement = document.createElement("textarea");
  const editorActionsElement = document.createElement("span");
  const saveButtonElement = document.createElement("button");
  const cancelButtonElement = document.createElement("button");

  mainElement.className = "ds-typography__main";
  contentSlotElement.className = "ds-typography__content";
  actionsElement.className = "ds-typography__actions";
  editorWrapElement.className = "ds-typography__editor-wrap";
  editorElement.className = "ds-typography__editor";
  editorActionsElement.className = "ds-typography__editor-actions";
  saveButtonElement.className = "ds-typography__editor-button";
  cancelButtonElement.className = "ds-typography__editor-button";

  saveButtonElement.type = "button";
  cancelButtonElement.type = "button";
  saveButtonElement.textContent = "Save";
  cancelButtonElement.textContent = "Cancel";
  saveButtonElement.addEventListener("click", onSave);
  cancelButtonElement.addEventListener("click", onCancel);
  editorElement.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      onCancel(event);
    }

    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      onSave(event);
    }
  });

  actionsElement.append(copyButtonElement, editButtonElement);
  mainElement.append(contentSlotElement, actionsElement);
  editorActionsElement.append(saveButtonElement, cancelButtonElement);
  editorWrapElement.append(editorElement, editorActionsElement);
  editorWrapElement.hidden = true;
  rootElement.append(mainElement, editorWrapElement);

  return {
    actionsElement,
    cancelButtonElement,
    contentSlotElement,
    copyButtonElement,
    editButtonElement,
    editorElement,
    editorWrapElement,
    rootElement,
    saveButtonElement
  };
}

export function syncTypographyElements({
  copied,
  copyable,
  disabled,
  display,
  editable,
  editing,
  elements,
  href,
  onCancel,
  onCopy,
  onEdit,
  onSave,
  rel,
  rows,
  tagName,
  target,
  textAlign,
  textDecoration,
  textOverflow,
  value
}: SyncTypographyElementsOptions): TypographyElements {
  let nextElements = elements;

  if (elements.rootElement.localName !== tagName) {
    const replacement = createTypographyElements({ onCancel, onCopy, onEdit, onSave, tagName });
    elements.rootElement.replaceWith(replacement.rootElement);
    nextElements = replacement;
  }

  const {
    actionsElement,
    contentSlotElement,
    copyButtonElement,
    editButtonElement,
    editorElement,
    editorWrapElement,
    rootElement
  } = nextElements;
  const showActions = (copyable || editable) && !disabled;

  rootElement.toggleAttribute("aria-disabled", disabled);
  rootElement.style.setProperty("--ds-typography-rows", String(rows));
  syncOptionalStyle(rootElement, "display", display === "none" ? "none" : display);
  syncOptionalStyle(rootElement, "text-align", textAlign);
  syncOptionalStyle(rootElement, "text-decoration-line", textDecoration);
  rootElement.dataset.textOverflow = textOverflow;
  contentSlotElement.hidden = editing;
  actionsElement.hidden = !showActions || editing;
  copyButtonElement.hidden = !copyable;
  copyButtonElement.setAttribute("aria-label", copied ? "Copied" : "Copy");
  copyButtonElement.title = copied ? "Copied" : "Copy";
  copyButtonElement.replaceChildren(createIcon(copied ? Check : Copy));
  editButtonElement.hidden = !editable;
  editorWrapElement.hidden = !editing;

  if (editing) {
    editorElement.value = value;
    queueMicrotask(() => {
      editorElement.focus();
      editorElement.select();
    });
  }

  if (rootElement instanceof HTMLAnchorElement) {
    if (disabled) {
      rootElement.removeAttribute("href");
    } else {
      rootElement.href = href;
    }

    rootElement.tabIndex = disabled ? -1 : 0;
    syncOptionalAttribute(rootElement, "target", target);
    syncOptionalAttribute(rootElement, "rel", rel || (target === "_blank" ? "noreferrer" : ""));
  }

  return nextElements;
}

export function createEditorActionIcon(kind: "check" | "cancel") {
  return createIcon(kind === "check" ? Check : X);
}

function syncOptionalAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}

function syncOptionalStyle(element: HTMLElement, name: string, value?: string) {
  if (value) {
    element.style.setProperty(name, value);
    return;
  }

  element.style.removeProperty(name);
}
