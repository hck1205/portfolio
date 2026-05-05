import type { ImageTransformAction } from "../types/Image.types";

type ImageSourceOptions = {
  fallback: string;
  fallbackAttempted: boolean;
  src: string;
};

type PreviewSourceOptions = {
  imageSource: string;
  previewSrc: string;
};

type PlaceholderOptions = {
  isLoaded: boolean;
  placeholder: boolean;
  placeholderSrc: string;
};

type FallbackVisibilityOptions = {
  fallback: string;
  fallbackFailed: boolean;
  hasError: boolean;
};

type PreviewDisabledOptions = FallbackVisibilityOptions & {
  fallbackAttempted: boolean;
};

type TransformState = {
  rotate: number;
  scale: number;
};

export function getDisplayImageSource({ fallback, fallbackAttempted, src }: ImageSourceOptions) {
  return fallbackAttempted && fallback ? fallback : src;
}

export function getPreviewImageSource({ imageSource, previewSrc }: PreviewSourceOptions) {
  return previewSrc || imageSource;
}

export function shouldShowPlaceholder({ isLoaded, placeholder, placeholderSrc }: PlaceholderOptions) {
  return !isLoaded && (placeholder || Boolean(placeholderSrc));
}

export function shouldShowFallbackElement({ fallback, fallbackFailed, hasError }: FallbackVisibilityOptions) {
  return hasError && (!fallback || fallbackFailed);
}

export function shouldDisablePreview({
  fallback,
  fallbackAttempted,
  fallbackFailed,
  hasError
}: PreviewDisabledOptions) {
  return fallbackAttempted || shouldShowFallbackElement({ fallback, fallbackFailed, hasError });
}

export function getNextTransformState(action: ImageTransformAction, { rotate, scale }: TransformState): TransformState {
  if (action === "zoomIn") {
    return { rotate, scale: Math.min(4, scale + 0.5) };
  }

  if (action === "zoomOut") {
    return { rotate, scale: Math.max(1, scale - 0.5) };
  }

  if (action === "rotateLeft") {
    return { rotate: rotate - 90, scale };
  }

  if (action === "rotateRight") {
    return { rotate: rotate + 90, scale };
  }

  return { rotate: 0, scale: 1 };
}
