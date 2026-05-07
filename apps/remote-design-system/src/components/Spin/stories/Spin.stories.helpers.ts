import clsx from "classnames";

import { SPIN_DEFAULT_ARGS } from "./Spin.stories.constants";
import type { SpinStoryArgs } from "./Spin.stories.types";

type SpinStoryOverrides = Partial<SpinStoryArgs>;

export function createDocsDescription(story: string) {
  return { docs: { description: { story } } };
}

export function createSpin(overrides: SpinStoryOverrides = {}) {
  const args = { ...SPIN_DEFAULT_ARGS, ...overrides };
  const spin = document.createElement("ds-spin");

  spin.setAttribute("size", args.size);
  spin.setAttribute("delay", String(args.delay));
  spin.toggleAttribute("fullscreen", args.fullscreen);

  if (!args.spinning) {
    spin.setAttribute("spinning", "false");
  }

  if (args.tip) {
    spin.setAttribute("tip", args.tip);
  }

  return spin;
}

export function createFrame(...children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-spin-story-frame";
  frame.append(...children);

  return frame;
}

export function createRow(...children: HTMLElement[]) {
  const row = document.createElement("div");

  row.className = "ds-spin-story-row";
  row.append(...children);

  return row;
}

export function createSizeItem(label: string, spin: HTMLElement) {
  const item = document.createElement("div");
  const labelElement = document.createElement("span");

  item.className = "ds-spin-story-size-item";
  labelElement.textContent = label;
  item.append(spin, labelElement);

  return item;
}

export function createContentBlock() {
  const content = document.createElement("div");

  content.className = "ds-spin-story-content-block";

  return content;
}

export function createAlert(title = "알림 메시지 제목", description = "현재 상태를 이해하는 데 필요한 추가 정보를 제공합니다.") {
  const alert = document.createElement("div");
  const titleElement = document.createElement("strong");
  const descriptionElement = document.createElement("span");

  alert.className = "ds-spin-story-alert";
  titleElement.textContent = title;
  descriptionElement.textContent = description;
  alert.append(titleElement, descriptionElement);

  return alert;
}

export function createSpinOverlay(spin: HTMLElement) {
  const overlay = document.createElement("div");

  overlay.className = "ds-spin-story-overlay";
  overlay.append(spin);

  return overlay;
}

export function createEmbeddedBlock(spin: HTMLElement, content = createContentBlock()) {
  const block = document.createElement("div");

  block.className = "ds-spin-story-embedded";
  block.append(content, createSpinOverlay(spin));

  return block;
}

export function createControls(...children: HTMLElement[]) {
  const controls = document.createElement("div");

  controls.className = "ds-spin-story-controls";
  controls.append(...children);

  return controls;
}

export function createSwitch(checked: boolean, onChange: (checked: boolean) => void) {
  const control = document.createElement("div");
  const switchElement = document.createElement("ds-switch");
  const text = document.createElement("span");

  control.className = "ds-spin-story-switch";
  text.textContent = "Loading state:";
  switchElement.setAttribute("checked-children", "ON");
  switchElement.setAttribute("unchecked-children", "OFF");
  syncSwitchChecked(switchElement, checked);
  switchElement.addEventListener("ds-switch-change", (event) => {
    onChange((event as CustomEvent<{ checked: boolean }>).detail.checked);
  });
  text.addEventListener("click", () => {
    const nextChecked = !switchElement.hasAttribute("checked");

    syncSwitchChecked(switchElement, nextChecked);
    onChange(nextChecked);
  });
  control.append(text, switchElement);

  return control;
}

export function setSpinSpinning(spin: HTMLElement, spinning: boolean) {
  spin.setAttribute("spinning", String(spinning));
}

function syncSwitchChecked(switchElement: HTMLElement, checked: boolean) {
  switchElement.toggleAttribute("checked", checked);
  switchElement.toggleAttribute("value", checked);
}

export function createSizeComparison(items: Array<{ label: string; spin: HTMLElement }>, className?: string) {
  const row = createRow(...items.map((item) => createSizeItem(item.label, item.spin)));

  row.className = clsx("ds-spin-story-row", "ds-spin-story-row--sizes", className);

  return row;
}
