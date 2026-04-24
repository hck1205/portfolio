import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonTone = "primary" | "neutral" | "danger";
export type ButtonSize = "sm" | "md";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: ButtonTone;
  size?: ButtonSize;
};

export function Button({
  children,
  tone = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = ["ds-button", `ds-button--${tone}`, `ds-button--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
