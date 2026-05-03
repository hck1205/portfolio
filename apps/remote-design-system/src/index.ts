import './styles.css';

import {
  defineDsAnchor,
  defineDsAutoComplete,
  defineDsAvatar,
  defineDsBadge,
  defineDsButton,
  defineDsCheckbox,
  defineDsColorPicker,
  defineDsCascader,
  defineDsCarousel,
  defineDsCollapse,
  defineDsDatePicker,
  defineDsDivider,
  defineDsDropdown,
  defineDsFloatButton,
  defineDsForm,
  defineDsInput,
  defineDsInputNumber,
  defineDsLayout,
  defineDsMenu,
  defineDsMentions,
  defineDsPagination,
  defineDsRadio,
  defineDsRate,
  defineDsSelect,
  defineDsSlider,
  defineDsSteps,
  defineDsSplitter,
  defineDsSwitch,
  defineDsTabs,
  defineDsTreeSelect,
  defineDsTimePicker,
  defineDsTransfer,
  defineDsUpload,
  defineDsTypography,
} from './components';

export * from './components';
export * from './foundation';

export function defineDesignSystemElements(registry?: CustomElementRegistry) {
  defineDsAnchor(registry);
  defineDsAutoComplete(registry);
  defineDsAvatar(registry);
  defineDsBadge(registry);
  defineDsButton(registry);
  defineDsCheckbox(registry);
  defineDsColorPicker(registry);
  defineDsDatePicker(registry);
  defineDsCascader(registry);
  defineDsCarousel(registry);
  defineDsDivider(registry);
  defineDsDropdown(registry);
  defineDsTypography(registry);
  defineDsFloatButton(registry);
  defineDsForm(registry);
  defineDsInput(registry);
  defineDsInputNumber(registry);
  defineDsCollapse(registry);
  defineDsLayout(registry);
  defineDsMenu(registry);
  defineDsMentions(registry);
  defineDsPagination(registry);
  defineDsRadio(registry);
  defineDsRate(registry);
  defineDsSelect(registry);
  defineDsSlider(registry);
  defineDsSteps(registry);
  defineDsSplitter(registry);
  defineDsSwitch(registry);
  defineDsTabs(registry);
  defineDsTreeSelect(registry);
  defineDsTimePicker(registry);
  defineDsTransfer(registry);
  defineDsUpload(registry);
}

defineDesignSystemElements();
