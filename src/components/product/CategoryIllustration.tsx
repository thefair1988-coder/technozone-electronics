import {
  Smartphone,
  Laptop,
  Tv,
  ChefHat,
  Headphones,
  WashingMachine,
  Plug,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/types/product";
import { cn } from "@/lib/utils";

const ICONS: Record<IconName, LucideIcon> = {
  smartphone: Smartphone,
  laptop: Laptop,
  tv: Tv,
  "chef-hat": ChefHat,
  headphones: Headphones,
  "washing-machine": WashingMachine,
  plug: Plug,
};

interface CategoryIllustrationProps {
  icon: IconName;
  gradient: string;
  className?: string;
  iconClassName?: string;
}

export function CategoryIllustration({
  icon,
  gradient,
  className,
  iconClassName,
}: CategoryIllustrationProps) {
  const Icon = ICONS[icon] ?? Plug;
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl bg-gradient-to-br",
        gradient,
        className,
      )}
    >
      <Icon className={cn("text-white/90", iconClassName)} strokeWidth={1.5} aria-hidden />
    </div>
  );
}
