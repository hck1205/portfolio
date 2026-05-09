import { APP_ID } from "../../../LiveApp/LiveApp.const";
import { navigationIcons } from "./NavigationMenu.constants";
import {
  NavigationMenuIcon,
  NavigationMenuRoot,
  NavigationMenuStatus
} from "./NavigationMenu.styles";
import type { NavigationMenuProps } from "./NavigationMenu.types";

function NavigationMenuView({
  activeNav,
  items,
  menuRef,
  onActiveNavChange
}: NavigationMenuProps) {
  return (
    <NavigationMenuRoot
      aria-label="Portfolio navigation"
      mode="inline"
      ref={menuRef}
      selected-keys={activeNav}
      theme="dark"
    >
      {items.map((item) => (
        <ds-menu-item
          item-key={item.id}
          key={item.id}
          label={item.label}
          onClick={() => onActiveNavChange(item.id)}
        >
          <span slot="icon">
            <NavigationMenuIcon icon={navigationIcons[item.id]} />
          </span>
          {item.id !== APP_ID.OVERVIEW ? (
            <NavigationMenuStatus
              $status={item.status}
              aria-label={item.status}
              slot="extra"
              title={item.status}
            >
              <ds-badge
                dot=""
                size="small"
                status={
                  item.status === "active"
                    ? "success"
                    : item.status === "unknown"
                      ? "warning"
                      : "default"
                }
              />
            </NavigationMenuStatus>
          ) : null}
        </ds-menu-item>
      ))}
    </NavigationMenuRoot>
  );
}

export default NavigationMenuView;
