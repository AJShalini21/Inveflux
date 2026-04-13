import { Badge } from '../ui/badge';

interface CoverageIndicatorProps {
  days: number;
}

export function CoverageIndicator({ days }: CoverageIndicatorProps) {
  // Cap at 90 days for the progress bar visual width
  const fillPercentage = Math.min(100, (days / 90) * 100);
  const displayDays = Number(days).toFixed(2);

  return (
    <div className="flex items-center justify-end gap-3 w-full ml-auto">
      <div className="text-[11px] font-bold text-slate-600 min-w-[45px] text-right">
        {displayDays}d
      </div>
      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner flex-shrink-0">
        <div
          className="h-full rounded-full"
          style={{
            width: `${fillPercentage}%`,
            background: 'linear-gradient(to right, #8b5cf6, #d946ef)',
          }}
        />
      </div>
    </div>
  );
}
