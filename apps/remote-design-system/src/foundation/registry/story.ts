import type { Meta, StoryObj } from "@storybook/web-components-vite";

import { breakpointStory } from "../breakpoint";
import { colorStory } from "../color";
import { radiusStory } from "../radius";
import { shadowStory } from "../shadow";
import { spacingStory } from "../spacing";
import { fontStory } from "../font";
import type {
  FoundationToken,
  FoundationTokenGroup,
  TokenCategory
} from "../types";
import { foundationTokenGroups } from "./registry";

type TokenPreviewStyle = {
  "--token-preview-value"?: string;
  "--token-preview-size"?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
};

type TokensOverviewProps = {
  category?: TokenCategory;
};

const tokenStoryOrder = [
  colorStory.category,
  spacingStory.category,
  radiusStory.category,
  shadowStory.category,
  breakpointStory.category,
  fontStory.category
] satisfies TokenCategory[];

const categoryDescriptions = {
  color: colorStory.description,
  spacing: spacingStory.description,
  radius: radiusStory.description,
  shadow: shadowStory.description,
  breakpoint: breakpointStory.description,
  font: fontStory.description
} satisfies Record<TokenCategory, string>;

/**
 * DOM element를 생성하고 className/textContent를 한 번에 설정합니다.
 *
 * @param tag 생성할 HTML tag 이름입니다.
 * @param options element에 적용할 className과 textContent입니다.
 * @returns 생성된 HTML element입니다.
 */
function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: {
    className?: string;
    textContent?: string;
  } = {}
) {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.textContent !== undefined) {
    element.textContent = options.textContent;
  }

  return element;
}

/**
 * token preview에서 사용하는 inline style 값을 DOM style object에 반영합니다.
 *
 * CSS custom property와 일반 style property를 같은 데이터 구조에서 다루기 위한 helper입니다.
 *
 * @param element style을 적용할 HTMLElement입니다.
 * @param style token preview에 필요한 style 값입니다.
 */
function applyTokenPreviewStyle(element: HTMLElement, style: TokenPreviewStyle) {
  Object.entries(style).forEach(([property, value]) => {
    if (value === undefined) {
      return;
    }

    if (property.startsWith("--")) {
      element.style.setProperty(property, value);
      return;
    }

    if (property === "fontFamily") {
      element.style.fontFamily = value;
      return;
    }

    if (property === "fontSize") {
      element.style.fontSize = value;
      return;
    }

    if (property === "fontWeight") {
      element.style.fontWeight = value;
      return;
    }

    if (property === "lineHeight") {
      element.style.lineHeight = value;
    }
  });
}

/**
 * spacing token 값을 preview에 적합한 px 크기로 정규화합니다.
 *
 * 큰 spacing 값이 preview 영역을 과도하게 차지하지 않도록 square-root scale로 압축합니다.
 *
 * @param value spacing token 원본 값입니다.
 * @returns preview에 사용할 CSS size 값입니다.
 */
function getSpacingPreviewSize(value: string) {
  const numericValue = Number.parseFloat(value);
  const pixelValue = value.endsWith("rem") ? numericValue * 16 : numericValue;

  if (!Number.isFinite(pixelValue)) {
    return value;
  }

  const absolutePixelValue = Math.abs(pixelValue);
  const minTokenSize = 4;
  const maxTokenSize = 384;
  const minPreviewSize = 8;
  const maxPreviewSize = 52;
  const normalized = Math.min(
    Math.max(
      (Math.sqrt(absolutePixelValue) - Math.sqrt(minTokenSize)) /
        (Math.sqrt(maxTokenSize) - Math.sqrt(minTokenSize)),
      0
    ),
    1
  );

  return `${Math.round(minPreviewSize + normalized * (maxPreviewSize - minPreviewSize))}px`;
}

/**
 * token category별 preview element에 필요한 style 값을 계산합니다.
 *
 * @param group token이 속한 foundation group입니다.
 * @param value token의 CSS value입니다.
 * @returns preview DOM에 적용할 style 값입니다.
 */
function getTokenPreviewStyle(group: FoundationTokenGroup, value: string): TokenPreviewStyle {
  if (group.category === "font") {
    return {
      "--token-preview-value": value,
      fontFamily: value.includes("sans-serif") ? value : undefined,
      fontSize: value.endsWith("px") ? value : undefined,
      fontWeight: /^\d+$/.test(value) ? value : undefined,
      lineHeight: value.startsWith("1.") ? value : undefined
    };
  }

  if (group.category === "spacing") {
    return {
      "--token-preview-value": value,
      "--token-preview-size": getSpacingPreviewSize(value)
    };
  }

  return {
    "--token-preview-value": value
  };
}

/**
 * color token 이름에서 family 이름을 추출합니다.
 *
 * @param tokenName slash로 구분된 token display name입니다.
 * @returns color family 이름입니다.
 */
function getColorFamily(tokenName: string) {
  return tokenName.split("/")[0] ?? "Other";
}

/**
 * color token 목록을 family 단위로 그룹핑합니다.
 *
 * @param tokens color foundation token 목록입니다.
 * @returns family 이름과 token 목록을 담은 배열입니다.
 */
function getColorTokenFamilies(tokens: readonly FoundationToken[]) {
  const families = new Map<string, FoundationToken[]>();

  for (const token of tokens) {
    const family = getColorFamily(token.name);
    const familyTokens = families.get(family) ?? [];

    familyTokens.push(token);
    families.set(family, familyTokens);
  }

  return Array.from(families.entries()).map(([family, tokens]) => ({ family, tokens }));
}

/**
 * 하나의 foundation token을 카드 UI로 렌더링합니다.
 *
 * @param group token이 속한 foundation group입니다.
 * @param token 렌더링할 token 데이터입니다.
 * @returns token 정보를 표시하는 article element입니다.
 */
function createTokenCard(group: FoundationTokenGroup, token: FoundationToken) {
  const card = createElement("article", { className: "ds-token-card" });
  const preview = createElement("div", {
    className: `ds-token-preview ds-token-preview--${group.category}`,
    textContent: group.category === "font" ? "Aa" : undefined
  });
  const body = createElement("div", { className: "ds-token-card__body" });

  applyTokenPreviewStyle(preview, getTokenPreviewStyle(group, token.value));
  body.append(
    createElement("h3", { textContent: token.name }),
    createElement("p", { textContent: token.description }),
    createElement("code", { textContent: token.variable }),
    createElement("strong", { textContent: token.value })
  );
  card.append(preview, body);

  return card;
}

/**
 * foundation group 하나의 token 목록을 grid 또는 family grid로 렌더링합니다.
 *
 * @param group 렌더링할 foundation token group입니다.
 * @returns token grid element입니다.
 */
function createTokenGrid(group: FoundationTokenGroup) {
  if (group.category === "color") {
    const familiesElement = createElement("div", { className: "ds-color-token-families" });

    for (const { family, tokens } of getColorTokenFamilies(group.tokens)) {
      const familyElement = createElement("div", { className: "ds-color-token-family" });
      const familyHeader = createElement("div", { className: "ds-color-token-family__header" });
      const tokenGrid = createElement("div", { className: "ds-token-grid" });

      familyHeader.append(
        createElement("h3", { textContent: family }),
        createElement("span", { textContent: `${tokens.length} properties` })
      );

      for (const token of tokens) {
        tokenGrid.append(createTokenCard(group, token));
      }

      familyElement.append(familyHeader, tokenGrid);
      familiesElement.append(familyElement);
    }

    return familiesElement;
  }

  const tokenGrid = createElement("div", { className: "ds-token-grid" });

  for (const token of group.tokens) {
    tokenGrid.append(createTokenCard(group, token));
  }

  return tokenGrid;
}

/**
 * Foundation token catalog 전체 또는 특정 category 화면을 렌더링합니다.
 *
 * @param args Storybook controls에서 전달되는 token category 설정입니다.
 * @returns Storybook canvas에 표시할 foundation catalog element입니다.
 */
function renderTokensOverview({ category }: TokensOverviewProps = {}) {
  const tokenGroups = category
    ? foundationTokenGroups.filter((group) => group.category === category)
    : foundationTokenGroups;
  let tokenCount = 0;
  const container = createElement("div", { className: "ds-foundation" });
  const header = createElement("header", { className: "ds-foundation__header" });
  const tokenSections = createElement("div", { className: "ds-token-sections" });

  for (const group of tokenGroups) {
    tokenCount += group.tokens.length;
  }

  header.append(
    createElement("p", { textContent: "Foundation" }),
    createElement("h1", {
      textContent: category ? `${tokenGroups[0]?.label} tokens` : "Design tokens"
    }),
    createElement("span", {
      textContent: category
        ? categoryDescriptions[category]
        : `${tokenCount} CSS custom properties from the remote-design-system source`
    })
  );

  for (const group of tokenGroups) {
    const section = createElement("section", { className: "ds-token-section" });
    const sectionHeader = createElement("div", { className: "ds-token-section__header" });

    sectionHeader.append(
      createElement("h2", { textContent: group.label }),
      createElement("span", { textContent: `${group.tokens.length} properties` })
    );
    section.append(sectionHeader, createTokenGrid(group));
    tokenSections.append(section);
  }

  container.append(header, tokenSections);

  return container;
}

const meta: Meta<TokensOverviewProps> = {
  title: "Foundation/Tokens",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Token catalog generated from each foundation folder's token and story files."
      }
    }
  },
  args: {
    category: undefined
  },
  argTypes: {
    category: {
      control: "select",
      options: [undefined, ...tokenStoryOrder]
    }
  },
  render: renderTokensOverview
};

export default meta;

type Story = StoryObj<TokensOverviewProps>;

export const All: Story = {};

export const Color: Story = {
  args: {
    category: colorStory.category
  }
};

export const Spacing: Story = {
  args: {
    category: spacingStory.category
  }
};

export const Radius: Story = {
  args: {
    category: radiusStory.category
  }
};

export const Shadow: Story = {
  args: {
    category: shadowStory.category
  }
};

export const Breakpoints: Story = {
  args: {
    category: breakpointStory.category
  }
};

export const Font: Story = {
  args: {
    category: fontStory.category
  }
};
