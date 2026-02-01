import { cn } from "@/lib/utils";

interface ProgressProps {
  className?: string;
  value?: number;
  max?: number;
}

export function Progress({ className, value = 65, max = 100 }: ProgressProps) {
  const percentage = (value / max) * 100;
  
  return (
    <div
      className={cn(
        "h-1 w-full bg-[#e7f7f3] rounded-full overflow-hidden",
        className
      )}
    >
      <div
        className="h-full bg-linear-to-r from-[#1e7864] to-[#008d6e] transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
