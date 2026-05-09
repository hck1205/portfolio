import type { DetailedHTMLProps, HTMLAttributes } from "react";

type DesignSystemElementProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ds-layout": DesignSystemElementProps & {
        "has-sider"?: boolean | string;
      };
      "ds-layout-content": DesignSystemElementProps;
      "ds-layout-footer": DesignSystemElementProps;
      "ds-layout-header": DesignSystemElementProps;
      "ds-icon": DesignSystemElementProps & {
        decorative?: boolean | string;
        icon?: string;
        label?: string;
        size?: number | string;
        "stroke-width"?: number | string;
      };
      "ds-badge": DesignSystemElementProps & {
        color?: string;
        count?: number | string;
        dot?: boolean | string;
        offset?: string;
        "overflow-count"?: number | string;
        "show-zero"?: boolean | string;
        size?: "middle" | "small";
        status?: "default" | "error" | "processing" | "success" | "warning";
        text?: string;
      };
      "ds-badge-ribbon": DesignSystemElementProps & {
        color?: string;
        placement?: "end" | "start";
        text?: string;
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
      "ds-layout-sider": DesignSystemElementProps & {
        breakpoint?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
        collapsed?: boolean | string;
        "collapsed-width"?: number | string;
        collapsible?: boolean | string;
        "default-collapsed"?: boolean | string;
        "reverse-arrow"?: boolean | string;
        theme?: "dark" | "light";
        trigger?: string;
        width?: number | string;
      };
      "ds-menu": DesignSystemElementProps & {
        accordion?: boolean | string;
        "default-open-keys"?: string;
        "default-selected-keys"?: string;
        "inline-collapsed"?: boolean | string;
        mode?: "vertical" | "horizontal" | "inline";
        multiple?: boolean | string;
        "open-keys"?: string;
        selectable?: boolean | string;
        "selected-keys"?: string;
        theme?: "dark" | "light";
      };
      "ds-menu-item": DesignSystemElementProps & {
        danger?: boolean | string;
        disabled?: boolean | string;
        extra?: string;
        href?: string;
        "item-key"?: string;
        label?: string;
        target?: string;
        type?: "item" | "submenu" | "group" | "divider";
      };
    }
  }
}
