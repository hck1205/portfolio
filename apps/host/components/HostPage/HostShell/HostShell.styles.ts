import styled from "@emotion/styled";

import { createStyledIntrinsicElement } from "../../../types/styled-elements";

const dsLayout = createStyledIntrinsicElement("ds-layout");
const dsLayoutContent = createStyledIntrinsicElement("ds-layout-content");

export const HostRoot = styled(dsLayout)`
  display: flex;
  align-items: stretch;
  flex-direction: row;
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #f3f3ef;

  > ds-layout-sider {
    --host-sider-current-width: 290px;
    flex: 0 0 var(--host-sider-current-width);
    width: var(--host-sider-current-width);
    min-width: var(--host-sider-current-width);
    max-width: var(--host-sider-current-width);
  }

  > ds-layout-sider[collapsed] {
    --host-sider-current-width: 64px;
  }
`;

export const HostSiderShell = styled.div`
  min-height: 100%;
  padding: 20px 0;
`;

export const HostSiderDivider = styled.div`
  height: 1px;
  margin: 0 12px 4px;
  background: rgba(255, 255, 255, 0.14);
`;

export const HostContent = styled(dsLayoutContent)`
  min-width: 0;
  min-height: 0;
  --ds-layout-content-bg: #f3f3ef;
`;
