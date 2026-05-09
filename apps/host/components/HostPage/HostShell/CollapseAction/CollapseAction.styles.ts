import styled from "@emotion/styled";

import { createStyledIntrinsicElement } from "../../../../types/styled-elements";

const dsButton = createStyledIntrinsicElement("ds-button");
const dsIcon = createStyledIntrinsicElement("ds-icon");

export const CollapseActionRoot = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 12px;

  ds-layout-sider[collapsed] & {
    justify-content: center;
    padding-inline: 12px;
  }
`;

export const CollapseButton = styled(dsButton)`
  color: #ffffff;

  & [slot="icon"],
  & svg {
    color: #ffffff;
  }
`;

export const CollapseIcon = styled(dsIcon)`
  display: block;
`;

export const CollapseIconSlot = styled.span<{ $expanded: boolean }>`
  & ds-icon {
    transform: ${({ $expanded }) => ($expanded ? "scaleX(1)" : "scaleX(-1)")};
  }
`;
