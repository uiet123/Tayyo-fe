import { createElement } from "react";
import {
  BarChart3,
  Code2,
  Cpu,
  FileText,
  Layers,
  Lightbulb,
  LineChart,
  MessagesSquare,
  Mic,
  Network,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  type LucideIcon,
} from "lucide-react";

/**
 * Resolves the icon names carried by data (constants, mock data) into
 * components, so the data layer never imports React.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  Code2,
  Cpu,
  FileText,
  Layers,
  Lightbulb,
  LineChart,
  MessagesSquare,
  Mic,
  Network,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
};

export function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Sparkles;
}

export function Icon({ name, className }: { name: string; className?: string }) {
  return createElement(resolveIcon(name), { className });
}
