import {
  IMAGE_ERROR_EVENT,
  IMAGE_OBSERVED_ATTRIBUTES,
  IMAGE_PREVIEW_OPEN_CHANGE_EVENT,
  IMAGE_TRANSFORM_EVENT
} from "./constants/Image.constants";
import {
  getDimensionValue,
  normalizeBooleanAttribute,
  syncImageElementSource,
  syncNullableAttribute,
  syncPreviewPortal
} from "./dom/Image.dom";
import { applyImageStyles, createImageElements, type ImageElements } from "./Image.render";
import {
  getDisplayImageSource,
  getNextTransformState,
  getPreviewImageSource,
  shouldDisablePreview,
  shouldShowFallbackElement,
  shouldShowPlaceholder
} from "./logic/Image.logic";
import type { ImagePreviewOpenChangeDetail, ImageTransformAction, ImageTransformDetail } from "./types/Image.types";

export class DsImage extends HTMLElement {
  static observedAttributes = IMAGE_OBSERVED_ATTRIBUTES;

  private elements?: ImageElements;
  private fallbackAttempted = false;
  private fallbackFailed = false;
  private hasError = false;
  private isLoaded = false;
  private previewOpen = false;
  private rotate = 0;
  private scale = 1;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === "src" && oldValue !== newValue) {
      this.fallbackAttempted = false;
      this.fallbackFailed = false;
      this.hasError = false;
      this.isLoaded = false;
    }

    if (name === "fallback" && oldValue !== newValue) {
      this.fallbackFailed = false;

      if (this.hasError && newValue && !this.fallbackAttempted) {
        this.fallbackAttempted = true;
        this.isLoaded = false;
      }

      if (!newValue) {
        this.fallbackAttempted = false;
      }
    }

    this.render();
  }

  get alt() {
    return this.getAttribute("alt") ?? "";
  }

  set alt(value: string) {
    syncNullableAttribute(this, "alt", value);
  }

  get fallback() {
    return this.getAttribute("fallback") ?? "";
  }

  set fallback(value: string) {
    syncNullableAttribute(this, "fallback", value);
  }

  get height() {
    return this.getAttribute("height") ?? "";
  }

  set height(value: string) {
    syncNullableAttribute(this, "height", value);
  }

  get mask() {
    return normalizeBooleanAttribute(this, "mask", true);
  }

  set mask(value: boolean) {
    this.setAttribute("mask", String(value));
  }

  get placeholder() {
    return normalizeBooleanAttribute(this, "placeholder", false);
  }

  set placeholder(value: boolean) {
    this.setAttribute("placeholder", String(value));
  }

  get placeholderSrc() {
    return this.getAttribute("placeholder-src") ?? "";
  }

  set placeholderSrc(value: string) {
    syncNullableAttribute(this, "placeholder-src", value);
  }

  get preview() {
    return normalizeBooleanAttribute(this, "preview", true);
  }

  set preview(value: boolean) {
    this.setAttribute("preview", String(value));
  }

  get previewSrc() {
    return this.getAttribute("preview-src") || this.src;
  }

  set previewSrc(value: string) {
    syncNullableAttribute(this, "preview-src", value);
  }

  get src() {
    return this.getAttribute("src") ?? "";
  }

  set src(value: string) {
    syncNullableAttribute(this, "src", value);
  }

  get width() {
    return this.getAttribute("width") ?? "";
  }

  set width(value: string) {
    syncNullableAttribute(this, "width", value);
  }

  closePreview() {
    this.setPreviewOpen(false);
  }

  openPreview() {
    if (this.preview && !this.isPreviewDisabled()) {
      this.setPreviewOpen(true);
    }
  }

  private handleImageLoad = () => {
    this.isLoaded = true;
    this.fallbackFailed = false;
    this.hasError = false;
    this.render();
  };

  private handleImageError = (event: Event) => {
    if (this.fallback && !this.fallbackAttempted) {
      this.fallbackAttempted = true;
      this.fallbackFailed = false;
      this.isLoaded = false;
      this.render();
      return;
    }

    if (this.fallbackAttempted && this.fallback) {
      this.fallbackFailed = true;
    }

    this.isLoaded = true;
    this.hasError = true;
    this.dispatchEvent(
      new CustomEvent(IMAGE_ERROR_EVENT, {
        bubbles: true,
        detail: {
          originalEvent: event
        }
      })
    );
    this.render();
  };

  private handleTransform = (action: ImageTransformAction) => {
    const nextTransform = getNextTransformState(action, { rotate: this.rotate, scale: this.scale });

    this.rotate = nextTransform.rotate;
    this.scale = nextTransform.scale;

    this.syncPreviewTransform();
    this.dispatchEvent(
      new CustomEvent<ImageTransformDetail>(IMAGE_TRANSFORM_EVENT, {
        bubbles: true,
        detail: {
          action,
          rotate: this.rotate,
          scale: this.scale
        }
      })
    );
  };

  private render() {
    if (!this.isConnected && !this.elements) {
      return;
    }

    if (!this.elements) {
      this.initializeStructure();
    }

    if (!this.elements) {
      return;
    }

    const width = getDimensionValue(this.width);
    const height = getDimensionValue(this.height);
    const imageSource = getDisplayImageSource({
      fallback: this.fallback,
      fallbackAttempted: this.fallbackAttempted,
      src: this.src
    });
    const previewSource = getPreviewImageSource({ imageSource, previewSrc: this.getAttribute("preview-src") ?? "" });
    const placeholderVisible = shouldShowPlaceholder({
      isLoaded: this.isLoaded,
      placeholder: this.placeholder,
      placeholderSrc: this.placeholderSrc
    });

    this.style.setProperty("--ds-image-width", width || "auto");
    this.style.setProperty("--ds-image-height", height || "auto");
    this.elements.imageElement.alt = this.alt;
    this.elements.imageElement.decoding = "async";
    syncImageElementSource(this.elements.imageElement, imageSource);
    this.elements.imageElement.dataset.loading = String(placeholderVisible);
    this.elements.placeholderElement.dataset.visible = String(placeholderVisible);
    this.elements.placeholderElement.dataset.kind = this.placeholderSrc ? "image" : "shimmer";
    this.elements.placeholderImageElement.alt = "";
    this.elements.placeholderImageElement.decoding = "async";
    syncImageElementSource(this.elements.placeholderImageElement, this.placeholderSrc);
    this.elements.fallbackElement.dataset.visible = String(this.isFallbackElementVisible());
    this.elements.maskButton.hidden = !this.preview || !this.mask || this.isPreviewDisabled();
    this.elements.previewImageElement.alt = this.alt;
    syncImageElementSource(this.elements.previewImageElement, previewSource);
    syncPreviewPortal({
      open: this.previewOpen,
      previewElement: this.elements.previewElement,
      rootElement: this.elements.rootElement
    });
    this.elements.previewElement.dataset.open = String(this.previewOpen);
    this.elements.previewElement.tabIndex = this.previewOpen ? 0 : -1;
    this.syncPreviewTransform();
  }

  private isFallbackElementVisible() {
    return shouldShowFallbackElement({
      fallback: this.fallback,
      fallbackFailed: this.fallbackFailed,
      hasError: this.hasError
    });
  }

  private isPreviewDisabled() {
    return shouldDisablePreview({
      fallback: this.fallback,
      fallbackAttempted: this.fallbackAttempted,
      fallbackFailed: this.fallbackFailed,
      hasError: this.hasError
    });
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createImageElements({
      onClosePreview: () => this.closePreview(),
      onImageError: this.handleImageError,
      onImageLoad: this.handleImageLoad,
      onOpenPreview: () => this.openPreview(),
      onTransform: this.handleTransform
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyImageStyles(shadowRoot);
  }

  private setPreviewOpen(open: boolean) {
    if (this.previewOpen === open) {
      return;
    }

    this.previewOpen = open;

    if (!open) {
      this.scale = 1;
      this.rotate = 0;
    }

    this.render();

    if (open) {
      this.elements?.previewElement.focus();
    }

    this.dispatchEvent(
      new CustomEvent<ImagePreviewOpenChangeDetail>(IMAGE_PREVIEW_OPEN_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          open
        }
      })
    );
  }

  private syncPreviewTransform() {
    this.elements?.previewImageElement.style.setProperty("--ds-image-preview-scale", String(this.scale));
    this.elements?.previewImageElement.style.setProperty("--ds-image-preview-rotate", `${this.rotate}deg`);
  }
}
