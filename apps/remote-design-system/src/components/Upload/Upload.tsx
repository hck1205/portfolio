import { File, Trash2, UploadCloud, createElement as createLucideElement } from "lucide";

import {
  UPLOAD_CHANGE_EVENT,
  UPLOAD_OBSERVED_ATTRIBUTES,
  UPLOAD_REMOVE_EVENT
} from "./constants/Upload.constants";
import {
  fileToUploadItem,
  formatFileSize,
  getNumberAttribute,
  getUploadListType,
  normalizeBooleanAttribute
} from "./dom/Upload.dom";
import { applyUploadStyles } from "./Upload.styles";
import type {
  UploadChangeDetail,
  UploadFileItem,
  UploadListType,
  UploadRemoveDetail
} from "./types/Upload.types";

export class DsUpload extends HTMLElement {
  static observedAttributes = UPLOAD_OBSERVED_ATTRIBUTES;

  private fileList: UploadFileItem[] = [];
  private inputElement?: HTMLInputElement;
  private isDragging = false;
  private rootElement?: HTMLDivElement;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get accept() {
    return this.getAttribute("accept") ?? "";
  }

  set accept(value: string) {
    this.syncNullableAttribute("accept", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get directory() {
    return normalizeBooleanAttribute(this, "directory", false);
  }

  set directory(value: boolean) {
    this.toggleAttribute("directory", value);
  }

  get drag() {
    return normalizeBooleanAttribute(this, "drag", false);
  }

  set drag(value: boolean) {
    this.toggleAttribute("drag", value);
  }

  get listType(): UploadListType {
    return getUploadListType(this);
  }

  set listType(value: UploadListType) {
    this.setAttribute("list-type", value);
  }

  get maxCount() {
    return getNumberAttribute(this, "max-count");
  }

  set maxCount(value: number | undefined) {
    this.syncNullableAttribute("max-count", value === undefined ? "" : String(value));
  }

  get multiple() {
    return normalizeBooleanAttribute(this, "multiple", false);
  }

  set multiple(value: boolean) {
    this.toggleAttribute("multiple", value);
  }

  get showUploadList() {
    return normalizeBooleanAttribute(this, "show-upload-list", true);
  }

  set showUploadList(value: boolean) {
    this.setAttribute("show-upload-list", String(value));
  }

  get text() {
    return this.getAttribute("text") ?? "Click to Upload";
  }

  set text(value: string) {
    this.syncNullableAttribute("text", value);
  }

  private render() {
    if (!this.isConnected) {
      return;
    }

    if (!this.rootElement) {
      const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

      this.rootElement = document.createElement("div");
      this.rootElement.className = "ds-upload";
      shadowRoot.replaceChildren(this.rootElement);
      applyUploadStyles(shadowRoot);
    }

    this.setAttributeIfChanged("list-type", this.listType);
    this.rootElement.replaceChildren(this.createInput(), this.createTrigger(), this.createList());
  }

  private createInput() {
    const input = document.createElement("input");

    input.className = "ds-upload__input";
    input.type = "file";
    input.accept = this.accept;
    input.disabled = this.disabled;
    input.multiple = this.multiple;
    input.toggleAttribute("webkitdirectory", this.directory);
    input.addEventListener("change", () => {
      this.addFiles(input.files);
      input.value = "";
    });
    this.inputElement = input;

    return input;
  }

  private createTrigger() {
    if (this.drag) {
      return this.createDropzone();
    }

    const button = document.createElement("button");

    button.className = "ds-upload__trigger";
    button.type = "button";
    button.disabled = this.disabled;
    button.append(this.createIcon(UploadCloud), document.createTextNode(this.text));
    button.addEventListener("click", () => this.openFileDialog());

    return button;
  }

  private createDropzone() {
    const dropzone = document.createElement("div");
    const icon = this.createIcon(UploadCloud, 24);
    const text = document.createElement("span");

    dropzone.className = "ds-upload__dropzone";
    dropzone.dataset.dragging = String(this.isDragging);
    dropzone.setAttribute("aria-disabled", String(this.disabled));
    dropzone.setAttribute("role", "button");
    dropzone.tabIndex = this.disabled ? -1 : 0;
    text.textContent = this.text;
    dropzone.append(icon, text);
    dropzone.addEventListener("click", () => this.openFileDialog());
    dropzone.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.openFileDialog();
      }
    });
    dropzone.addEventListener("dragover", (event) => {
      if (this.disabled) {
        return;
      }

      event.preventDefault();
      this.isDragging = true;
      this.render();
    });
    dropzone.addEventListener("dragleave", () => {
      this.isDragging = false;
      this.render();
    });
    dropzone.addEventListener("drop", (event) => {
      if (this.disabled) {
        return;
      }

      event.preventDefault();
      this.isDragging = false;
      this.addFiles(event.dataTransfer?.files ?? null);
    });

    return dropzone;
  }

  private createList() {
    const list = document.createElement("ul");

    list.className = "ds-upload__list";
    list.hidden = !this.showUploadList || this.fileList.length === 0;
    list.append(...this.fileList.map((file) => this.createFileItem(file)));

    return list;
  }

  private createFileItem(file: UploadFileItem) {
    const item = document.createElement("li");
    const thumb = document.createElement("span");
    const body = document.createElement("span");
    const name = document.createElement("span");
    const meta = document.createElement("span");
    const removeButton = document.createElement("button");

    item.className = "ds-upload__item";
    thumb.className = "ds-upload__thumb";
    thumb.append(this.createIcon(File));
    body.className = "ds-upload__body";
    name.className = "ds-upload__name";
    name.textContent = file.name;
    meta.className = "ds-upload__meta";
    meta.textContent = `${formatFileSize(file.size)} · ${file.status}`;
    body.append(name, meta);
    removeButton.className = "ds-upload__remove";
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `Remove ${file.name}`);
    removeButton.append(this.createIcon(Trash2));
    removeButton.addEventListener("click", () => this.removeFile(file.uid));
    item.append(thumb, body, removeButton);

    return item;
  }

  private addFiles(files: FileList | null) {
    if (!files || this.disabled) {
      return;
    }

    const nextFiles = [...this.fileList, ...Array.from(files).map(fileToUploadItem)];
    const maxCount = this.maxCount;

    this.fileList = maxCount ? nextFiles.slice(maxCount * -1) : nextFiles;
    this.dispatchChange();
    this.render();
  }

  private removeFile(uid: string) {
    const file = this.fileList.find((item) => item.uid === uid);

    if (!file) {
      return;
    }

    this.fileList = this.fileList.filter((item) => item.uid !== uid);
    this.dispatchEvent(
      new CustomEvent<UploadRemoveDetail>(UPLOAD_REMOVE_EVENT, {
        bubbles: true,
        detail: {
          file,
          fileList: this.fileList
        }
      })
    );
    this.dispatchChange();
    this.render();
  }

  private dispatchChange() {
    this.dispatchEvent(
      new CustomEvent<UploadChangeDetail>(UPLOAD_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          fileList: this.fileList
        }
      })
    );
  }

  private openFileDialog() {
    if (this.disabled) {
      return;
    }

    this.inputElement?.click();
  }

  private createIcon(icon: Parameters<typeof createLucideElement>[0], size = 16) {
    return createLucideElement(icon, {
      "aria-hidden": "true",
      focusable: "false",
      height: size,
      width: size,
      "stroke-width": 2
    });
  }

  private syncNullableAttribute(name: string, value: string) {
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
