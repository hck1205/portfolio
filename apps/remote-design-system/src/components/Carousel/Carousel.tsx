import { CAROUSEL_AFTER_CHANGE_EVENT, CAROUSEL_BEFORE_CHANGE_EVENT, CAROUSEL_OBSERVED_ATTRIBUTES } from "./constants/Carousel.constants";
import {
  getCarouselDotPlacement,
  getCarouselEffect,
  getPositiveNumberAttribute,
  normalizeBooleanAttribute
} from "./dom/Carousel.dom";
import {
  CAROUSEL_TRANSITION_FALLBACK_MS,
  getCarouselAxis,
  getCarouselDragDelta,
  getCarouselLoopDirection,
  normalizeCarouselIndex,
  type CarouselAxis,
  type CarouselLoopDirection
} from "./logic/Carousel.logic";
import { createCarouselDot, createCarouselElements, syncCarouselArrowButtons } from "./render/Carousel.render";
import { applyCarouselStyles } from "./Carousel.styles";
import type { CarouselChangeDetail, CarouselDotPlacement, CarouselEffect } from "./types/Carousel.types";

export class DsCarousel extends HTMLElement {
  static observedAttributes = CAROUSEL_OBSERVED_ATTRIBUTES;

  private autoplayId?: number;
  private currentIndex = 0;
  private dotsElement?: HTMLOListElement;
  private loopTransitionActive = false;
  private nextButton?: HTMLButtonElement;
  private pointerStartX?: number;
  private pointerStartY?: number;
  private prevButton?: HTMLButtonElement;
  private renderedDotCount = -1;
  private rootElement?: HTMLDivElement;
  private slotElement?: HTMLSlotElement;
  private trackElement?: HTMLDivElement;
  private viewportElement?: HTMLDivElement;
  private visualIndex = 0;

  connectedCallback() {
    this.render();
    this.syncAutoplay();
  }

  disconnectedCallback() {
    this.stopAutoplay();
  }

  attributeChangedCallback() {
    this.render();
    this.syncAutoplay();
  }

  get arrows() {
    return normalizeBooleanAttribute(this, "arrows", false);
  }

  set arrows(value: boolean) {
    this.setAttribute("arrows", String(value));
  }

  get autoplay() {
    return normalizeBooleanAttribute(this, "autoplay", false);
  }

  set autoplay(value: boolean) {
    this.setAttribute("autoplay", String(value));
  }

  get autoplaySpeed() {
    return getPositiveNumberAttribute(this, "autoplay-speed", 3000);
  }

  set autoplaySpeed(value: number) {
    this.setAttribute("autoplay-speed", String(value));
  }

  get dotPlacement(): CarouselDotPlacement {
    return getCarouselDotPlacement(this);
  }

  set dotPlacement(value: CarouselDotPlacement) {
    this.setAttribute("dot-placement", value);
  }

  get dots() {
    return normalizeBooleanAttribute(this, "dots", true);
  }

  set dots(value: boolean) {
    this.setAttribute("dots", String(value));
  }

  get draggable() {
    return normalizeBooleanAttribute(this, "draggable", false);
  }

  set draggable(value: boolean) {
    this.setAttribute("draggable", String(value));
  }

  get effect(): CarouselEffect {
    return getCarouselEffect(this);
  }

  set effect(value: CarouselEffect) {
    this.setAttribute("effect", value);
  }

  get infinite() {
    return normalizeBooleanAttribute(this, "infinite", true);
  }

  set infinite(value: boolean) {
    this.setAttribute("infinite", String(value));
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  goTo(index: number) {
    const count = this.getSlides().length;

    if (!count) {
      return;
    }

    const nextIndex = normalizeCarouselIndex(index, count, this.infinite);

    if (nextIndex === this.currentIndex) {
      return;
    }

    const loopDirection = getCarouselLoopDirection({
      count,
      currentIndex: this.currentIndex,
      effect: this.effect,
      index,
      infinite: this.infinite
    });

    if (loopDirection) {
      this.goToLoopEdge(nextIndex, loopDirection, count);
      return;
    }

    this.dispatchBeforeChange(this.currentIndex, nextIndex);
    this.currentIndex = nextIndex;
    this.visualIndex = nextIndex;
    this.syncState();
    this.dispatchAfterChange(nextIndex);
  }

  private render() {
    if (!this.isConnected) {
      return;
    }

    if (!this.rootElement) {
      this.initializeStructure();
    }

    this.setAttributeIfChanged("dot-placement", this.dotPlacement);
    this.setAttributeIfChanged("effect", this.effect);
    this.setAttributeIfChanged("data-axis", this.axis);
    this.syncState();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const elements = createCarouselElements({
      onNext: () => this.next(),
      onPointerDown: (event) => this.handlePointerDown(event),
      onPointerUp: (event) => this.handlePointerUp(event),
      onPrev: () => this.prev(),
      onSlotChange: () => this.syncState()
    });

    this.rootElement = elements.rootElement;
    this.viewportElement = elements.viewportElement;
    this.trackElement = elements.trackElement;
    this.slotElement = elements.slotElement;
    this.dotsElement = elements.dotsElement;
    this.prevButton = elements.prevButton;
    this.nextButton = elements.nextButton;
    shadowRoot.replaceChildren(this.rootElement);
    applyCarouselStyles(shadowRoot);
  }

  private syncState() {
    const slides = this.getSlides();
    const count = slides.length;

    this.currentIndex = Math.min(this.currentIndex, Math.max(0, count - 1));
    this.syncViewportSize(slides);
    this.visualIndex = Math.min(this.visualIndex, Math.max(0, count - 1));
    this.trackElement?.style.setProperty("--ds-carousel-index", String(this.visualIndex));
    this.prevButton!.hidden = !this.arrows || count <= 1;
    this.nextButton!.hidden = !this.arrows || count <= 1;
    this.dotsElement!.hidden = !this.dots || count <= 1;
    this.syncArrowButtons();
    slides.forEach((slide, index) => {
      slide.dataset.active = String(index === this.currentIndex);
    });
    this.renderDots(count);
  }

  private renderDots(count: number) {
    if (!this.dotsElement) {
      return;
    }

    if (count !== this.renderedDotCount) {
      this.dotsElement.replaceChildren(
        ...Array.from({ length: count }, (_, index) => createCarouselDot(index, this.currentIndex, () => this.goTo(index)))
      );
      this.renderedDotCount = count;
    }

    this.dotsElement.querySelectorAll<HTMLButtonElement>(".ds-carousel__dot").forEach((dot, index) => {
      dot.dataset.active = String(index === this.currentIndex);
    });
  }

  private handlePointerDown(event: PointerEvent) {
    if (!this.draggable) {
      return;
    }

    this.pointerStartX = event.clientX;
    this.pointerStartY = event.clientY;
  }

  private handlePointerUp(event: PointerEvent) {
    if (!this.draggable || this.pointerStartX === undefined || this.pointerStartY === undefined) {
      return;
    }

    const delta = getCarouselDragDelta({
      axis: this.axis,
      currentX: event.clientX,
      currentY: event.clientY,
      startX: this.pointerStartX,
      startY: this.pointerStartY
    });

    this.pointerStartX = undefined;
    this.pointerStartY = undefined;

    if (Math.abs(delta) < 32) {
      return;
    }

    if (delta < 0) {
      this.next();
    } else {
      this.prev();
    }
  }

  private goToLoopEdge(nextIndex: number, direction: CarouselLoopDirection, count: number) {
    const slides = this.getSlides();
    const current = this.currentIndex;

    if (this.loopTransitionActive || slides.length !== count || !this.trackElement) {
      return;
    }

    this.loopTransitionActive = true;
    this.dispatchBeforeChange(current, nextIndex);
    this.prepareLoopEdge(slides, direction, count);

    window.requestAnimationFrame(() => {
      this.currentIndex = nextIndex;
      this.visualIndex = direction === "forward" ? count - 1 : 0;
      this.syncState();
      this.finishLoopEdge(slides, nextIndex);
    });
  }

  private prepareLoopEdge(slides: HTMLElement[], direction: CarouselLoopDirection, count: number) {
    this.setInstantTransition(true);

    if (direction === "forward") {
      slides[0]!.style.order = String(count);
      this.visualIndex = count - 2;
    } else {
      slides[count - 1]!.style.order = "-1";
      this.visualIndex = 1;
    }

    this.syncState();
    void this.trackElement?.offsetWidth;
    this.setInstantTransition(false);
  }

  private finishLoopEdge(slides: HTMLElement[], nextIndex: number) {
    const finish = () => {
      this.setInstantTransition(true);
      this.resetSlideOrder(slides);
      this.visualIndex = nextIndex;
      this.syncState();
      void this.trackElement?.offsetWidth;

      window.requestAnimationFrame(() => {
        this.setInstantTransition(false);
        this.loopTransitionActive = false;
        this.dispatchAfterChange(nextIndex);
      });
    };

    this.runAfterTrackTransition(finish);
  }

  private runAfterTrackTransition(callback: () => void) {
    if (!this.trackElement) {
      callback();
      return;
    }

    let completed = false;
    const complete = () => {
      if (completed) {
        return;
      }

      completed = true;
      window.clearTimeout(timeoutId);
      this.trackElement?.removeEventListener("transitionend", complete);
      callback();
    };
    const timeoutId = window.setTimeout(complete, CAROUSEL_TRANSITION_FALLBACK_MS);

    this.trackElement.addEventListener("transitionend", complete, { once: true });
  }

  private resetSlideOrder(slides: HTMLElement[]) {
    slides.forEach((slide) => {
      slide.style.removeProperty("order");
    });
  }

  private syncArrowButtons() {
    if (!this.prevButton || !this.nextButton) {
      return;
    }

    syncCarouselArrowButtons({
      axis: this.axis,
      nextButton: this.nextButton,
      prevButton: this.prevButton
    });
  }

  private syncViewportSize(slides: HTMLElement[]) {
    if (!this.viewportElement) {
      return;
    }

    if (this.axis !== "vertical" || this.effect === "fade") {
      this.viewportElement.style.removeProperty("--ds-carousel-viewport-height");
      return;
    }

    const activeSlide = slides[this.currentIndex] ?? slides[0];
    const height = activeSlide?.getBoundingClientRect().height ?? 0;

    if (height > 0) {
      this.viewportElement.style.setProperty("--ds-carousel-viewport-height", `${height}px`);
    }
  }

  private setInstantTransition(enabled: boolean) {
    this.trackElement?.toggleAttribute("data-instant", enabled);
  }

  private getSlides() {
    return (this.slotElement?.assignedElements({ flatten: true }) ?? []).filter(
      (element): element is HTMLElement => element instanceof HTMLElement
    );
  }

  private syncAutoplay() {
    this.stopAutoplay();

    if (!this.autoplay || !this.isConnected) {
      return;
    }

    this.autoplayId = window.setInterval(() => this.next(), this.autoplaySpeed);
  }

  private stopAutoplay() {
    if (this.autoplayId !== undefined) {
      window.clearInterval(this.autoplayId);
      this.autoplayId = undefined;
    }
  }

  private dispatchBeforeChange(current: number, next: number) {
    this.dispatchEvent(
      new CustomEvent<CarouselChangeDetail>(CAROUSEL_BEFORE_CHANGE_EVENT, {
        bubbles: true,
        detail: { current, next }
      })
    );
  }

  private dispatchAfterChange(current: number) {
    this.dispatchEvent(
      new CustomEvent<CarouselChangeDetail>(CAROUSEL_AFTER_CHANGE_EVENT, {
        bubbles: true,
        detail: { current }
      })
    );
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }

  private get axis(): CarouselAxis {
    return getCarouselAxis(this.dotPlacement);
  }
}
