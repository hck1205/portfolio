import styled from "@emotion/styled";

export const AccountProfileRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 48px;
  padding: 0 16px 20px;

  ds-layout-sider[collapsed] & {
    justify-content: center;
    padding-inline: 12px;
  }
`;

export const AccountProfileAvatar = styled.span`
  flex: 0 0 40px;
  display: inline-grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 8px;
  background: #155dfc;
  color: #ffffff;
  font-weight: 800;
`;

export const AccountProfileText = styled.div<{ $visible: boolean }>`
  min-width: 0;
  display: ${({ $visible }) => ($visible ? "block" : "none")};

  ds-layout-sider[collapsed] & {
    display: none;
  }
`;

export const AccountProfileMeta = styled.p`
  margin: 0 0 4px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
`;

export const AccountProfileName = styled.h1`
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  line-height: 1.1;
`;
