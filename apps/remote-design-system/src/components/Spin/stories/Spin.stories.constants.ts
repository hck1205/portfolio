import type { SpinSize } from "../types/Spin.types";
import type { SpinStoryArgs } from "./Spin.stories.types";

export const SPIN_SIZE_OPTIONS = ["small", "middle", "large"] satisfies SpinSize[];

export const SPIN_DEFAULT_ARGS = {
  delay: 0,
  fullscreen: false,
  size: "middle",
  spinning: true,
  tip: ""
} satisfies SpinStoryArgs;

export const SPIN_STORY_DESCRIPTIONS = {
  customSemanticDomStyling: "노출된 semantic part를 스타일링해 indicator와 안내 문구의 표현을 조정합니다.",
  customSpinningIndicator: "기본 spinner 대신 다른 형태의 로딩 indicator를 사용하는 예시입니다.",
  delay: "짧은 비동기 요청에서 로딩 표시가 깜빡이지 않도록 일정 시간 이후에 Spin을 표시합니다.",
  default: "가벼운 비동기 작업에서 사용하는 기본 로딩 상태입니다.",
  embeddedMode: "컨텐츠 블록 위에 Spin을 덮어 해당 영역만 로딩 중임을 보여줍니다.",
  fullscreen: "화면 전체를 흐리게 처리하고 중앙에 spinner를 배치하는 페이지 레벨 로딩 상태를 미리 보여줍니다.",
  progress: "정해진 진행률, 자동 로딩, 동적으로 변하는 진행률을 함께 보여줍니다.",
  sizes: "small, middle, large 크기의 spinner를 일렬로 나열해 비교합니다.",
  tip: "로딩 중인 작업의 상태를 spinner 아래 안내 문구로 함께 표시합니다."
};

export const SPIN_COMPONENT_DESCRIPTION =
  "Spin은 페이지나 컨텐츠 블록이 비동기 작업을 기다리는 중임을 사용자에게 알려주는 로딩 피드백 컴포넌트입니다.";
