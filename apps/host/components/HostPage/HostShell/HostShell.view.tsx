import { AccountProfile } from "./AccountProfile";
import { CollapseAction } from "./CollapseAction";
import {
  HostContent,
  HostRoot,
  HostSiderDivider,
  HostSiderShell
} from "./HostShell.styles";
import type { HostShellViewProps } from "./HostShell.types";
import { NavigationMenu } from "./NavigationMenu";

function HostShellView({
  activeNav,
  children,
  handleActiveNavChange,
  handleCollapseToggle,
  isAccountProfileTextVisible,
  isSiderCollapsed,
  menuRef,
  navigationItems,
  siderRef
}: HostShellViewProps) {
  return (
    <HostRoot>
      <ds-layout-sider
        aria-label="Portfolio navigation"
        breakpoint="md"
        collapsed-width="64"
        collapsible=""
        ref={siderRef}
        theme="dark"
        trigger="none"
        width="290"
      >
        <HostSiderShell>
          <AccountProfile
            isSiderCollapsed={isSiderCollapsed}
            isTextVisible={isAccountProfileTextVisible}
          />
          <CollapseAction
            isCollapsed={isSiderCollapsed}
            onToggle={handleCollapseToggle}
          />
          <HostSiderDivider aria-hidden="true" role="separator" />
          <NavigationMenu
            activeNav={activeNav}
            items={navigationItems}
            menuRef={menuRef}
            onActiveNavChange={handleActiveNavChange}
          />
        </HostSiderShell>
      </ds-layout-sider>

      <HostContent>{children}</HostContent>
    </HostRoot>
  );
}

export default HostShellView;
