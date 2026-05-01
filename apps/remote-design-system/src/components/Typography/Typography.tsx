import {
  TYPOGRAPHY_COPY_EVENT,
  TYPOGRAPHY_EDIT_CANCEL_EVENT,
  TYPOGRAPHY_EDIT_END_EVENT,
  TYPOGRAPHY_EDIT_START_EVENT,
  TYPOGRAPHY_OBSERVED_ATTRIBUTES
} from "./constants/Typography.constants";
import {
  colorTokenToCssVariable,
  getTypographyAs,
  getTypographyDisplay,
  getTypographyRows,
  getTypographyTagName,
  getTypographyTextAlign,
  getTypographyTextDecoration,
  getTypographyTextOverflow,
  getTypographyTitleLevel,
  getTypographyTokenStyle,
  getTypographyTypoName,
  getTypographyType,
  getTypographyVariant,
  normalizeBooleanAttribute
} from "./dom/Typography.dom";
import {
  applyTypographyStyles,
  createTypographyElements,
  syncTypographyElements,
  type TypographyElements
} from "./Typography.render";
import type {
  TypographyCopyDetail,
  TypographyDisplay,
  TypographyEditDetail,
  TypographyTextAlign,
  TypographyTextDecoration,
  TypographyTextOverflow,
  TypographyTitleLevel,
  TypographyTypoName,
  TypographyType,
  TypographyVariant
} from "./types/Typography.types";

export class DsTypography extends HTMLElement {
  static observedAttributes = TYPOGRAPHY_OBSERVED_ATTRIBUTES;

  private copied = false;
  private copiedTimer?: number;
  private editing = false;
  private elements?: TypographyElements;
  private originalValue = "";

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this.copiedTimer) {
      window.clearTimeout(this.copiedTimer);
    }
  }

  attributeChangedCallback() {
    this.render();
  }

  get as() {
    return getTypographyAs(this);
  }

  set as(value: string) {
    this.syncNullableAttribute("as", value);
  }

  get code() {
    return normalizeBooleanAttribute(this, "code", false);
  }

  set code(value: boolean) {
    this.toggleAttribute("code", value);
  }

  get color() {
    return this.getAttribute("color") ?? "";
  }

  set color(value: string) {
    this.syncNullableAttribute("color", value);
  }

  get colorToken() {
    return this.getAttribute("color-token") ?? "";
  }

  set colorToken(value: string) {
    this.syncNullableAttribute("color-token", value);
  }

  get copyable() {
    return normalizeBooleanAttribute(this, "copyable", false);
  }

  set copyable(value: boolean) {
    this.toggleAttribute("copyable", value);
  }

  get delete() {
    return normalizeBooleanAttribute(this, "delete", false);
  }

  set delete(value: boolean) {
    this.toggleAttribute("delete", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get display(): TypographyDisplay | undefined {
    return getTypographyDisplay(this);
  }

  set display(value: TypographyDisplay | undefined) {
    this.syncNullableAttribute("display", value);
  }

  get editable() {
    return normalizeBooleanAttribute(this, "editable", false);
  }

  set editable(value: boolean) {
    this.toggleAttribute("editable", value);
  }

  get ellipsis() {
    return normalizeBooleanAttribute(this, "ellipsis", false);
  }

  set ellipsis(value: boolean) {
    this.toggleAttribute("ellipsis", value);
  }

  get href() {
    return this.getAttribute("href") ?? "";
  }

  set href(value: string) {
    this.syncNullableAttribute("href", value);
  }

  get italic() {
    return normalizeBooleanAttribute(this, "italic", false);
  }

  set italic(value: boolean) {
    this.toggleAttribute("italic", value);
  }

  get keyboard() {
    return normalizeBooleanAttribute(this, "keyboard", false);
  }

  set keyboard(value: boolean) {
    this.toggleAttribute("keyboard", value);
  }

  get level(): TypographyTitleLevel {
    return getTypographyTitleLevel(this);
  }

  set level(value: TypographyTitleLevel) {
    this.setAttribute("level", String(value));
  }

  get mark() {
    return normalizeBooleanAttribute(this, "mark", false);
  }

  set mark(value: boolean) {
    this.toggleAttribute("mark", value);
  }

  get rows() {
    return getTypographyRows(this);
  }

  set rows(value: number) {
    this.setAttribute("rows", String(value));
  }

  get strong() {
    return normalizeBooleanAttribute(this, "strong", false);
  }

  set strong(value: boolean) {
    this.toggleAttribute("strong", value);
  }

  get target() {
    return this.getAttribute("target") ?? "";
  }

  set target(value: string) {
    this.syncNullableAttribute("target", value);
  }

  get textAlign(): TypographyTextAlign | undefined {
    return getTypographyTextAlign(this);
  }

  set textAlign(value: TypographyTextAlign | undefined) {
    this.syncNullableAttribute("text-align", value);
  }

  get textDecoration(): TypographyTextDecoration | undefined {
    return getTypographyTextDecoration(this);
  }

  set textDecoration(value: TypographyTextDecoration | undefined) {
    this.syncNullableAttribute("text-decoration", value);
  }

  get textOverflow(): TypographyTextOverflow {
    return getTypographyTextOverflow(this);
  }

  set textOverflow(value: TypographyTextOverflow) {
    this.setAttribute("text-overflow", value);
  }

  get typoName(): TypographyTypoName {
    return getTypographyTypoName(this);
  }

  set typoName(value: TypographyTypoName) {
    this.setAttribute("typo-name", value);
  }

  get type(): TypographyType {
    return getTypographyType(this);
  }

  set type(value: TypographyType) {
    this.setAttribute("type", value);
  }

  get underline() {
    return normalizeBooleanAttribute(this, "underline", false);
  }

  set underline(value: boolean) {
    this.toggleAttribute("underline", value);
  }

  get variant(): TypographyVariant {
    return getTypographyVariant(this);
  }

  set variant(value: TypographyVariant) {
    this.setAttribute("variant", value);
  }

  private handleCopy = async (event: Event) => {
    event.preventDefault();

    if (this.disabled) {
      return;
    }

    const text = this.getPlainText();

    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      this.copyWithSelection(text);
    }

    this.copied = true;
    this.dispatchEvent(
      new CustomEvent<TypographyCopyDetail>(TYPOGRAPHY_COPY_EVENT, {
        bubbles: true,
        detail: { text }
      })
    );
    this.render();

    if (this.copiedTimer) {
      window.clearTimeout(this.copiedTimer);
    }

    this.copiedTimer = window.setTimeout(() => {
      this.copied = false;
      this.render();
    }, 1800);
  };

  private handleEdit = (event: Event) => {
    event.preventDefault();

    if (this.disabled || !this.editable) {
      return;
    }

    this.originalValue = this.getPlainText();
    this.editing = true;
    this.dispatchEvent(
      new CustomEvent<TypographyEditDetail>(TYPOGRAPHY_EDIT_START_EVENT, {
        bubbles: true,
        detail: { value: this.originalValue }
      })
    );
    this.render();
  };

  private handleSave = (event: Event) => {
    event.preventDefault();

    if (!this.elements) {
      return;
    }

    const value = this.elements.editorElement.value;

    this.textContent = value;
    this.editing = false;
    this.dispatchEvent(
      new CustomEvent<TypographyEditDetail>(TYPOGRAPHY_EDIT_END_EVENT, {
        bubbles: true,
        detail: { value }
      })
    );
    this.render();
  };

  private handleCancel = (event: Event) => {
    event.preventDefault();
    this.editing = false;
    this.dispatchEvent(
      new CustomEvent<TypographyEditDetail>(TYPOGRAPHY_EDIT_CANCEL_EVENT, {
        bubbles: true,
        detail: { value: this.originalValue }
      })
    );
    this.render();
  };

  /**
   * Initializes semantic typography markup once, then syncs the selected native element.
   */
  private render() {
    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
    this.syncStructure();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createTypographyElements({
      onCancel: this.handleCancel,
      onCopy: this.handleCopy,
      onEdit: this.handleEdit,
      onSave: this.handleSave,
      tagName: this.tagNameForCurrentState()
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyTypographyStyles(shadowRoot);
  }

  private syncAttributes() {
    const tokenStyle = getTypographyTokenStyle(this.typoName);
    const color = this.color || colorTokenToCssVariable(this.colorToken);

    this.setAttributeIfChanged("variant", this.variant);
    this.setAttributeIfChanged("type", this.type);
    this.setAttributeIfChanged("typo-name", this.typoName);
    this.style.setProperty("--ds-typography-size", tokenStyle.size);
    this.style.setProperty("--ds-typography-weight", tokenStyle.weight);
    this.style.setProperty("--ds-typography-line-height", tokenStyle.lineHeight);

    if (color) {
      this.style.setProperty("--ds-typography-custom-color", color);
    } else {
      this.style.removeProperty("--ds-typography-custom-color");
    }

    if (this.variant === "title") {
      this.setAttributeIfChanged("level", String(this.level));
    }
  }

  private syncStructure() {
    if (!this.elements) {
      return;
    }

    this.elements = syncTypographyElements({
      copied: this.copied,
      copyable: this.copyable,
      disabled: this.disabled,
      display: this.display,
      editable: this.editable,
      editing: this.editing,
      elements: this.elements,
      href: this.href,
      onCancel: this.handleCancel,
      onCopy: this.handleCopy,
      onEdit: this.handleEdit,
      onSave: this.handleSave,
      rel: this.getAttribute("rel") ?? "",
      rows: this.rows,
      tagName: this.tagNameForCurrentState(),
      target: this.target,
      textAlign: this.textAlign,
      textDecoration: this.textDecoration,
      textOverflow: this.textOverflow,
      value: this.getPlainText()
    });
  }

  private tagNameForCurrentState() {
    return getTypographyTagName({
      as: this.as,
      href: this.href,
      level: this.level,
      variant: this.variant
    });
  }

  private getPlainText() {
    return this.textContent?.trim() ?? "";
  }

  private copyWithSelection(text: string) {
    const textArea = document.createElement("textarea");

    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.insetBlockStart = "-9999px";
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }

  private syncNullableAttribute(name: string, value: string | undefined) {
    if (value) {
      this.setAttributeIfChanged(name, value);
      return;
    }

    this.removeAttribute(name);
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}
