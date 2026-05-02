import './styles.css';

import {
  defineDsAnchor,
  defineDsButton,
  defineDsCollapse,
  defineDsDivider,
  defineDsFloatButton,
  defineDsLayout,
  defineDsSplitter,
  defineDsTypography,
} from './components';

export * from './components';
export * from './foundation';

export function defineDesignSystemElements(registry?: CustomElementRegistry) {
  defineDsAnchor(registry);
  defineDsButton(registry);
  defineDsDivider(registry);
  defineDsTypography(registry);
  defineDsFloatButton(registry);
  defineDsCollapse(registry);
  defineDsLayout(registry);
  defineDsSplitter(registry);
}

defineDesignSystemElements();
