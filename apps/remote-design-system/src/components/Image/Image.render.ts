import { Eye, RotateCcw, RotateCw, X, ZoomIn, ZoomOut, createElement as createLucideElement } from "lucide";

import { IMAGE_STYLES } from "./Image.styles";
import type { ImageTransformAction } from "./types/Image.types";

export type ImageElements = {
  fallbackElement: HTMLDivElement;
  figureElement: HTMLElement;
  imageElement: HTMLImageElement;
  maskButton: HTMLButtonElement;
  placeholderElement: HTMLDivElement;
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
  const fallbackElement = document.createElement("div");
  const maskButton = document.createElement("button");
  const previewElement = document.createElement("div");
  const previewImageElement = document.createElement("img");
  const closeButton = createIconButton("Close preview", "close", X);
  const toolbarElement = document.createElement("div");

  rootElement.className = "ds-image";
  figureElement.className = "ds-image__figure";
  imageElement.className = "ds-image__img";
  placeholderElement.className = "ds-image__placeholder";
  fallbackElement.className = "ds-image__fallback";
  fallbackElement.textContent = "Image failed to load";
  maskButton.className = "ds-image__mask";
  maskButton.type = "button";
  maskButton.append(createIcon(Eye), document.createTextNode("Preview"));
  previewElement.className = "ds-image__preview";
  previewElement.setAttribute("role", "dialog");
  previewElement.setAttribute("aria-modal", "true");
  previewImageElement.className = "ds-image__preview-img";
  closeButton.classList.add("ds-image__close");
  toolbarElement.className = "ds-image__toolbar";

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
  maskButton.addEventListener("click", onOpenPreview);
  closeButton.addEventListener("click", onClosePreview);
  previewElement.addEventListener("click", (event) => {
    if (event.target === previewElement) {
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

  figureElement.append(imageElement, placeholderElement, fallbackElement, maskButton);
  previewElement.append(closeButton, previewImageElement, toolbarElement);
  rootElement.append(figureElement, previewElement);

  return {
    fallbackElement,
    figureElement,
    imageElement,
    maskButton,
    placeholderElement,
    previewElement,
    previewImageElement,
    rootElement
  };
}

function createIconButton(label: string, action: string, icon: Parameters<typeof createLucideElement>[0]) {
  const button = document.createElement("button");

  button.className = "ds-image__tool";
  button.type = "button";
  button.dataset.action = action;
  button.setAttribute("aria-label", label);
  button.title = label;
  button.append(createIcon(icon));

  return button;
}

function createIcon(icon: Parameters<typeof createLucideElement>[0]) {
  const iconElement = createLucideElement(icon);

  iconElement.setAttribute("aria-hidden", "true");
  iconElement.setAttribute("width", "18");
  iconElement.setAttribute("height", "18");

  return iconElement;
}
