import Link from "next/link";
import { cn } from "@/lib/utils";

type CommonProps = {
  variant?: "solid" | "solid-accent" | "outline";
  size?: "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<NonNullable<CommonProps["variant"]>, string> = {
  solid: "bg-ink text-cream hover:bg-ink/90",
  "solid-accent": "bg-accent-orange text-white hover:bg-accent-orange/90",
  outline:
    "bg-transparent border border-contact-border text-ink hover:bg-black/[0.03]",
};

const sizeClasses: Record<NonNullable<CommonProps["size"]>, string> = {
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-6 text-base gap-2.5",
};

export function Button({
  variant = "solid",
  size = "md",
  icon,
  iconPosition = "right",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap transition-colors",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  const content = (
    <>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </>
  );

  if ("href" in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonAsButton)}>
      {content}
    </button>
  );
}
