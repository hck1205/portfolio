import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { ColorPickerPickerPlacement } from "@portfolio/remote-design-system";

type DesignSystemElementProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ds-layout": DesignSystemElementProps & {
        "has-sider"?: boolean | string;
      };
      "ds-layout-content": DesignSystemElementProps;
      "ds-layout-sider": DesignSystemElementProps & {
        collapsed?: boolean | string;
        "collapsed-width"?: number | string;
        collapsible?: boolean | string;
        "reverse-arrow"?: boolean | string;
        theme?: "dark" | "light";
        trigger?: string;
        width?: number | string;
      };
      "ds-tabs": DesignSystemElementProps & {
        "active-key"?: string;
        centered?: boolean | string;
        "default-active-key"?: string;
        "full-width"?: boolean | string;
        size?: "large" | "medium" | "small";
        "tab-placement"?: "top" | "bottom" | "start" | "end";
        type?: "line" | "card";
      };
      "ds-tab": DesignSystemElementProps & {
        disabled?: boolean | string;
        icon?: string;
        "icon-only"?: boolean | string;
        "item-key"?: string;
        label?: string;
        tooltip?: string;
      };
      "ds-button": DesignSystemElementProps & {
        block?: boolean | string;
        color?: "default" | "primary" | "danger";
        danger?: boolean | string;
        disabled?: boolean | string;
        ghost?: boolean | string;
        href?: string;
        "html-type"?: "button" | "submit" | "reset";
        "icon-placement"?: "start" | "end";
        loading?: boolean | string;
        rel?: string;
        shape?: "default" | "round" | "circle";
        size?: "large" | "middle" | "small";
        target?: string;
        type?: "default" | "primary" | "dashed" | "text" | "link";
        variant?: "outlined" | "dashed" | "solid" | "filled" | "text" | "link";
      };
      "ds-color-picker": DesignSystemElementProps & {
        "allow-clear"?: boolean | string;
        "default-format"?: "hex" | "rgb" | "hsb";
        "default-value"?: string;
        disabled?: boolean | string;
        "disabled-alpha"?: boolean | string;
        "disabled-format"?: boolean | string;
        format?: "hex" | "rgb" | "hsb";
        open?: boolean | string;
        "picker-placement"?: ColorPickerPickerPlacement;
        placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        presets?: string;
        "show-text"?: boolean | string;
        size?: "large" | "middle" | "small";
        trigger?: "click" | "hover";
        value?: string;
      };
      "ds-slider": DesignSystemElementProps & {
        "default-value"?: number | string;
        disabled?: boolean | string;
        dots?: boolean | string;
        included?: boolean | string;
        marks?: string;
        max?: number | string;
        min?: number | string;
        range?: boolean | string;
        reverse?: boolean | string;
        step?: number | string;
        tooltip?: "auto" | "open" | "closed";
        value?: number | string;
        vertical?: boolean | string;
      };
      "ds-select": DesignSystemElementProps & {
        "allow-clear"?: boolean | string;
        disabled?: boolean | string;
        "filter-option"?: boolean | string;
        mode?: "multiple" | "single" | "tags";
        "not-found-content"?: string;
        open?: boolean | string;
        options?: string;
        placeholder?: string;
        placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        "show-search"?: boolean | string;
        "show-selected-icon"?: boolean | string;
        size?: "large" | "middle" | "small";
        status?: "error" | "warning";
        value?: string;
        variant?: "borderless" | "filled" | "outlined" | "underlined";
      };
      "ds-collapse": DesignSystemElementProps & {
        accordion?: boolean | string;
        "active-key"?: string;
        bordered?: boolean | string;
        "default-active-key"?: string;
        "expand-icon-placement"?: "start" | "end";
        ghost?: boolean | string;
        size?: "large" | "middle" | "small";
      };
      "ds-collapse-item": DesignSystemElementProps & {
        collapsible?: "header" | "icon" | "disabled";
        disabled?: boolean | string;
        extra?: string;
        "heading-level"?: 1 | 2 | 3 | 4 | 5 | 6 | string;
        "item-key"?: string;
        label?: string;
        "show-arrow"?: boolean | string;
      };
      "ds-divider": DesignSystemElementProps & {
        color?: string;
        "color-token"?: string;
        dashed?: boolean | string;
        orientation?: "horizontal" | "vertical";
        "orientation-margin"?: string;
        plain?: boolean | string;
        size?: "small" | "medium" | "large";
        "title-placement"?: "start" | "center" | "end";
        variant?: "solid" | "dashed" | "dotted";
        vertical?: boolean | string;
      };
      "ds-icon": DesignSystemElementProps & {
        decorative?: boolean | string;
        icon?: string;
        label?: string;
        size?: number | string;
        "stroke-width"?: number | string;
      };
      "ds-switch": DesignSystemElementProps & {
        checked?: boolean | string;
        disabled?: boolean | string;
        loading?: boolean | string;
        size?: "default" | "small";
      };
      "ds-typography": DesignSystemElementProps & {
        as?: string;
        code?: boolean | string;
        color?: string;
        "color-token"?: string;
        copyable?: boolean | string;
        delete?: boolean | string;
        disabled?: boolean | string;
        display?:
          | "block"
          | "inline"
          | "inline-block"
          | "flex"
          | "inline-flex"
          | "grid"
          | "inline-grid"
          | "contents"
          | "flow-root"
          | "none";
        editable?: boolean | string;
        ellipsis?: boolean | string;
        href?: string;
        italic?: boolean | string;
        keyboard?: boolean | string;
        level?: 1 | 2 | 3 | 4 | 5 | string;
        mark?: boolean | string;
        rows?: number | string;
        strong?: boolean | string;
        target?: string;
        "text-align"?: "left" | "right" | "center" | "justify" | "start" | "end";
        "text-decoration"?: "overline" | "underline" | "line-through" | "none";
        "text-overflow"?: "truncate" | "break" | "none";
        "typo-name"?: string;
        type?: "default" | "secondary" | "success" | "warning" | "danger";
        underline?: boolean | string;
        variant?: "text" | "title" | "paragraph";
      };
    }
  }
}
