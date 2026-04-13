import { Card } from '../ui/card';

interface RiskSummaryPanelProps {
  outOfStock: number;
  lowStock: number;
  overstock: number;
}

export function RiskSummaryPanel({ outOfStock, lowStock, overstock }: RiskSummaryPanelProps) {
  return (
    <div className="flex justify-center w-full mt-4">
      <Card className="bg-slate-900 rounded-[3rem] p-6 pb-8 flex flex-col items-center gap-6 shadow-2xl border-[6px] border-slate-800 shadow-black/40 relative min-w-[140px]">
        {/* Top Hood flair */}
        <div className="absolute top-0 w-20 h-2 bg-slate-700/50 rounded-b-xl" />

        {/* Red Light (Out of Stock) */}
        <div className="group relative flex flex-col items-center mt-2">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ring-4 ring-slate-950 shadow-inner ${outOfStock > 0 ? 'bg-red-500 shadow-[0_0_50px_15px_rgba(239,68,68,0.5)]' : 'bg-red-950/40'}`}
          >
            <span
              className={`font-black text-2xl ${outOfStock > 0 ? 'text-white' : 'text-red-900/50'}`}
            >
              {outOfStock}
            </span>
          </div>
          <div className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.2em] mt-4">
            Critical
          </div>
        </div>

        {/* Yellow Light (Low Stock) */}
        <div className="group relative flex flex-col items-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ring-4 ring-slate-950 shadow-inner ${lowStock > 0 ? 'bg-yellow-400 shadow-[0_0_50px_15px_rgba(250,204,21,0.5)]' : 'bg-yellow-950/40'}`}
          >
            <span
              className={`font-black text-2xl ${lowStock > 0 ? 'text-slate-900' : 'text-yellow-900/50'}`}
            >
              {lowStock}
            </span>
          </div>
          <div className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.2em] mt-4">
            Caution
          </div>
        </div>

        {/* Cyan Light (Overstock) */}
        <div className="group relative flex flex-col items-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ring-4 ring-slate-950 shadow-inner ${overstock > 0 ? 'bg-cyan-400 shadow-[0_0_50px_15px_rgba(34,211,238,0.5)]' : 'bg-cyan-950/40'}`}
          >
            <span
              className={`font-black text-2xl ${overstock > 0 ? 'text-slate-900' : 'text-cyan-900/50'}`}
            >
              {overstock}
            </span>
          </div>
          <div className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.2em] mt-4">
            Excess
          </div>
        </div>
      </Card>
    </div>
  );
}
