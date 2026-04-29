import { createElement, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

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

type TokenPreviewStyle = CSSProperties & {
  "--token-preview-value"?: string;
  "--token-preview-size"?: string;
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

function getTokenPreviewStyle(group: FoundationTokenGroup, value: string): TokenPreviewStyle {
  if (group.category === "font") {
    return {
      "--token-preview-value": value,
      fontFamily: value.includes("sans-serif") ? value : undefined,
      fontSize: value.endsWith("px") ? value : undefined,
      fontWeight: /^\d+$/.test(value) ? Number(value) : undefined,
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

function getColorFamily(tokenName: string) {
  return tokenName.split("/")[0] ?? "Other";
}

function getColorTokenFamilies(tokens: readonly FoundationToken[]) {
  const families = new Map<string, FoundationToken[]>();

  tokens.forEach((token) => {
    const family = getColorFamily(token.name);
    const familyTokens = families.get(family) ?? [];

    familyTokens.push(token);
    families.set(family, familyTokens);
  });

  return Array.from(families.entries()).map(([family, tokens]) => ({ family, tokens }));
}

function TokenCard({ group, token }: { group: FoundationTokenGroup; token: FoundationToken }) {
  return createElement(
    "article",
    { className: "ds-token-card", key: token.variable },
    createElement(
      "div",
      {
        className: `ds-token-preview ds-token-preview--${group.category}`,
        style: getTokenPreviewStyle(group, token.value)
      },
      group.category === "font" ? "Aa" : null
    ),
    createElement(
      "div",
      { className: "ds-token-card__body" },
      createElement("h3", null, token.name),
      createElement("p", null, token.description),
      createElement("code", null, token.variable),
      createElement("strong", null, token.value)
    )
  );
}

function TokenGrid({ group }: { group: FoundationTokenGroup }) {
  if (group.category === "color") {
    return createElement(
      "div",
      { className: "ds-color-token-families" },
      getColorTokenFamilies(group.tokens).map(({ family, tokens }) =>
        createElement(
          "div",
          { className: "ds-color-token-family", key: family },
          createElement(
            "div",
            { className: "ds-color-token-family__header" },
            createElement("h3", null, family),
            createElement("span", null, `${tokens.length} properties`)
          ),
          createElement(
            "div",
            { className: "ds-token-grid" },
            tokens.map((token) => TokenCard({ group, token }))
          )
        )
      )
    );
  }

  return createElement(
    "div",
    { className: "ds-token-grid" },
    group.tokens.map((token) => TokenCard({ group, token }))
  );
}

function TokensOverview({ category }: TokensOverviewProps) {
  const tokenGroups = category
    ? foundationTokenGroups.filter((group) => group.category === category)
    : foundationTokenGroups;
  let tokenCount = 0;

  tokenGroups.forEach((group) => {
    tokenCount += group.tokens.length;
  });

  return createElement(
    "div",
    { className: "ds-foundation" },
    createElement(
      "header",
      { className: "ds-foundation__header" },
      createElement("p", null, "Foundation"),
      createElement("h1", null, category ? `${tokenGroups[0]?.label} tokens` : "Design tokens"),
      createElement(
        "span",
        null,
        category
          ? categoryDescriptions[category]
          : `${tokenCount} CSS custom properties from the remote-design-system source`
      )
    ),
    createElement(
      "div",
      { className: "ds-token-sections" },
      tokenGroups.map((group) =>
        createElement(
          "section",
          { className: "ds-token-section", key: group.category },
          createElement(
            "div",
            { className: "ds-token-section__header" },
            createElement("h2", null, group.label),
            createElement("span", null, `${group.tokens.length} properties`)
          ),
          TokenGrid({ group })
        )
      )
    )
  );
}

const meta = {
  title: "Foundation/Tokens",
  component: TokensOverview,
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
  }
} satisfies Meta<typeof TokensOverview>;

export default meta;

type Story = StoryObj<typeof meta>;

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
