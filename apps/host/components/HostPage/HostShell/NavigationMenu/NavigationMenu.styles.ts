import styled from "@emotion/styled";

import type { NavigationStatus } from "../../../../lib/navigation";
import { createStyledIntrinsicElement } from "../../../../types/styled-elements";

const dsIcon = createStyledIntrinsicElement("ds-icon");
const dsMenu = createStyledIntrinsicElement("ds-menu");

export const NavigationMenuRoot = styled(dsMenu)`
  --ds-menu-bg: transparent;
  --ds-menu-color: rgba(255, 255, 255, 0.72);
  --ds-menu-hover-bg: rgba(255, 255, 255, 0.08);
  --ds-menu-muted: rgba(255, 255, 255, 0.46);
  --ds-menu-padding: 12px;
  --ds-menu-selected-bg: var(--color-ds-primary, #155dfc);
  --ds-menu-selected-color: #ffffff;
  color: var(--ds-menu-color);
  width: 100%;
`;

export const NavigationMenuIcon = styled(dsIcon)`
  display: block;
`;

function getStatusColor(status: NavigationStatus) {
  if (status === "active") {
    return "var(--color-ds-success, #16a34a)";
  }

  if (status === "unknown") {
    return "var(--color-ds-warning, #faad14)";
  }

  return "rgba(255, 255, 255, 0.32)";
}

export const NavigationMenuStatus = styled.span<{ $status: NavigationStatus }>`
  align-items: center;
  justify-content: center;
  display: inline-flex;
  width: 6px;
  height: 6px;
  line-height: 0;
  margin: 0;
  padding: 0;
  color: ${({ $status }) => getStatusColor($status)};

  & ds-badge {
    margin: 0;
    padding: 0;
  }
`;
