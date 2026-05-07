import * as React from "react";
import { Tooltip } from "radix-ui";
import { cn } from "@/lib/utils";

function TooltipProvider({ delayDuration = 300, ...props }: React.ComponentProps<typeof Tooltip.Provider>) {
  return <Tooltip.Provider delayDuration={delayDuration} {...props} />;
}

function TooltipRoot({ ...props }: React.ComponentProps<typeof Tooltip.Root>) {
  return <Tooltip.Root {...props} />;
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof Tooltip.Trigger>) {
  return <Tooltip.Trigger {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof Tooltip.Content>) {
  return (
    <Tooltip.Portal>
      <Tooltip.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 rounded px-2 py-1 text-xs font-medium shadow-sm",
          "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)]",
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
        {...props}
      />
    </Tooltip.Portal>
  );
}

export { TooltipProvider, TooltipRoot as Tooltip, TooltipTrigger, TooltipContent };
