import type { Meta, StoryObj } from "@storybook/web-components-vite";

import { createCategoryOverview } from "./categoryOverview";

const meta: Meta = {
  title: "Components/Other/Overview",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Other 카테고리는 주요 분류에 속하지 않지만 공통으로 재사용되는 컴포넌트를 모읍니다."
      }
    }
  },
  render: () =>
    createCategoryOverview({
      description: "특정 도메인 분류보다 범용성이 큰 보조 컴포넌트가 이 카테고리에 배치됩니다.",
      title: "Other"
    })
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {};
