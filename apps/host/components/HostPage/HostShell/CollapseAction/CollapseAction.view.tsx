import {
  CollapseActionRoot,
  CollapseButton,
  CollapseIcon,
  CollapseIconSlot
} from "./CollapseAction.styles";
import type { CollapseActionProps } from "./CollapseAction.types";

function CollapseActionView({ isCollapsed, onToggle }: CollapseActionProps) {
  return (
    <CollapseActionRoot>
      <CollapseButton
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
        ghost=""
        onClick={onToggle}
        shape="circle"
        size="large"
        type="text"
      >
        <CollapseIconSlot $expanded={isCollapsed} slot="icon">
          <CollapseIcon icon="list-collapse" size={18} stroke-width="2.35" />
        </CollapseIconSlot>
      </CollapseButton>
    </CollapseActionRoot>
  );
}

export default CollapseActionView;
