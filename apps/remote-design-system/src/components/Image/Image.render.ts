import { Eye, ImageOff, RotateCcw, RotateCw, ZoomIn, ZoomOut, createElement as createLucideElement } from "lucide";

import { IMAGE_PREVIEW_GLOBAL_STYLES, IMAGE_STYLES } from "./Image.styles";
import type { ImageTransformAction } from "./types/Image.types";

export type ImageElements = {
  fallbackElement: HTMLDivElement;
  figureElement: HTMLElement;
  imageElement: HTMLImageElement;
  maskButton: HTMLButtonElement;
  placeholderElement: HTMLDivElement;
  placeholderImageElement: HTMLImageElement;
  previewContentElement: HTMLDivElement;
  previewElement: HTMLDivElement;
  previewImageElement: HTMLImageElement;
  rootElement: HTMLDivElement;
};

type CreateImageElementsOptions = {
  onClosePreview: () => void;
  onImageError: (event: Event) => void;
  onImageLoad: () => void;
  onOpenPreview: () => void;
  onTransform: (action: ImageTransformAction) => void;
};

const IMAGE_GLOBAL_STYLE_ID = "ds-image-preview-styles";
let imageStyleSheet: CSSStyleSheet | undefined;

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}

function getImageStyleSheet() {
  if (!imageStyleSheet) {
    imageStyleSheet = new CSSStyleSheet();
    imageStyleSheet.replaceSync(IMAGE_STYLES);
  }

  return imageStyleSheet;
}

export function applyImageStyles(shadowRoot: ShadowRoot) {
  applyGlobalPreviewStyles();

  if (canAdoptStyleSheets()) {
    const styleSheet = getImageStyleSheet();

    if (!shadowRoot.adoptedStyleSheets.includes(styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet];
    }

    return;
  }

  if (shadowRoot.querySelector("style[data-ds-image]")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.dataset.dsImage = "";
  styleElement.textContent = IMAGE_STYLES;
  shadowRoot.prepend(styleElement);
}

function applyGlobalPreviewStyles() {
  if (typeof document === "undefined" || document.getElementById(IMAGE_GLOBAL_STYLE_ID)) {
    return;
  }

  const styleElement = document.createElement("style");

  styleElement.id = IMAGE_GLOBAL_STYLE_ID;
  styleElement.textContent = IMAGE_PREVIEW_GLOBAL_STYLES;
  document.head.append(styleElement);
}

export function createImageElements({
  onClosePreview,
  onImageError,
  onImageLoad,
  onOpenPreview,
  onTransform
}: CreateImageElementsOptions): ImageElements {
  const rootElement = document.createElement("div");
  const figureElement = document.createElement("figure");
  const imageElement = document.createElement("img");
  const placeholderElement = document.createElement("div");
  const placeholderImageElement = document.createElement("img");
  const fallbackElement = document.createElement("div");
  const fallbackIconElement = createIcon(ImageOff, 24);
  const fallbackTextElement = document.createElement("span");
  const maskButton = document.createElement("button");
  const previewElement = document.createElement("div");
  const previewContentElement = document.createElement("div");
  const previewImageElement = document.createElement("img");
  const toolbarElement = document.createElement("div");

  rootElement.className = "ds-image";
  figureElement.className = "ds-image__figure";
  imageElement.className = "ds-image__img";
  placeholderElement.className = "ds-image__placeholder";
  placeholderImageElement.className = "ds-image__placeholder-img";
  fallbackElement.className = "ds-image__fallback";
  fallbackIconElement.classList.add("ds-image__fallback-icon");
  fallbackIconElement.setAttribute("part", "fallback-icon");
  fallbackTextElement.className = "ds-image__fallback-text";
  fallbackTextElement.textContent = "Image failed to load";
  maskButton.className = "ds-image__mask";
  maskButton.type = "button";
  maskButton.append(createIcon(Eye), document.createTextNode("Preview"));
  previewElement.className = "ds-image__preview";
  previewElement.setAttribute("role", "dialog");
  previewElement.setAttribute("aria-modal", "true");
  previewContentElement.className = "ds-image__preview-content";
  previewImageElement.className = "ds-image__preview-img";
  toolbarElement.className = "ds-image__toolbar";
  rootElement.setAttribute("part", "root");
  figureElement.setAttribute("part", "figure");
  imageElement.setAttribute("part", "image");
  placeholderElement.setAttribute("part", "placeholder");
  placeholderImageElement.setAttribute("part", "placeholder-image");
  fallbackElement.setAttribute("part", "fallback");
  maskButton.setAttribute("part", "mask");
  previewElement.setAttribute("part", "preview");
  previewContentElement.setAttribute("part", "preview-content");
  previewImageElement.setAttribute("part", "preview-image");
  toolbarElement.setAttribute("part", "toolbar");

  for (const [label, action, icon] of [
    ["Zoom out", "zoomOut", ZoomOut],
    ["Zoom in", "zoomIn", ZoomIn],
    ["Rotate left", "rotateLeft", RotateCcw],
    ["Rotate right", "rotateRight", RotateCw]
  ] as const) {
    toolbarElement.append(createIconButton(label, action, icon));
  }

  imageElement.addEventListener("load", onImageLoad);
  imageElement.addEventListener("error", onImageError);
  imageElement.addEventListener("click", onOpenPreview);
  maskButton.addEventListener("click", onOpenPreview);
  previewElement.addEventListener("pointerdown", (event) => {
    const target = event.target as Element | null;
    const clickedPreviewContent = Boolean(target?.closest(".ds-image__preview-content, .ds-image__toolbar"));

    if (!clickedPreviewContent) {
      onClosePreview();
    }
  });
  previewElement.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      onClosePreview();
    }
  });
  toolbarElement.addEventListener("click", (event) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-action]");

    if (button?.dataset.action) {
      onTransform(button.dataset.action as ImageTransformAction);
    }
  });

  placeholderElement.append(placeholderImageElement);
  fallbackElement.append(fallbackIconElement, fallbackTextElement);
  figureElement.append(imageElement, placeholderElement, fallbackElement, maskButton);
  previewContentElement.append(previewImageElement);
  previewElement.append(previewContentElement, toolbarElement);
  rootElement.append(figureElement, previewElement);

  return {
    fallbackElement,
    figureElement,
    imageElement,
    maskButton,
    placeholderElement,
    placeholderImageElement,
    previewContentElement,
    previewElement,
    previewImageElement,
    rootElement
  };
}

function createIconButton(label: string, action: ImageTransformAction | undefined, icon: Parameters<typeof createLucideElement>[0]) {
  const button = document.createElement("button");

  button.className = "ds-image__tool";
  button.type = "button";
  button.setAttribute("part", "tool");
  button.setAttribute("aria-label", label);
  button.title = label;

  if (action) {
    button.dataset.action = action;
  }

  button.append(createIcon(icon));

  return button;
}

function createIcon(icon: Parameters<typeof createLucideElement>[0], size = 18) {
  const iconElement = createLucideElement(icon);

  iconElement.setAttribute("aria-hidden", "true");
  iconElement.setAttribute("width", String(size));
  iconElement.setAttribute("height", String(size));

  return iconElement;
}
