import type { AnchorDirection } from "../types/Anchor.types";

export type AnchorScrollContainer = HTMLElement | Window;

export type AnchorViewportMetrics = {
  containerTop: number;
  targetOffset: number;
  viewportSize: number;
};

export function normalizeBooleanAttribute(element: HTMLElement, name: string, fallback = false) {
  const value = element.getAttribute(name);

  if (value === null) {
    return fallback;
  }

  return value === "" || value.toLowerCase() === "true";
}

export function getAnchorDirection(element: HTMLElement): AnchorDirection {
  return element.getAttribute("direction") === "horizontal" ? "horizontal" : "vertical";
}

export function getNumericAttribute(element: HTMLElement, name: string, fallback = 0) {
  const value = Number(element.getAttribute(name));

  return Number.isFinite(value) ? value : fallback;
}

export function getHashFromHref(href: string) {
  if (!href.startsWith("#") || href.length <= 1) {
    return "";
  }

  return href;
}

function escapeIdSelector(id: string) {
  if ("CSS" in window && typeof window.CSS.escape === "function") {
    return window.CSS.escape(id);
  }

  return id.replace(/["\\]/g, "\\$&");
}

export function getTargetElementFromHash(hash: string, container: AnchorScrollContainer = window) {
  if (!hash) {
    return null;
  }

  const id = decodeURIComponent(hash.slice(1));

  if (!id) {
    return null;
  }

  if (!isWindow(container)) {
    return container.querySelector<HTMLElement>(`#${escapeIdSelector(id)}`);
  }

  return document.getElementById(id);
}

export function getScrollContainer(sourceElement: HTMLElement): AnchorScrollContainer {
  let currentElement = sourceElement.parentElement;

  while (currentElement) {
    const { overflowY } = window.getComputedStyle(currentElement);
    const canScroll = /(auto|scroll|overlay)/.test(overflowY);

    if (canScroll && currentElement.scrollHeight > currentElement.clientHeight) {
      return currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return window;
}

function isWindow(container: AnchorScrollContainer): container is Window {
  return container === window;
}

export function getTargetTop(targetElement: HTMLElement, container: AnchorScrollContainer, targetOffset: number) {
  if (isWindow(container)) {
    return targetElement.getBoundingClientRect().top + window.scrollY - targetOffset;
  }

  return (
    targetElement.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop -
    targetOffset
  );
}

export function getAnchorViewportMetrics(container: AnchorScrollContainer, targetOffset: number): AnchorViewportMetrics {
  if (isWindow(container)) {
    return {
      containerTop: 0,
      targetOffset,
      viewportSize: Math.max(1, window.innerHeight - targetOffset)
    };
  }

  return {
    containerTop: container.getBoundingClientRect().top,
    targetOffset,
    viewportSize: Math.max(1, container.clientHeight - targetOffset)
  };
}

export function getAnchorTargetMetrics(targetElement: HTMLElement, viewportMetrics: AnchorViewportMetrics) {
  const targetRect = targetElement.getBoundingClientRect();
  const distance = targetRect.top - viewportMetrics.containerTop - viewportMetrics.targetOffset;
  const targetSize = targetRect.height;
  const visibleStart = Math.max(distance, 0);
  const visibleEnd = Math.min(distance + targetSize, viewportMetrics.viewportSize);

  return {
    distance,
    visibleSize: Math.max(0, visibleEnd - visibleStart)
  };
}

export function isScrollContainerAtEnd(container: AnchorScrollContainer) {
  if (isWindow(container)) {
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    return scrollTop + viewportHeight >= scrollHeight - 1;
  }

  return container.scrollTop + container.clientHeight >= container.scrollHeight - 1;
}

export function scrollToHash(hash: string, targetOffset: number, container: AnchorScrollContainer = window) {
  const targetElement = getTargetElementFromHash(hash, container);

  if (!targetElement) {
    return false;
  }

  const top = getTargetTop(targetElement, container, targetOffset);

  if (isWindow(container)) {
    window.scrollTo({ behavior: "smooth", top });
  } else {
    container.scrollTo({ behavior: "smooth", top });
  }

  return true;
}
