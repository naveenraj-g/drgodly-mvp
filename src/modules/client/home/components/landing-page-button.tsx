import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

export const landingButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-200 text-sm whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-landing-primary)] text-[var(--color-landing-primary-foreground)] hover:bg-[var(--landingpage-primary-dark)] shadow-sm hover:scale-[1.03]",
        outline:
          "border border-[var(--color-landing-border)] text-[var(--color-landing-primary)] hover:bg-[var(--color-landing-muted)] hover:text-[var(--color-landing-foreground)]",
      },
      size: {
        default: "px-6 py-2.5",
        sm: "px-4 py-2 text-sm",
        lg: "px-8 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export function landingButton({ variant, size, className, ...props }: any) {
  return cn(landingButtonVariants({ variant, size, className }), props);
}
