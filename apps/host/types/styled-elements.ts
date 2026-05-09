import {
  createElement,
  forwardRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes
} from "react";

type IntrinsicElementName = keyof React.JSX.IntrinsicElements;
type IntrinsicElementProps<Name extends IntrinsicElementName> =
  React.JSX.IntrinsicElements[Name];
type StyledIntrinsicElement<Name extends IntrinsicElementName> =
  ForwardRefExoticComponent<
    PropsWithoutRef<IntrinsicElementProps<Name>> & RefAttributes<HTMLElement>
>;

export function createStyledIntrinsicElement<Name extends IntrinsicElementName>(
  name: Name
): StyledIntrinsicElement<Name> {
  const Component = forwardRef<HTMLElement, IntrinsicElementProps<Name>>(
    function StyledIntrinsicElement(props, ref) {
      return createElement(name, {
        ...props,
        ref
      });
    }
  );

  Component.displayName = `StyledIntrinsicElement(${String(name)})`;

  return Component;
}
