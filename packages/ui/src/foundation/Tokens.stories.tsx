import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { foundationTokenGroups, type FoundationTokenGroup } from "./tokens";

type TokenPreviewStyle = CSSProperties & {
  "--token-preview-value"?: string;
};

function getTokenPreviewStyle(group: FoundationTokenGroup, value: string): TokenPreviewStyle {
  if (group.category === "typography") {
    return {
      "--token-preview-value": value,
      fontFamily: value.includes("sans-serif") ? value : undefined,
      fontSize: value.endsWith("px") ? value : undefined,
      fontWeight: /^\d+$/.test(value) ? Number(value) : undefined,
      lineHeight: value.startsWith("1.") ? value : undefined
    };
  }

  return {
    "--token-preview-value": value
  };
}

function TokensOverview() {
  return (
    <div className="ds-foundation">
      <header className="ds-foundation__header">
        <p>Foundation</p>
        <h1>Design tokens</h1>
        <span>CSS custom properties + typed token source</span>
      </header>

      <div className="ds-token-sections">
        {foundationTokenGroups.map((group) => (
          <section className="ds-token-section" key={group.category}>
            <div className="ds-token-section__header">
              <h2>{group.label}</h2>
              <span>{group.tokens.length} properties</span>
            </div>

            <div className="ds-token-grid">
              {group.tokens.map((token) => (
                <article className="ds-token-card" key={token.variable}>
                  <div
                    className={`ds-token-preview ds-token-preview--${group.category}`}
                    style={getTokenPreviewStyle(group, token.value)}
                  >
                    {group.category === "typography" ? "Aa" : null}
                  </div>
                  <div className="ds-token-card__body">
                    <h3>{token.name}</h3>
                    <p>{token.description}</p>
                    <code>{token.variable}</code>
                    <strong>{token.value}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: "Foundation/Tokens",
  component: TokensOverview,
  parameters: {
    layout: "fullscreen"
  }
} satisfies Meta<typeof TokensOverview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const All: Story = {};
