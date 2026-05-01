import type { Meta, StoryObj } from "@storybook/web-components-vite";

import { createCategoryOverview } from "./categoryOverview";

const meta: Meta = {
  title: "Components/Data Entry/Overview",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Data Entry 카테고리는 사용자가 값을 입력하거나 선택하고 제출하는 컴포넌트를 모읍니다."
      }
    }
  },
  render: () =>
    createCategoryOverview({
      description: "입력, 선택, 토글처럼 사용자 데이터를 받는 컴포넌트가 이 카테고리에 배치됩니다.",
      title: "Data Entry"
    })
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {};
