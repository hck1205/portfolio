import type { EmptyStoryArgs } from "./Empty.storyTypes";

export const defaultEmptyStoryArgs = {
  description: "No data",
  image: "default",
  size: "middle"
} satisfies EmptyStoryArgs;

export const emptyStoryDescriptions = {
  default: "데이터가 없을 때 사용자에게 빈 상태를 명확하고 부드럽게 안내합니다.",
  simple: "작은 입력, 표, 목록처럼 제한된 공간에서는 simple 이미지를 사용해 밀도를 낮출 수 있습니다.",
  customize: "설명, 아이콘, 액션 영역을 함께 조합해 다음 행동을 안내할 수 있습니다.",
  components: "Select, TreeSelect, Cascader, Transfer, Table, List처럼 데이터가 비어 있는 화면에 Empty를 일관되게 배치합니다.",
  noDescription: "description=false를 사용하면 설명 없이 아이콘만 표시할 수 있습니다."
};

export const emptyComponentDescription =
  "Empty는 데이터가 없는 영역에 표시하는 중앙 정렬 placeholder입니다. 기본 아이콘과 simple 아이콘, 커스텀 이미지 URL, 설명 문구, 설명 숨김, 크기, footer 액션을 지원합니다.";

export const emptySizeOptions = ["large", "middle", "small"] as const;
