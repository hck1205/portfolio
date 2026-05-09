import { useHostShell } from "./hooks";
import HostShellView from "./HostShell.view";
import type { HostShellProps } from "./HostShell.types";

function HostShell({
  activeNav,
  children,
  navigationItems,
  onActiveNavChange
}: HostShellProps) {
  const hostShell = useHostShell({ activeNav, onActiveNavChange });

  return (
    <HostShellView
      activeNav={activeNav}
      navigationItems={navigationItems}
      {...hostShell}
    >
      {children}
    </HostShellView>
  );
}

export default HostShell;
