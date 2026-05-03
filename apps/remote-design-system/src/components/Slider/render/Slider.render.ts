import { getSliderPercent } from "../dom/Slider.dom";
import type { SliderElements, SliderSyncOptions } from "../types/Slider.types";

type SliderRenderHandlers = {
  onKeyDown: (event: KeyboardEvent) => void;
  onPointerDown: (event: PointerEvent) => void;
};

export function createSliderElements(handlers: SliderRenderHandlers): SliderElements {
  const root = document.createElement("div");
  const rail = document.createElement("div");
  const track = document.createElement("div");
  const lowerThumb = createThumb("lower", handlers.onKeyDown);
  const upperThumb = createThumb("upper", handlers.onKeyDown);
  const markList = document.createElement("div");

  root.className = "ds-slider";
  rail.className = "ds-slider__rail";
  track.className = "ds-slider__track";
  markList.className = "ds-slider__marks";
  rail.addEventListener("pointerdown", handlers.onPointerDown);
  rail.append(track, lowerThumb, upperThumb);
  root.append(rail, markList);

  return {
    lowerThumb,
    markList,
    rail,
    root,
    track,
    upperThumb
  };
}

export function syncSliderElements(elements: SliderElements, options: SliderSyncOptions) {
  const { disabled, included, marks, max, min, range, reverse, tooltip, value, vertical } = options;
  const lowerPercent = getSliderPercent(value[0], min, max, reverse);
  const upperPercent = getSliderPercent(value[1], min, max, reverse);
  const startPercent = range ? Math.min(lowerPercent, upperPercent) : reverse ? lowerPercent : 0;
  const endPercent = range ? Math.max(lowerPercent, upperPercent) : reverse ? 100 : lowerPercent;
  const trackSize = included ? endPercent - startPercent : 0;

  elements.root.dataset.vertical = String(vertical);
  elements.root.dataset.tooltip = tooltip;
  elements.root.dataset.dots = String(options.dots);

  syncThumb(elements.lowerThumb, {
    disabled,
    hidden: false,
    max,
    min,
    orientation: vertical ? "vertical" : "horizontal",
    percent: lowerPercent,
    value: value[0]
  });
  syncThumb(elements.upperThumb, {
    disabled,
    hidden: !range,
    max,
    min,
    orientation: vertical ? "vertical" : "horizontal",
    percent: upperPercent,
    value: value[1]
  });
  syncTrack(elements.track, {
    size: trackSize,
    start: startPercent,
    vertical
  });
  syncMarks(elements.markList, { marks, max, min, reverse, vertical });
}

function createThumb(value: "lower" | "upper", onKeyDown: (event: KeyboardEvent) => void) {
  const thumb = document.createElement("button");

  thumb.className = "ds-slider__thumb";
  thumb.dataset.thumb = value;
  thumb.type = "button";
  thumb.setAttribute("role", "slider");
  thumb.addEventListener("keydown", onKeyDown);

  return thumb;
}

function syncThumb(
  thumb: HTMLButtonElement,
  options: {
    disabled: boolean;
    hidden: boolean;
    max: number;
    min: number;
    orientation: "horizontal" | "vertical";
    percent: number;
    value: number;
  }
) {
  thumb.disabled = options.disabled;
  thumb.hidden = options.hidden;
  thumb.setAttribute("aria-disabled", String(options.disabled));
  thumb.setAttribute("aria-orientation", options.orientation);
  thumb.setAttribute("aria-valuemax", String(options.max));
  thumb.setAttribute("aria-valuemin", String(options.min));
  thumb.setAttribute("aria-valuenow", String(options.value));
  thumb.dataset.tooltip = String(options.value);

  if (options.orientation === "vertical") {
    thumb.style.left = "";
    thumb.style.bottom = `${options.percent}%`;
    return;
  }

  thumb.style.bottom = "";
  thumb.style.left = `${options.percent}%`;
}

function syncTrack(track: HTMLDivElement, options: { size: number; start: number; vertical: boolean }) {
  if (options.vertical) {
    track.style.left = "";
    track.style.width = "";
    track.style.bottom = `${options.start}%`;
    track.style.height = `${options.size}%`;
    return;
  }

  track.style.bottom = "";
  track.style.height = "";
  track.style.left = `${options.start}%`;
  track.style.width = `${options.size}%`;
}

function syncMarks(
  markList: HTMLDivElement,
  options: { marks: SliderSyncOptions["marks"]; max: number; min: number; reverse: boolean; vertical: boolean }
) {
  markList.replaceChildren(
    ...options.marks.map((mark) => {
      const markElement = document.createElement("span");
      const percent = getSliderPercent(mark.value, options.min, options.max, options.reverse);

      markElement.className = "ds-slider__mark";
      markElement.textContent = mark.label;

      if (options.vertical) {
        markElement.style.left = "";
        markElement.style.bottom = `${percent}%`;
      } else {
        markElement.style.bottom = "";
        markElement.style.left = `${percent}%`;
      }

      return markElement;
    })
  );
}
