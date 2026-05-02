import './styles.css';

import {
  defineDsButton,
  defineDsCollapse,
  defineDsDivider,
  defineDsFloatButton,
  defineDsLayout,
  defineDsSteps,
  defineDsSplitter,
  defineDsTypography,
} from './components';

export * from './components';
export * from './foundation';

export function defineDesignSystemElements(registry?: CustomElementRegistry) {
  defineDsButton(registry);
  defineDsDivider(registry);
  defineDsTypography(registry);
  defineDsFloatButton(registry);
  defineDsCollapse(registry);
  defineDsLayout(registry);
  defineDsSteps(registry);
  defineDsSplitter(registry);
}

defineDesignSystemElements();
