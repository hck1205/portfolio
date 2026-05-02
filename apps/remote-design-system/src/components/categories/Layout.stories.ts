import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./categories.stories.css";
import { createCategoryOverview } from "./categoryOverview";

const meta: Meta = {
  title: "Components/Layout/Overview",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Layout 카테고리는 페이지 구조, 영역 배치, 화면 골격을 구성하는 컴포넌트를 모읍니다."
      }
    }
  },
  render: () =>
    createCategoryOverview({
      description: "페이지와 섹션의 구조를 안정적으로 잡는 컴포넌트가 이 카테고리에 배치됩니다.",
      title: "Layout"
    })
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {};
