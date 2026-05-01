import type { Meta, StoryObj } from "@storybook/web-components-vite";

import { createCategoryOverview } from "./categoryOverview";

const meta: Meta = {
  title: "Components/Feedback/Overview",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Feedback 카테고리는 사용자 동작의 결과, 진행 상태, 시스템 메시지를 전달하는 컴포넌트를 모읍니다."
      }
    }
  },
  render: () =>
    createCategoryOverview({
      description: "알림, 로딩, 결과 안내처럼 시스템 반응을 전달하는 컴포넌트가 이 카테고리에 배치됩니다.",
      title: "Feedback"
    })
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {};
