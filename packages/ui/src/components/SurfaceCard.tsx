import type { HTMLAttributes, ReactNode } from "react";

export type SurfaceCardProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: string;
  title: string;
  children: ReactNode;
};

export function SurfaceCard({ eyebrow, title, children, className, ...props }: SurfaceCardProps) {
  const classes = ["ds-surface-card", className].filter(Boolean).join(" ");

  return (
    <article className={classes} {...props}>
      {eyebrow ? <p className="ds-surface-card__eyebrow">{eyebrow}</p> : null}
      <h2 className="ds-surface-card__title">{title}</h2>
      <div className="ds-surface-card__content">{children}</div>
    </article>
  );
}
