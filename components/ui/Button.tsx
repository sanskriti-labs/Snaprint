"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-display font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-snap-red focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 tracking-tight",
  {
    variants: {
      variant: {
        primary:
          "bg-snap-red text-white hover:bg-snap-red-dark active:scale-[0.98] shadow-sm hover:-translate-y-[1px]",
        secondary:
          "bg-transparent text-snap-charcoal border border-snap-border hover:border-snap-charcoal active:scale-[0.98]",
        ghost:
          "bg-transparent text-snap-gray hover:text-snap-charcoal underline-offset-4 hover:underline",
        white:
          "bg-white text-snap-red hover:bg-snap-surface active:scale-[0.98] hover:-translate-y-[1px]",
        outline:
          "border border-snap-red text-snap-red bg-transparent hover:bg-snap-red-tint active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-md",
        md: "h-11 px-7 text-sm rounded-[6px]",
        lg: "h-13 px-8 text-base rounded-[6px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, children, ...props }, ref) => {
    if (href) {
      return (
        <a
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
