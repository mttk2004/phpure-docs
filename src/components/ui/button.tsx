import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Custom CSS class cho các button variants
const buttonThemeStyles = `
.button-default {
  background-color: var(--color-primary);
  color: var(--color-white);
}
.dark .button-default {
  background-color: var(--color-primary-dark);
}
.button-default:hover {
  background-color: color-mix(in srgb, var(--color-primary) 90%, transparent);
}
.dark .button-default:hover {
  background-color: color-mix(in srgb, var(--color-primary-dark) 90%, transparent);
}

.button-destructive {
  background-color: var(--color-error);
  color: var(--color-white);
}
.dark .button-destructive {
  background-color: var(--color-error-dark);
}
.button-destructive:hover {
  background-color: color-mix(in srgb, var(--color-error) 90%, transparent);
}
.dark .button-destructive:hover {
  background-color: color-mix(in srgb, var(--color-error-dark) 90%, transparent);
}

.button-outline {
  border: 1px solid var(--color-gray-300);
  background-color: var(--color-bg);
}
.dark .button-outline {
  border-color: var(--color-gray-600);
  background-color: var(--color-text);
}
.button-outline:hover {
  background-color: var(--color-accent);
  color: var(--color-accent-foreground);
}
.dark .button-outline:hover {
  background-color: var(--color-accent-dark);
}

.button-secondary {
  background-color: var(--color-secondary);
  color: var(--color-white);
}
.dark .button-secondary {
  background-color: var(--color-secondary-dark);
}
.button-secondary:hover {
  background-color: color-mix(in srgb, var(--color-secondary) 90%, transparent);
}
.dark .button-secondary:hover {
  background-color: color-mix(in srgb, var(--color-secondary-dark) 90%, transparent);
}

.button-ghost:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
}
.dark .button-ghost:hover {
  background-color: var(--color-primary-dark);
}

.button-link {
  color: var(--color-primary);
  text-decoration: none;
}
.dark .button-link {
  color: var(--color-primary-dark);
}
.button-link:hover {
  text-decoration: underline;
}

.button-accent {
  background-color: var(--color-accent);
  color: var(--color-white);
}
.dark .button-accent {
  background-color: var(--color-accent-dark);
}
.button-accent:hover {
  background-color: color-mix(in srgb, var(--color-accent) 90%, transparent);
}
.dark .button-accent:hover {
  background-color: color-mix(in srgb, var(--color-accent-dark) 90%, transparent);
}
`;

// Thêm style vào document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = buttonThemeStyles;
  document.head.appendChild(styleElement);
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "button-default",
        destructive: "button-destructive",
        outline: "button-outline",
        secondary: "button-secondary",
        ghost: "button-ghost",
        link: "button-link underline-offset-4",
        accent: "button-accent",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
