import type { Meta, StoryObj } from "@storybook/web-components-vite";

import { createCategoryOverview } from "./categoryOverview";

const meta: Meta = {
  title: "Components/Navigation/Overview",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Navigation 카테고리는 사용자가 화면과 정보 구조 사이를 이동하도록 돕는 컴포넌트를 모읍니다."
      }
    }
  },
  render: () =>
    createCategoryOverview({
      description: "메뉴, 탭, 경로 탐색처럼 이동과 위치 파악을 담당하는 컴포넌트가 이 카테고리에 배치됩니다.",
      title: "Navigation"
    })
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {};
