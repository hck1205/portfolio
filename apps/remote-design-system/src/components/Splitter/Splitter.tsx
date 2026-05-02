import {
  SPLITTER_DRAGGER_DOUBLE_CLICK_EVENT,
  SPLITTER_OBSERVED_ATTRIBUTES,
  SPLITTER_PANEL_OBSERVED_ATTRIBUTES,
  SPLITTER_PANEL_ELEMENT_NAME,
  SPLITTER_RESIZE_END_EVENT,
  SPLITTER_RESIZE_EVENT,
  SPLITTER_RESIZE_START_EVENT
} from "./constants/Splitter.constants";
import {
  clampSize,
  formatPixelSize,
  getSplitterOrientation,
  normalizeBooleanAttribute,
  parsePixelSize
} from "./dom/Splitter.dom";
import {
  createSplitterDragger
} from "./render/Splitter.render";
import { DsSplitterPanel } from "./SplitterPanel";
import type {
  SplitterDraggerDoubleClickDetail,
  SplitterOrientation,
  SplitterResizeDetail,
  SplitterResizeEndDetail,
  SplitterResizeStartDetail
} from "./types/Splitter.types";

type DragState = {
  dragger: HTMLButtonElement;
  index: number;
  nextSize: number;
  nextPanel: DsSplitterPanel;
  nextMax?: number;
  nextMin?: number;
  pointerId: number;
  previousPanel: DsSplitterPanel;
  previousMax?: number;
  previousMin?: number;
  previousSize: number;
  startPosition: number;
};

type PanelResizeContext = Pick<
  DragState,
  "nextMax" | "nextMin" | "nextPanel" | "previousMax" | "previousMin" | "previousPanel"
>;

const DEFAULT_DRAGGER_SIZE = 10;
const MIN_MEASURABLE_PANEL_SIZE = 1;
const PANEL_MEASUREMENT_TOLERANCE = 2;

export class DsSplitter extends HTMLElement {
  static observedAttributes = SPLITTER_OBSERVED_ATTRIBUTES;

  private dragState?: DragState;
  private readonly structureObserver = new MutationObserver(() => {
    this.syncStructure();
    this.syncPanels();
  });
  private readonly panelAttributeObserver = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.attributeName === "resizable")) {
      this.syncStructure();
    }

    this.syncPanels();
  });
  private panelSizes: string[] = [];

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.structureObserver.disconnect();
    this.panelAttributeObserver.disconnect();
    this.removeDragListeners();
  }

  attributeChangedCallback() {
    this.syncAttributes();
    this.syncPanels();
  }

  get lazy() {
    return normalizeBooleanAttribute(this, "lazy", false);
  }

  set lazy(value: boolean) {
    this.setAttribute("lazy", String(value));
  }

  get orientation(): SplitterOrientation {
    return getSplitterOrientation(this);
  }

  set orientation(value: SplitterOrientation) {
    this.setAttribute("orientation", value);
  }

  get vertical() {
    return normalizeBooleanAttribute(this, "vertical", false);
  }

  set vertical(value: boolean) {
    this.setAttribute("vertical", String(value));
  }

  private get panels() {
    return Array.from(this.children).filter(
      (child): child is DsSplitterPanel => child.localName === SPLITTER_PANEL_ELEMENT_NAME
    );
  }

  private handlePointerMove = (event: PointerEvent) => {
    const dragState = this.dragState;

    if (!dragState || event.pointerId !== dragState.pointerId) {
      return;
    }

    event.preventDefault();

    const delta = this.orientation === "vertical" ? event.clientY - dragState.startPosition : event.clientX - dragState.startPosition;
    this.applyDragDelta(dragState.index, dragState.previousSize + delta, dragState.nextSize - delta, !this.lazy, dragState);
  };

  private handlePointerUp = (event: PointerEvent) => {
    const dragState = this.dragState;

    if (!dragState || event.pointerId !== dragState.pointerId) {
      return;
    }

    if (this.lazy) {
      const delta =
        this.orientation === "vertical" ? event.clientY - dragState.startPosition : event.clientX - dragState.startPosition;
      this.applyDragDelta(dragState.index, dragState.previousSize + delta, dragState.nextSize - delta, true, dragState);
    }

    dragState.dragger.dataset.dragging = "false";
    if (dragState.dragger.hasPointerCapture(event.pointerId)) {
      dragState.dragger.releasePointerCapture(event.pointerId);
    }
    this.dispatchResizeEnd();
    this.removeDragListeners();
    this.dragState = undefined;
  };

  private render() {
    this.syncAttributes();
    this.syncStructure();
    this.syncPanels();
  }

  private syncAttributes() {
    this.setAttribute("role", "group");
    this.setAttributeIfChanged("orientation", this.orientation);
    this.toggleAttribute("data-lazy", this.lazy);
  }

  private syncStructure() {
    this.structureObserver.disconnect();
    this.panelAttributeObserver.disconnect();
    const panels = this.panels;

    for (const dragger of this.draggers) {
      dragger.remove();
    }

    panels.forEach((panel, index) => {
      const nextPanel = panels[index + 1];

      if (!nextPanel) {
        return;
      }

      const dragger = createSplitterDragger(index);

      dragger.disabled = !panel.resizable || !nextPanel.resizable;
      dragger.addEventListener("pointerdown", (event) => {
        this.startDrag(event, index, dragger);
      });
      dragger.addEventListener("dblclick", () => {
        this.resetPanelPair(index);
      });
      dragger.addEventListener("keydown", (event) => {
        this.handleDraggerKeyDown(event, index);
      });
      panel.after(dragger);
    });

    if (this.isConnected) {
      this.observePanels();
    }
  }

  private syncPanels() {
    const panels = this.panels;

    if (panels.length === 0) {
      this.panelSizes = [];
      return;
    }

    this.panelSizes = panels.map((panel, index) => panel.size || this.panelSizes[index] || panel.defaultSize || "");
    panels.forEach((panel, index) => {
      panel.syncFromParent(this.panelSizes[index]);
    });
  }

  private freezePanelSizes() {
    const panels = this.panels;
    const panelSizes = this.resolvePanelPixelSizes(panels);

    if (!panelSizes) {
      return undefined;
    }

    this.panelSizes = panelSizes.map(formatPixelSize);
    panels.forEach((panel, index) => {
      panel.syncFromParent(this.panelSizes[index]);
    });

    return panelSizes;
  }

  private get draggers() {
    return Array.from(this.children).filter(
      (child): child is HTMLButtonElement => child instanceof HTMLButtonElement && child.dataset.splitterDragger !== undefined
    );
  }

  private startDrag(event: PointerEvent, index: number, dragger: HTMLButtonElement) {
    if (dragger.disabled) {
      return;
    }

    const panelSizes = this.freezePanelSizes();
    const panels = this.panels;
    const previousPanel = panels[index];
    const nextPanel = panels[index + 1];
    const previousSize = panelSizes?.[index];
    const nextSize = panelSizes?.[index + 1];

    if (!panelSizes || !previousPanel || !nextPanel || previousSize === undefined || nextSize === undefined) {
      return;
    }

    const availableSize = this.getAvailablePanelSize();

    if (availableSize <= 0) {
      return;
    }

    const constraints = this.getPanelConstraints(previousPanel, nextPanel, availableSize);

    event.preventDefault();
    dragger.setPointerCapture(event.pointerId);
    dragger.dataset.dragging = "true";
    this.dragState = {
      dragger,
      index,
      ...constraints,
      nextSize,
      nextPanel,
      pointerId: event.pointerId,
      previousPanel,
      previousSize,
      startPosition: this.orientation === "vertical" ? event.clientY : event.clientX
    };
    this.ownerDocument.addEventListener("pointermove", this.handlePointerMove);
    this.ownerDocument.addEventListener("pointerup", this.handlePointerUp);
    this.ownerDocument.addEventListener("pointercancel", this.handlePointerUp);
    this.dispatchResizeStart();
  }

  private handleDraggerKeyDown(event: KeyboardEvent, index: number) {
    const isVertical = this.orientation === "vertical";
    const backwardKey = isVertical ? "ArrowUp" : "ArrowLeft";
    const forwardKey = isVertical ? "ArrowDown" : "ArrowRight";

    if (event.key !== backwardKey && event.key !== forwardKey) {
      return;
    }

    const [previousSize, nextSize] = this.getPanelPairPixelSizes(index);

    if (previousSize === undefined || nextSize === undefined) {
      return;
    }

    const delta = event.key === forwardKey ? 10 : -10;

    event.preventDefault();
    this.applyDragDelta(index, previousSize + delta, nextSize - delta, true);
    this.dispatchResizeEnd();
  }

  private applyDragDelta(
    index: number,
    nextPreviousSize: number,
    nextNextSize: number,
    commit: boolean,
    context?: PanelResizeContext
  ) {
    const panels = context ? undefined : this.panels;
    const previousPanel = context?.previousPanel ?? panels?.[index];
    const nextPanel = context?.nextPanel ?? panels?.[index + 1];

    if (!previousPanel || !nextPanel) {
      return;
    }

    const constraints =
      context ?? this.getPanelConstraints(previousPanel, nextPanel, this.getAvailablePanelSize());
    const { nextMax, nextMin, previousMax, previousMin } = constraints;
    let previousSize = clampSize(nextPreviousSize, previousMin, previousMax);
    let nextSize = clampSize(nextNextSize, nextMin, nextMax);
    const totalSize = nextPreviousSize + nextNextSize;

    if (previousSize + nextSize !== totalSize) {
      nextSize = clampSize(totalSize - previousSize, nextMin, nextMax);
      previousSize = clampSize(totalSize - nextSize, previousMin, previousMax);
    }

    const nextSizes = [...this.panelSizes];

    nextSizes[index] = formatPixelSize(previousSize);
    nextSizes[index + 1] = formatPixelSize(nextSize);

    if (commit) {
      this.panelSizes = nextSizes;
      previousPanel.syncFromParent(nextSizes[index]);
      nextPanel.syncFromParent(nextSizes[index + 1]);
      this.dispatchResize();
    }
  }

  private getPanelConstraints(previousPanel: DsSplitterPanel, nextPanel: DsSplitterPanel, availableSize: number) {
    return {
      nextMax: parsePixelSize(nextPanel.max, availableSize),
      nextMin: parsePixelSize(nextPanel.min, availableSize),
      previousMax: parsePixelSize(previousPanel.max, availableSize),
      previousMin: parsePixelSize(previousPanel.min, availableSize)
    };
  }

  private resetPanelPair(index: number) {
    const panels = this.panels;
    const previousPanel = panels[index];
    const nextPanel = panels[index + 1];

    if (!previousPanel || !nextPanel) {
      return;
    }

    this.panelSizes[index] = previousPanel.defaultSize;
    this.panelSizes[index + 1] = nextPanel.defaultSize;
    previousPanel.syncFromParent(this.panelSizes[index]);
    nextPanel.syncFromParent(this.panelSizes[index + 1]);
    this.dispatchResize();
    this.dispatchEvent(
      new CustomEvent<SplitterDraggerDoubleClickDetail>(SPLITTER_DRAGGER_DOUBLE_CLICK_EVENT, {
        bubbles: true,
        detail: {
          index,
          sizes: this.panelSizes
        }
      })
    );
  }

  private getPanelPairPixelSizes(index: number): [number | undefined, number | undefined] {
    const panels = this.panels;
    const previousPanel = panels[index];
    const nextPanel = panels[index + 1];

    if (!previousPanel || !nextPanel) {
      return [undefined, undefined];
    }

    const panelSizes = this.resolvePanelPixelSizes(panels);
    const previousSize = panelSizes?.[index];
    const nextSize = panelSizes?.[index + 1];

    return [previousSize, nextSize];
  }

  /**
   * Reads the current flex layout only when the measured panels account for the
   * wrapper-owned available size. This prevents pre-layout or collapsed reads
   * from being committed as 0px panel sizes on drag start.
   */
  private resolvePanelPixelSizes(panels = this.panels) {
    const availableSize = this.getAvailablePanelSize();

    if (panels.length === 0 || availableSize <= 0) {
      return undefined;
    }

    const measuredSizes = panels.map((panel) => this.getElementSize(panel));
    const measuredTotal = measuredSizes.reduce((total, size) => total + size, 0);
    const measurementTolerance = Math.max(PANEL_MEASUREMENT_TOLERANCE, panels.length * PANEL_MEASUREMENT_TOLERANCE);
    const hasStableMeasurements =
      measuredSizes.every((size) => Number.isFinite(size) && size >= MIN_MEASURABLE_PANEL_SIZE) &&
      Math.abs(measuredTotal - availableSize) <= measurementTolerance;

    if (hasStableMeasurements) {
      return measuredSizes;
    }

    return this.resolveDeclaredPanelSizes(panels, availableSize);
  }

  /**
   * Falls back to the public size/default-size contract, then distributes the
   * remaining wrapper space across flexible panels.
   */
  private resolveDeclaredPanelSizes(panels: DsSplitterPanel[], availableSize: number) {
    const sizes: Array<number | undefined> = panels.map((panel, index) => {
      const preferredSize = panel.size || this.panelSizes[index] || panel.defaultSize;
      const parsedSize = parsePixelSize(preferredSize, availableSize);

      return typeof parsedSize === "number" && Number.isFinite(parsedSize) ? parsedSize : undefined;
    });
    const flexibleIndexes = sizes.flatMap((size, index) => (size === undefined ? [index] : []));
    const fixedTotal = sizes.reduce<number>((total, size) => total + (size ?? 0), 0);

    if (flexibleIndexes.length > 0) {
      const flexibleSize = Math.max(0, availableSize - fixedTotal) / flexibleIndexes.length;

      for (const index of flexibleIndexes) {
        sizes[index] = flexibleSize;
      }
    }

    const resolvedSizes = sizes.map((size) => size ?? 0);
    const resolvedTotal = resolvedSizes.reduce((total, size) => total + size, 0);

    if (resolvedTotal <= 0) {
      return panels.map(() => availableSize / panels.length);
    }

    if (resolvedTotal > availableSize) {
      const scale = availableSize / resolvedTotal;

      return resolvedSizes.map((size) => size * scale);
    }

    if (flexibleIndexes.length === 0 && resolvedTotal < availableSize) {
      const remainder = (availableSize - resolvedTotal) / panels.length;

      return resolvedSizes.map((size) => size + remainder);
    }

    return resolvedSizes;
  }

  private getAvailablePanelSize() {
    const containerSize = this.getContainerSize();

    if (containerSize <= 0) {
      return 0;
    }

    const draggerSize = this.draggers.reduce((total, dragger) => total + this.getElementSize(dragger), 0);

    return Math.max(0, containerSize - (draggerSize || this.draggers.length * DEFAULT_DRAGGER_SIZE));
  }

  private getContainerSize() {
    const rect = this.getBoundingClientRect();

    return this.orientation === "vertical" ? rect.height : rect.width;
  }

  private getElementSize(element: HTMLElement) {
    const rect = element.getBoundingClientRect();

    return this.orientation === "vertical" ? rect.height : rect.width;
  }

  private dispatchResizeStart() {
    this.dispatchEvent(
      new CustomEvent<SplitterResizeStartDetail>(SPLITTER_RESIZE_START_EVENT, {
        bubbles: true,
        detail: { sizes: this.panelSizes }
      })
    );
  }

  private dispatchResize() {
    this.dispatchEvent(
      new CustomEvent<SplitterResizeDetail>(SPLITTER_RESIZE_EVENT, {
        bubbles: true,
        detail: { sizes: this.panelSizes }
      })
    );
  }

  private dispatchResizeEnd() {
    this.dispatchEvent(
      new CustomEvent<SplitterResizeEndDetail>(SPLITTER_RESIZE_END_EVENT, {
        bubbles: true,
        detail: { sizes: this.panelSizes }
      })
    );
  }

  private removeDragListeners() {
    this.ownerDocument.removeEventListener("pointermove", this.handlePointerMove);
    this.ownerDocument.removeEventListener("pointerup", this.handlePointerUp);
    this.ownerDocument.removeEventListener("pointercancel", this.handlePointerUp);
  }

  private observePanels() {
    this.structureObserver.observe(this, {
      childList: true
    });

    for (const panel of this.panels) {
      this.panelAttributeObserver.observe(panel, {
        attributeFilter: [...SPLITTER_PANEL_OBSERVED_ATTRIBUTES],
        attributes: true
      });
    }
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}
