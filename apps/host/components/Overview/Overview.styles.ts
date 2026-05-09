import styled from "@emotion/styled";

export const OverviewRoot = styled.div`
  min-height: 100vh;
  padding: 48px;

  @media (max-width: 760px) {
    min-height: auto;
    padding: 28px 20px;
  }
`;

export const OverviewTitle = styled.h2`
  margin: 0;
  color: #171717;
  font-size: 34px;
  line-height: 1.1;
`;

export const OverviewList = styled.div`
  display: grid;
  gap: 12px;
  max-width: 520px;
  margin-top: 28px;
`;

export const OverviewItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid #d7d7d0;
  border-radius: 8px;
  background: #ffffff;
  padding: 18px;
`;

export const OverviewItemLabel = styled.span`
  color: #343434;
  font-weight: 700;
`;

export const OverviewItemValue = styled.strong`
  color: #123fbb;
  font-size: 14px;
  text-transform: uppercase;
`;
