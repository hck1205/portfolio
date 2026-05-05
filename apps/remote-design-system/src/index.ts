import './styles.css';

import {
  defineDsAnchor,
  defineDsAutoComplete,
  defineDsAvatar,
  defineDsBadge,
  defineDsButton,
  defineDsCalendar,
  defineDsCard,
  defineDsCheckbox,
  defineDsColorPicker,
  defineDsCascader,
  defineDsCarousel,
  defineDsCollapse,
  defineDsDatePicker,
  defineDsDescriptions,
  defineDsDivider,
  defineDsDropdown,
  defineDsEmpty,
  defineDsFloatButton,
  defineDsForm,
  defineDsImage,
  defineDsInput,
  defineDsInputNumber,
  defineDsLayout,
  defineDsMenu,
  defineDsMentions,
  defineDsPagination,
  defineDsPopover,
  defineDsRadio,
  defineDsRate,
  defineDsSelect,
  defineDsSegmented,
  defineDsSkeleton,
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
  defineDsCalendar(registry);
  defineDsCard(registry);
  defineDsCheckbox(registry);
  defineDsColorPicker(registry);
  defineDsDatePicker(registry);
  defineDsCascader(registry);
  defineDsCarousel(registry);
  defineDsDescriptions(registry);
  defineDsDivider(registry);
  defineDsDropdown(registry);
  defineDsEmpty(registry);
  defineDsTypography(registry);
  defineDsFloatButton(registry);
  defineDsForm(registry);
  defineDsImage(registry);
  defineDsInput(registry);
  defineDsInputNumber(registry);
  defineDsCollapse(registry);
  defineDsLayout(registry);
  defineDsMenu(registry);
  defineDsMentions(registry);
  defineDsPagination(registry);
  defineDsPopover(registry);
  defineDsRadio(registry);
  defineDsRate(registry);
  defineDsSelect(registry);
  defineDsSegmented(registry);
  defineDsSkeleton(registry);
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
