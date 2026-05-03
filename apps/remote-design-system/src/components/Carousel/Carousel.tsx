import { ChevronLeft, ChevronRight, createElement as createLucideElement } from "lucide";

import { CAROUSEL_AFTER_CHANGE_EVENT, CAROUSEL_BEFORE_CHANGE_EVENT, CAROUSEL_OBSERVED_ATTRIBUTES } from "./constants/Carousel.constants";
import {
  getCarouselDotPlacement,
  getCarouselEffect,
  getPositiveNumberAttribute,
  normalizeBooleanAttribute
} from "./dom/Carousel.dom";
import { applyCarouselStyles } from "./Carousel.styles";
import type { CarouselChangeDetail, CarouselDotPlacement, CarouselEffect } from "./types/Carousel.types";

export class DsCarousel extends HTMLElement {
  static observedAttributes = CAROUSEL_OBSERVED_ATTRIBUTES;

  private autoplayId?: number;
  private currentIndex = 0;
  private dotsElement?: HTMLOListElement;
  private nextButton?: HTMLButtonElement;
  private pointerStartX?: number;
  private prevButton?: HTMLButtonElement;
  private rootElement?: HTMLDivElement;
  private slotElement?: HTMLSlotElement;
  private trackElement?: HTMLDivElement;

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

    const nextIndex = this.normalizeIndex(index, count);

    if (nextIndex === this.currentIndex) {
      return;
    }

    this.dispatchBeforeChange(this.currentIndex, nextIndex);
    this.currentIndex = nextIndex;
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
    this.syncState();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const viewport = document.createElement("div");

    this.rootElement = document.createElement("div");
    this.trackElement = document.createElement("div");
    this.slotElement = document.createElement("slot");
    this.dotsElement = document.createElement("ol");
    this.prevButton = this.createArrow("prev");
    this.nextButton = this.createArrow("next");
    this.rootElement.className = "ds-carousel";
    viewport.className = "ds-carousel__viewport";
    this.trackElement.className = "ds-carousel__track";
    this.dotsElement.className = "ds-carousel__dots";
    this.slotElement.addEventListener("slotchange", () => this.syncState());
    viewport.addEventListener("pointerdown", (event) => this.handlePointerDown(event));
    viewport.addEventListener("pointerup", (event) => this.handlePointerUp(event));
    this.trackElement.append(this.slotElement);
    viewport.append(this.trackElement, this.prevButton, this.nextButton);
    this.rootElement.append(viewport, this.dotsElement);
    shadowRoot.replaceChildren(this.rootElement);
    applyCarouselStyles(shadowRoot);
  }

  private syncState() {
    const slides = this.getSlides();
    const count = slides.length;

    this.currentIndex = Math.min(this.currentIndex, Math.max(0, count - 1));
    this.trackElement?.style.setProperty("--ds-carousel-index", String(this.currentIndex));
    this.prevButton!.hidden = !this.arrows || count <= 1;
    this.nextButton!.hidden = !this.arrows || count <= 1;
    this.dotsElement!.hidden = !this.dots || count <= 1;
    slides.forEach((slide, index) => {
      slide.dataset.active = String(index === this.currentIndex);
    });
    this.renderDots(count);
  }

  private renderDots(count: number) {
    if (!this.dotsElement) {
      return;
    }

    this.dotsElement.replaceChildren(
      ...Array.from({ length: count }, (_, index) => {
        const item = document.createElement("li");
        const dot = document.createElement("button");

        dot.className = "ds-carousel__dot";
        dot.type = "button";
        dot.dataset.active = String(index === this.currentIndex);
        dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
        dot.addEventListener("click", () => this.goTo(index));
        item.append(dot);

        return item;
      })
    );
  }

  private createArrow(direction: "next" | "prev") {
    const button = document.createElement("button");

    button.className = "ds-carousel__arrow";
    button.dataset.direction = direction;
    button.type = "button";
    button.setAttribute("aria-label", direction === "prev" ? "Previous slide" : "Next slide");
    button.append(this.createIcon(direction === "prev" ? ChevronLeft : ChevronRight));
    button.addEventListener("click", () => (direction === "prev" ? this.prev() : this.next()));

    return button;
  }

  private handlePointerDown(event: PointerEvent) {
    if (!this.draggable) {
      return;
    }

    this.pointerStartX = event.clientX;
  }

  private handlePointerUp(event: PointerEvent) {
    if (!this.draggable || this.pointerStartX === undefined) {
      return;
    }

    const delta = event.clientX - this.pointerStartX;

    this.pointerStartX = undefined;

    if (Math.abs(delta) < 32) {
      return;
    }

    if (delta < 0) {
      this.next();
    } else {
      this.prev();
    }
  }

  private normalizeIndex(index: number, count: number) {
    if (this.infinite) {
      return ((index % count) + count) % count;
    }

    return Math.min(Math.max(index, 0), count - 1);
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

  private createIcon(icon: Parameters<typeof createLucideElement>[0]) {
    return createLucideElement(icon, {
      "aria-hidden": "true",
      focusable: "false",
      height: 18,
      width: 18,
      "stroke-width": 2
    });
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}
