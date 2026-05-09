import {
  AccountProfileAvatar,
  AccountProfileMeta,
  AccountProfileName,
  AccountProfileRoot,
  AccountProfileText
} from "./AccountProfile.styles";
import type { AccountProfileProps } from "./AccountProfile.types";

function AccountProfileView({
  isSiderCollapsed,
  isTextVisible
}: AccountProfileProps) {
  return (
    <AccountProfileRoot>
      <AccountProfileAvatar aria-hidden="true">P</AccountProfileAvatar>
      <AccountProfileText
        $visible={isTextVisible}
        aria-hidden={!isTextVisible || isSiderCollapsed}
      >
        <AccountProfileMeta>Portfolio</AccountProfileMeta>
        <AccountProfileName>Host</AccountProfileName>
      </AccountProfileText>
    </AccountProfileRoot>
  );
}

export default AccountProfileView;
