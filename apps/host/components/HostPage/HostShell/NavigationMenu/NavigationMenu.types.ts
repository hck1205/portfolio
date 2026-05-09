import type { RefObject } from "react";

import type { ActiveNav, NavigationItem } from "../../../../lib/navigation";

export type NavigationMenuProps = {
  activeNav: ActiveNav;
  items: NavigationItem[];
  menuRef: RefObject<HTMLElement | null>;
  onActiveNavChange: (activeNav: ActiveNav) => void;
};
