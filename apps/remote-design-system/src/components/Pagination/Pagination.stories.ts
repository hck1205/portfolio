import type { Meta, StoryObj } from "@storybook/web-components-vite";

import { defineDsPagination, type PaginationAlign, type PaginationSize } from ".";

type PaginationStoryArgs = {
  align: PaginationAlign;
  current: number;
  disabled: boolean;
  hideOnSinglePage: boolean;
  pageSize: number;
  pageSizeOptions: string;
  showLessItems: boolean;
  showQuickJumper: boolean;
  showSizeChanger: boolean;
  simple: boolean;
  size: PaginationSize;
  total: number;
};

const storyDescriptions = {
  default: "많은 항목을 페이지 단위로 탐색할 때 사용하는 기본 Pagination입니다.",
  align: "align 속성으로 페이지네이션을 시작, 중앙, 끝 방향에 맞춰 배치합니다.",
  more: "페이지 수가 많을 때 앞뒤 페이지와 현재 페이지 주변만 노출하고 jump 버튼으로 빠르게 이동합니다.",
  changer: "show-size-changer 속성으로 한 페이지에 표시할 항목 수를 변경합니다.",
  jumper: "show-quick-jumper 속성으로 원하는 페이지 번호를 직접 입력해 이동합니다.",
  size: "size 속성으로 작은 영역과 넓은 영역에 맞는 페이지 아이템 크기를 선택합니다.",
  simple: "simple 속성으로 이전/다음 버튼과 현재 위치만 보여주는 압축 형태를 사용합니다.",
  disabled: "disabled 상태에서는 페이지 이동, 페이지 크기 변경, 직접 이동 입력이 모두 비활성화됩니다.",
  single: "hide-on-single-page 속성은 한 페이지만 있을 때 Pagination 자체를 숨깁니다."
};

const defaultArgs = {
  align: "start",
  current: 1,
  disabled: false,
  hideOnSinglePage: false,
  pageSize: 10,
  pageSizeOptions: "10,20,50,100",
  showLessItems: false,
  showQuickJumper: false,
  showSizeChanger: false,
  simple: false,
  size: "middle",
  total: 85
} satisfies PaginationStoryArgs;

function ensurePaginationDefined() {
  defineDsPagination();
}

function createPagination(args: PaginationStoryArgs) {
  const pagination = document.createElement("ds-pagination");

  pagination.setAttribute("align", args.align);
  pagination.setAttribute("current", String(args.current));
  pagination.setAttribute("page-size", String(args.pageSize));
  pagination.setAttribute("page-size-options", args.pageSizeOptions);
  pagination.setAttribute("size", args.size);
  pagination.setAttribute("total", String(args.total));
  pagination.toggleAttribute("disabled", args.disabled);
  pagination.toggleAttribute("hide-on-single-page", args.hideOnSinglePage);
  pagination.toggleAttribute("show-less-items", args.showLessItems);
  pagination.toggleAttribute("show-quick-jumper", args.showQuickJumper);
  pagination.toggleAttribute("show-size-changer", args.showSizeChanger);
  pagination.toggleAttribute("simple", args.simple);

  return pagination;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-pagination-story-frame";
  frame.append(...children);

  return frame;
}

function renderDefault(args: PaginationStoryArgs) {
  ensurePaginationDefined();

  return createFrame([createPagination(args)]);
}

function renderAlignStory() {
  ensurePaginationDefined();

  return createFrame(
    (["start", "center", "end"] as PaginationAlign[]).map((align) =>
      createPagination({
        ...defaultArgs,
        align,
        current: 4
      })
    )
  );
}

function renderMoreStory() {
  ensurePaginationDefined();

  return createFrame([
    createPagination({
      ...defaultArgs,
      current: 18,
      total: 420
    }),
    createPagination({
      ...defaultArgs,
      current: 18,
      showLessItems: true,
      total: 420
    })
  ]);
}

function renderChangerStory() {
  ensurePaginationDefined();

  return createFrame([
    createPagination({
      ...defaultArgs,
      current: 3,
      showSizeChanger: true,
      total: 240
    })
  ]);
}

function renderJumperStory() {
  ensurePaginationDefined();

  return createFrame([
    createPagination({
      ...defaultArgs,
      current: 5,
      showQuickJumper: true,
      total: 180
    })
  ]);
}

function renderSizeStory() {
  ensurePaginationDefined();

  return createFrame(
    (["small", "middle", "large"] as PaginationSize[]).map((size) =>
      createPagination({
        ...defaultArgs,
        current: 4,
        size
      })
    )
  );
}

function renderSimpleStory() {
  ensurePaginationDefined();

  return createFrame([
    createPagination({
      ...defaultArgs,
      current: 6,
      simple: true,
      total: 120
    })
  ]);
}

function renderDisabledStory() {
  ensurePaginationDefined();

  return createFrame([
    createPagination({
      ...defaultArgs,
      current: 3,
      disabled: true,
      showQuickJumper: true,
      showSizeChanger: true,
      total: 160
    })
  ]);
}

function renderSingleStory() {
  ensurePaginationDefined();

  return createFrame([
    createPagination({
      ...defaultArgs,
      hideOnSinglePage: true,
      total: 8
    })
  ]);
}

const meta: Meta<PaginationStoryArgs> = {
  title: "Components/Navigation/Pagination",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Pagination은 긴 목록을 여러 페이지로 나누고 사용자가 현재 페이지, 페이지 크기, 빠른 이동을 조작할 수 있게 하는 네비게이션 컴포넌트입니다."
      }
    }
  },
  argTypes: {
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"]
    },
    current: {
      control: { min: 1, type: "number" }
    },
    pageSize: {
      control: { min: 1, type: "number" }
    },
    size: {
      control: "inline-radio",
      options: ["small", "middle", "large"]
    },
    total: {
      control: { min: 0, type: "number" }
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<PaginationStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.default
      }
    }
  }
};

export const Align: Story = {
  render: renderAlignStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.align
      }
    }
  }
};

export const More: Story = {
  render: renderMoreStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.more
      }
    }
  }
};

export const Changer: Story = {
  render: renderChangerStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.changer
      }
    }
  }
};

export const Jumper: Story = {
  render: renderJumperStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.jumper
      }
    }
  }
};

export const Size: Story = {
  render: renderSizeStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.size
      }
    }
  }
};

export const Simple: Story = {
  render: renderSimpleStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.simple
      }
    }
  }
};

export const Disabled: Story = {
  render: renderDisabledStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.disabled
      }
    }
  }
};

export const HideOnSinglePage: Story = {
  render: renderSingleStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.single
      }
    }
  }
};
