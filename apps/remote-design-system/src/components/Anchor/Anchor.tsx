import {
  ANCHOR_CHANGE_EVENT,
  ANCHOR_CLICK_EVENT,
  ANCHOR_LINK_ELEMENT_NAME,
  ANCHOR_OBSERVED_ATTRIBUTES,
  ANCHOR_SCROLL_SETTLE_DELAY
} from "./constants/Anchor.constants";
import {
  type AnchorScrollContainer,
  getAnchorTargetMetrics,
  getAnchorViewportMetrics,
  getAnchorDirection,
  getHashFromHref,
  getNumericAttribute,
  getScrollContainer,
  getTargetElementFromHash,
  isScrollContainerAtEnd,
  normalizeBooleanAttribute,
  scrollToHash
} from "./dom/Anchor.dom";
import { resolveAnchorActiveHref } from "./logic/Anchor.active";
import {
  applyAnchorStyles,
  createAnchorElements,
  syncAnchorElements,
  type AnchorElements
} from "./render/Anchor.render";
import type { AnchorChangeDetail, AnchorClickDetail, AnchorDirection } from "./types/Anchor.types";
import { DsAnchorLink } from "./AnchorLink";

export class DsAnchor extends HTMLElement {
  static observedAttributes = ANCHOR_OBSERVED_ATTRIBUTES;

  private elements?: AnchorElements;
  private pendingActiveHref = "";
  private pendingActiveTimer = 0;
  private scrollContainer?: AnchorScrollContainer;
  private scrollSettleTimer = 0;
  private scrollFrame = 0;

  connectedCallback() {
    this.render();
    this.addEventListener(ANCHOR_CLICK_EVENT, this.handleAnchorClick as EventListener);
    this.attachScrollListeners();
    this.scheduleActiveHrefSync({ settled: true });
  }

  disconnectedCallback() {
    this.removeEventListener(ANCHOR_CLICK_EVENT, this.handleAnchorClick as EventListener);
    this.detachScrollListeners();

    if (this.scrollFrame) {
      window.cancelAnimationFrame(this.scrollFrame);
      this.scrollFrame = 0;
    }

    if (this.scrollSettleTimer) {
      window.clearTimeout(this.scrollSettleTimer);
      this.scrollSettleTimer = 0;
    }

    this.clearPendingActiveHref();
  }

  attributeChangedCallback() {
    this.render();
  }

  get activeHref() {
    return this.getAttribute("active-href") ?? "";
  }

  set activeHref(value: string) {
    this.syncNullableAttribute("active-href", value);
  }

  get direction(): AnchorDirection {
    return getAnchorDirection(this);
  }

  set direction(value: AnchorDirection) {
    this.setAttribute("direction", value);
  }

  get offset() {
    return getNumericAttribute(this, "offset", 0);
  }

  set offset(value: number) {
    this.setAttribute("offset", String(value));
  }

  get replace() {
    return normalizeBooleanAttribute(this, "replace", false);
  }

  set replace(value: boolean) {
    this.toggleAttribute("replace", value);
  }

  get targetOffset() {
    return getNumericAttribute(this, "target-offset", this.offset);
  }

  set targetOffset(value: number) {
    this.setAttribute("target-offset", String(value));
  }

  private handleAnchorClick = (event: CustomEvent<AnchorClickDetail>) => {
    const linkElement = event.target;

    if (!(linkElement instanceof DsAnchorLink) || !this.contains(linkElement)) {
      return;
    }

    const href = event.detail.href;
    const hash = getHashFromHref(href);

    if (!hash) {
      return;
    }

    event.detail.nativeEvent.preventDefault();

    if (scrollToHash(hash, this.targetOffset, this.getCurrentScrollContainer())) {
      this.holdActiveHrefDuringScroll(href);
      this.updateHistory(hash);
      this.setActiveHref(href);
    }
  };

  private handleScroll = () => {
    this.scheduleActiveHrefSync();
    this.scheduleSettledActiveHrefSync();
  };

  private scheduleActiveHrefSync = ({ settled = false }: { settled?: boolean } = {}) => {
    if (this.scrollFrame) {
      return;
    }

    this.scrollFrame = window.requestAnimationFrame(() => {
      this.scrollFrame = 0;
      this.syncActiveHrefFromScroll({ settled });
    });
  };

  private scheduleSettledActiveHrefSync() {
    if (this.scrollSettleTimer) {
      window.clearTimeout(this.scrollSettleTimer);
    }

    this.scrollSettleTimer = window.setTimeout(() => {
      this.scrollSettleTimer = 0;
      this.scheduleActiveHrefSync({ settled: true });
    }, ANCHOR_SCROLL_SETTLE_DELAY);
  }

  private render() {
    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
    this.syncLinks();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createAnchorElements();
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyAnchorStyles(shadowRoot);
  }

  private syncAttributes() {
    if (!this.elements) {
      return;
    }

    this.setAttributeIfChanged("direction", this.direction);
    syncAnchorElements({
      direction: this.direction,
      elements: this.elements
    });
  }

  private syncLinks() {
    const links = this.getAnchorLinks();

    for (const link of links) {
      link.syncFromAnchor({
        active: Boolean(this.activeHref) && link.href === this.activeHref,
        direction: this.direction
      });
    }
  }

  private syncActiveHrefFromScroll({ settled = false }: { settled?: boolean } = {}) {
    const links = this.getAnchorLinks();
    const scrollContainer = this.getCurrentScrollContainer();
    const offset = this.targetOffset;
    const viewportMetrics = getAnchorViewportMetrics(scrollContainer, offset);
    const candidates = links
      .map((link) => {
        const hash = getHashFromHref(link.href);
        const targetElement = getTargetElementFromHash(hash, scrollContainer);

        if (!targetElement) {
          return null;
        }

        const targetMetrics = getAnchorTargetMetrics(targetElement, viewportMetrics);

        return {
          ...targetMetrics,
          href: link.href,
          link
        };
      })
      .filter(
        (candidate): candidate is { distance: number; href: string; link: DsAnchorLink; visibleSize: number } =>
          Boolean(candidate)
      );

    if (!candidates.length) {
      return;
    }

    const activeResult = resolveAnchorActiveHref({
      candidates,
      isAtEnd: isScrollContainerAtEnd(scrollContainer),
      pendingHref: this.pendingActiveHref,
      settled
    });

    if (activeResult.shouldClearPending) {
      this.clearPendingActiveHref();
    }

    if (activeResult.href) {
      this.setActiveHref(activeResult.href);
    }
  }

  private holdActiveHrefDuringScroll(href: string) {
    this.clearPendingActiveHref();
    this.pendingActiveHref = href;
    this.pendingActiveTimer = window.setTimeout(() => {
      this.clearPendingActiveHref();
      this.scheduleActiveHrefSync({ settled: true });
    }, 1000);
  }

  private clearPendingActiveHref() {
    this.pendingActiveHref = "";

    if (this.pendingActiveTimer) {
      window.clearTimeout(this.pendingActiveTimer);
      this.pendingActiveTimer = 0;
    }
  }

  private setActiveHref(nextHref: string) {
    const previousHref = this.activeHref;

    if (previousHref === nextHref) {
      return;
    }

    this.activeHref = nextHref;
    this.dispatchEvent(
      new CustomEvent<AnchorChangeDetail>(ANCHOR_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          href: nextHref,
          previousHref
        }
      })
    );
  }

  private updateHistory(hash: string) {
    const nextUrl = `${window.location.pathname}${window.location.search}${hash}`;

    if (this.replace) {
      window.history.replaceState(null, "", nextUrl);
      return;
    }

    window.history.pushState(null, "", nextUrl);
  }

  private attachScrollListeners() {
    this.scrollContainer = getScrollContainer(this);
    this.scrollContainer.addEventListener("scroll", this.handleScroll, { passive: true });
    window.addEventListener("resize", this.handleScroll);
  }

  private detachScrollListeners() {
    this.scrollContainer?.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleScroll);
    this.scrollContainer = undefined;
  }

  private getCurrentScrollContainer() {
    if (!this.scrollContainer) {
      this.scrollContainer = getScrollContainer(this);
    }

    return this.scrollContainer;
  }

  private getAnchorLinks() {
    return Array.from(this.querySelectorAll(ANCHOR_LINK_ELEMENT_NAME)).filter(
      (link): link is DsAnchorLink => link instanceof DsAnchorLink
    );
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
