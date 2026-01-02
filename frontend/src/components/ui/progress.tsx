import { ComponentProps } from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends ComponentProps<typeof ProgressPrimitive.Root> {
  /** Accessible label for the progress bar (required for a11y) */
  "aria-label"?: string
  /** ID of element that labels this progress bar */
  "aria-labelledby"?: string
}

function Progress({
  className,
  value,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
