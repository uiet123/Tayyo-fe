"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { useMounted } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsSection } from "./settings-section";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", label: "Light", icon: Sun, hint: "Default Tayyo interface" },
  { value: "dark", label: "Dark", icon: Moon, hint: "Easier on the eyes at night" },
  { value: "system", label: "System", icon: Monitor, hint: "Match your device" },
];

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <SettingsSection
      id="appearance"
      title="Appearance"
      description="Choose how Tayyo looks. Changes apply immediately."
    >
      {!mounted ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {THEMES.map((item) => (
            <Skeleton key={item.value} className="h-[112px] rounded-lg" />
          ))}
        </div>
      ) : (
        <div role="radiogroup" className="grid gap-3 sm:grid-cols-3">
          {THEMES.map((item) => {
            const selected = theme === item.value;
            return (
              <button
                key={item.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setTheme(item.value)}
                className={cn(
                  "flex flex-col items-start rounded-lg border p-4 text-left transition-all",
                  selected
                    ? "border-primary bg-brand-subtle"
                    : "border-border bg-card hover:border-border-strong hover:bg-muted/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md border",
                    selected ? "border-primary/25 bg-background text-primary" : "border-border bg-muted",
                  )}
                >
                  <item.icon className="size-4" strokeWidth={1.9} />
                </span>
                <span
                  className={cn(
                    "mt-3 text-sm font-medium",
                    selected ? "text-primary" : "text-foreground",
                  )}
                >
                  {item.label}
                </span>
                <span className="mt-0.5 text-xs text-muted-foreground">{item.hint}</span>
              </button>
            );
          })}
        </div>
      )}
    </SettingsSection>
  );
}
