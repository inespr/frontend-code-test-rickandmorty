import * as React from "react";
import { Select } from "radix-ui";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

function SelectRoot(props: React.ComponentProps<typeof Select.Root>) {
  return <Select.Root {...props} />;
}

function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof Select.Trigger>) {
  return (
    <Select.Trigger
      data-slot="select-trigger"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        whiteSpace: "nowrap",
        cursor: "pointer",
        outline: "none",
      }}
      className={cn(className)}
      {...props}
    >
      {children}
      <Select.Icon asChild>
        <ChevronDown size={10} style={{ flexShrink: 0, opacity: 0.6 }} />
      </Select.Icon>
    </Select.Trigger>
  );
}

function SelectValue(props: React.ComponentProps<typeof Select.Value>) {
  return <Select.Value {...props} />;
}

function SelectContent({ className, children, position = "popper", ...props }: React.ComponentProps<typeof Select.Content>) {
  return (
    <Select.Portal>
      <Select.Content
        data-slot="select-content"
        position={position}
        style={{
          zIndex: 100,
          minWidth: "120px",
          overflow: "hidden",
          borderRadius: "6px",
          border: "1px solid var(--border)",
          background: "var(--bg-card)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}
        className={cn(className)}
        {...props}
      >
        <Select.Viewport style={{ padding: "4px" }}>{children}</Select.Viewport>
      </Select.Content>
    </Select.Portal>
  );
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof Select.Item>) {
  return (
    <Select.Item
      data-slot="select-item"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 10px 6px 28px",
        position: "relative",
        fontFamily: "var(--font-mono)",
        fontSize: "0.7rem",
        color: "var(--text-secondary)",
        cursor: "pointer",
        borderRadius: "4px",
        outline: "none",
        userSelect: "none",
      }}
      className={cn(className)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(191,4,4,0.1)";
        (e.currentTarget as HTMLElement).style.color = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "";
        (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
      }}
      {...props}
    >
      <span style={{ position: "absolute", left: "8px", display: "flex", alignItems: "center" }}>
        <Select.ItemIndicator>
          <Check size={11} style={{ color: "var(--accent)" }} />
        </Select.ItemIndicator>
      </span>
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
}

export { SelectRoot as Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
