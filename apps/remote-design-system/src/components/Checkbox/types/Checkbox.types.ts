export type CheckboxValue = string | number | boolean;

export type CheckboxGroupOption = {
  className?: string;
  disabled?: boolean;
  label: string;
  title?: string;
  value: CheckboxValue;
};

export type CheckboxGroupOptionInput = CheckboxValue | CheckboxGroupOption;

export type CheckboxChangeDetail = {
  checked: boolean;
  indeterminate: boolean;
  nativeEvent: Event;
  value: CheckboxValue;
};

export type CheckboxGroupChangeDetail = {
  nativeEvent: Event;
  value: CheckboxValue[];
};

export type CheckboxGroupSyncOptions = {
  checked: boolean;
  disabled: boolean;
  name: string;
};
