import { defineDsSwitch } from "../../Switch";
import { defineDsSpin } from "..";
import { SPIN_SIZE_OPTIONS } from "./Spin.stories.constants";
import {
  createAlert,
  createControls,
  createEmbeddedBlock,
  createFrame,
  createRow,
  createSizeComparison,
  createSizeItem,
  createSpin,
  createSpinOverlay,
  createSwitch,
  setSpinSpinning
} from "./Spin.stories.helpers";
import type { SpinStoryArgs } from "./Spin.stories.types";

const DYNAMIC_PROGRESS_INTERVAL_MS = 180;
const PROGRESS_STEP = 5;
const STATIC_PROGRESS_ITEMS = [
  { label: "30%", percent: "30%" },
  { label: "70%", percent: "70%" },
  { label: "auto" }
] as const;

export function renderDefault(args: SpinStoryArgs) {
  defineDsSpin();

  return createFrame(createSpin(args));
}

export function renderSizes() {
  defineDsSpin();

  return createFrame(
    createSizeComparison(
      SPIN_SIZE_OPTIONS.map((size) => ({ label: size, spin: createSpin({ size }) })),
      "ds-spin-story-row--inline-sizes"
    )
  );
}

export function renderEmbeddedMode() {
  defineDsSpin();
  defineDsSwitch();

  const spin = createSpin({ size: "large", tip: "Loading" });
  const embedded = createEmbeddedBlock(spin, createAlert());
  const overlay = embedded.querySelector<HTMLElement>(".ds-spin-story-overlay");
  const switchControl = createSwitch(true, (checked) => {
    setSpinSpinning(spin, checked);

    if (overlay) {
      overlay.hidden = !checked;
    }
  });

  return createFrame(embedded, createControls(switchControl));
}

export function renderTip() {
  defineDsSpin();

  const tipExample = createEmbeddedBlock(
    createSpin({ size: "large", tip: "데이터를 불러오는 중입니다" }),
    createAlert("데이터 동기화", "최신 상태를 가져오는 동안 안내 문구와 함께 로딩 상태를 표시합니다.")
  );

  tipExample.classList.add("ds-spin-story-tip-example");

  return createFrame(tipExample);
}

export function renderDelay() {
  defineDsSpin();

  const delayedSpin = createSpin({ delay: 800 });

  delayedSpin.className = "ds-spin-story-delayed";

  return createFrame(delayedSpin);
}

export function renderCustomSpinningIndicator() {
  defineDsSpin();

  return createFrame(
    createSizeComparison(
      SPIN_SIZE_OPTIONS.map((size) => ({ label: size, spin: createSpin({ size }) })),
      "ds-spin-story-row--custom-indicator"
    )
  );
}

export function renderProgress() {
  defineDsSpin();

  const dynamicSpin = createSpin({ size: "large", tip: "0%" });
  const dynamicItem = createSizeItem("dynamic 0%", dynamicSpin);
  const row = createRow(...createStaticProgressItems());
  const frame = createFrame(row);

  row.classList.add("ds-spin-story-row--sizes", "ds-spin-story-row--progress");
  dynamicItem.classList.add("ds-spin-story-progress-dynamic");
  setProgressPercent(dynamicItem, dynamicSpin, 0);
  row.append(dynamicItem);
  startDynamicProgress(frame, dynamicItem, dynamicSpin);

  return frame;
}

export function renderFullscreen() {
  defineDsSpin();

  const preview = document.createElement("div");
  const screen = createAlert("페이지 로딩", "Fullscreen 모드는 화면을 흐리게 처리하고 spinner를 중앙에 배치합니다.");
  const spin = createSpin({ size: "large", tip: "Loading" });

  preview.className = "ds-spin-story-fullscreen-preview";
  screen.className = "ds-spin-story-alert ds-spin-story-alert--muted";
  preview.append(screen, createSpinOverlay(spin));

  return createFrame(preview);
}

export function renderCustomSemanticDomStyling() {
  defineDsSpin();

  const spin = createSpin({ size: "large", tip: "Loading" });

  spin.className = "ds-spin-story-custom";

  return createFrame(
    createEmbeddedBlock(
      spin,
      createAlert("Custom semantic DOM", "root, indicator, tip part를 각각 독립적으로 스타일링할 수 있습니다.")
    )
  );
}

function createStaticProgressItems() {
  return STATIC_PROGRESS_ITEMS.map((progressItem) => {
    const item = createSizeItem(progressItem.label, createSpin({ size: "large", tip: progressItem.label }));

    if ("percent" in progressItem) {
      item.classList.add("ds-spin-story-progress-determinate");
      item.style.setProperty("--ds-spin-story-progress-percent", progressItem.percent);
    }

    return item;
  });
}

function startDynamicProgress(frame: HTMLElement, dynamicItem: HTMLElement, dynamicSpin: HTMLElement) {
  let percent = 0;
  let direction = 1;
  const intervalId = window.setInterval(() => {
    percent += direction * PROGRESS_STEP;

    if (percent >= 100 || percent <= 0) {
      direction *= -1;
      percent = Math.max(0, Math.min(100, percent));
    }

    setProgressPercent(dynamicItem, dynamicSpin, percent);
  }, DYNAMIC_PROGRESS_INTERVAL_MS);

  const cleanupObserver = new MutationObserver(() => {
    if (!frame.isConnected) {
      window.clearInterval(intervalId);
      cleanupObserver.disconnect();
    }
  });

  cleanupObserver.observe(document.body, { childList: true, subtree: true });
}

function setProgressPercent(item: HTMLElement, spin: HTMLElement, percent: number) {
  item.style.setProperty("--ds-spin-story-progress-percent", `${percent}%`);
  spin.setAttribute("tip", `${percent}%`);
  item.querySelector("span")?.replaceChildren(`dynamic ${percent}%`);
}
