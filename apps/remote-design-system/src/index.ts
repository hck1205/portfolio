import './styles.css';

import {
  defineDsAnchor,
  defineDsAutoComplete,
  defineDsButton,
  defineDsCheckbox,
  defineDsColorPicker,
  defineDsCascader,
  defineDsCollapse,
  defineDsDatePicker,
  defineDsDivider,
  defineDsDropdown,
  defineDsFloatButton,
  defineDsLayout,
  defineDsMenu,
  defineDsPagination,
  defineDsSteps,
  defineDsSplitter,
  defineDsTabs,
  defineDsTypography,
} from './components';

export * from './components';
export * from './foundation';

export function defineDesignSystemElements(registry?: CustomElementRegistry) {
  defineDsAnchor(registry);
  defineDsAutoComplete(registry);
  defineDsButton(registry);
  defineDsCheckbox(registry);
  defineDsColorPicker(registry);
  defineDsDatePicker(registry);
  defineDsCascader(registry);
  defineDsDivider(registry);
  defineDsDropdown(registry);
  defineDsTypography(registry);
  defineDsFloatButton(registry);
  defineDsCollapse(registry);
  defineDsLayout(registry);
  defineDsMenu(registry);
  defineDsPagination(registry);
  defineDsSteps(registry);
  defineDsSplitter(registry);
  defineDsTabs(registry);
}

defineDesignSystemElements();
