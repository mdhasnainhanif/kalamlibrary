import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "filled" | "outline";
type Size = "sm" | "md" | "lg";
type Shape = "default" | "pill";

type SharedProps = {
  variant?: Variant;
  size?: Size;
  shape?: Shape;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = SharedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof SharedProps | "href"> & {
    href: string;
  };

type ButtonAsButton = SharedProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof SharedProps> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

function buildClassName({
  variant,
  size,
  shape,
  fullWidth,
  className,
}: {
  variant: Variant;
  size: Size;
  shape: Shape;
  fullWidth?: boolean;
  className?: string;
}) {
  return [
    "kalam-btn",
    variant === "filled" ? "kalam-btn--filled" : "kalam-btn--outline",
    size === "sm" ? "kalam-btn--sm" : size === "lg" ? "kalam-btn--lg" : "kalam-btn--md",
    shape === "pill" ? "kalam-btn--pill" : "",
    fullWidth ? "kalam-btn--block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Button(props: ButtonProps) {
  const {
    variant = "filled",
    size = "md",
    shape = "default",
    fullWidth,
    className,
    children,
    ...rest
  } = props;

  const classes = buildClassName({ variant, size, shape, fullWidth, className });

  if ("href" in props && props.href) {
    const { href, ...linkRest } = rest as Omit<ButtonAsLink, keyof SharedProps>;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
