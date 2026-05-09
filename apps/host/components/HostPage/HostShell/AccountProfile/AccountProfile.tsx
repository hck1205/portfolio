import AccountProfileView from "./AccountProfile.view";
import type { AccountProfileProps } from "./AccountProfile.types";

function AccountProfile(props: AccountProfileProps) {
  return <AccountProfileView {...props} />;
}

export default AccountProfile;
