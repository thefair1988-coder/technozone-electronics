import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ quantity, onChange, min = 1, max = 99 }: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={quantity <= min}
        onClick={() => onChange(quantity - 1)}
        aria-label="הפחת כמות"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <span className="w-6 text-center text-sm font-medium">{quantity}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
        aria-label="הוסף כמות"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
