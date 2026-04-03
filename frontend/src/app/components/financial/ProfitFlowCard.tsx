import { motion } from "motion/react";
import { Card } from "../ui/card";

type ProfitFlowCardProps = {
  revenueTotal: number;
  cashPercentage: number;
  digitalPercentage: number;
  grossMargin: number;
  grossMarginPct: number;
  netProfit: number;
  formatMoney: (value: number) => string;
};

export function ProfitFlowCard(props: ProfitFlowCardProps) {
  const totalRevenue = Math.max(0, props.revenueTotal ?? 0);
  const grossMargin = Math.max(0, props.grossMargin ?? 0);
  const netProfit = Math.max(0, props.netProfit ?? 0);
  const cogs = Math.max(0, totalRevenue - grossMargin);
  const opex = Math.max(0, grossMargin - netProfit);

  const cashPct = props.cashPercentage ?? 0;
  const digitalPct = props.digitalPercentage ?? 0;
  const cashAmount = (totalRevenue * cashPct) / 100;
  const digitalAmount = (totalRevenue * digitalPct) / 100;

  // SVG Dimensions & Layout
  const w = 1000;
  const h = 450;
  const nodeW = 4;
  const col1 = 80;
  const col2 = 460;
  const col3 = 840;

  // Proportional sizing (max height for nodes)
  const maxBarH = 220;
  const pxPerUnit = totalRevenue > 0 ? maxBarH / totalRevenue : 0;

  const cashH = Math.max(12, cashAmount * pxPerUnit);
  const digitalH = Math.max(12, digitalAmount * pxPerUnit);
  const netProfitH = Math.max(12, netProfit * pxPerUnit);
  const opexH = Math.max(12, opex * pxPerUnit);
  const cogsH = Math.max(12, cogs * pxPerUnit);
  const totalH = Math.max(12, totalRevenue * pxPerUnit);

  // Vertical offsets to create "flow" curves
  const startY_cash = (h - (cashH + digitalH + 60)) / 2;
  const startY_digital = startY_cash + cashH + 60;

  const midY = (h - totalH) / 2;

  const endY_profit = (h - (netProfitH + opexH + cogsH + 100)) / 2;
  const endY_opex = endY_profit + netProfitH + 50;
  const endY_cogs = endY_opex + opexH + 50;

  // Sankey Link Path Helper
  const ribbonPath = (x0: number, y0: number, x1: number, y1: number, width0: number, width1: number) => {
    const cpX = (x1 - x0) / 2.2;
    return `M ${x0} ${y0} C ${x0 + cpX} ${y0}, ${x1 - cpX} ${y1}, ${x1} ${y1} L ${x1} ${y1 + width1} C ${x1 - cpX} ${y1 + width1}, ${x0 + cpX} ${y0 + width0}, ${x0} ${y0 + width0} Z`;
  };

  const hasData = totalRevenue > 0;

  return (
    <Card className="p-10 bg-white border-slate-200 overflow-hidden shadow-sm relative">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Financial Flow & Profitability</h3>
          <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-[0.2em]">
            Revenue Conversion Strategy
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Efficiency Ratio</span>
          <div className="text-3xl font-black text-[#84cc16]">
            {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0.0"}%
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[1000/450]">
        {!hasData ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm font-medium">
            Insufficient financial data to render flow
          </div>
        ) : (
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
            <defs>
              <linearGradient id="flow-cash" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="flow-digital" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="flow-rev-profit" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#84cc16" />
                <stop offset="100%" stopColor="#84cc16" />
              </linearGradient>
              <linearGradient id="flow-rev-opex" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              <linearGradient id="flow-rev-cogs" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>

            {/* Link Flows (Bezier Ribbons) */}
            {/* Payment -> Revenue */}
            <motion.path
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              d={ribbonPath(col1 + nodeW, startY_cash, col2, midY, cashH, totalH * (cashPct / 100))}
              fill="url(#flow-cash)"
            />
            <motion.path
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
              d={ribbonPath(col1 + nodeW, startY_digital, col2, midY + totalH * (cashPct / 100), digitalH, totalH * (digitalPct / 100))}
              fill="url(#flow-digital)"
            />

            {/* Revenue -> Outputs */}
            <motion.path
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut", delay: 0.6 }}
              d={ribbonPath(col2 + nodeW, midY, col3, endY_profit, totalH * (netProfit / totalRevenue), netProfitH)}
              fill="url(#flow-rev-profit)"
            />
            <motion.path
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut", delay: 0.8 }}
              d={ribbonPath(col2 + nodeW, midY + totalH * (netProfit / totalRevenue), col3, endY_opex, totalH * (opex / totalRevenue), opexH)}
              fill="url(#flow-rev-opex)"
            />
            <motion.path
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut", delay: 1.0 }}
              d={ribbonPath(col2 + nodeW, midY + totalH * ((netProfit + opex) / totalRevenue), col3, endY_cogs, totalH * (cogs / totalRevenue), cogsH)}
              fill="url(#flow-rev-cogs)"
            />

            {/* Nodes (Vertical Bars) */}
            <rect x={col1} y={startY_cash} width={nodeW} height={cashH} fill="#8f2b5dff" rx={3} />
            <rect x={col1} y={startY_digital} width={nodeW} height={digitalH} fill="#1e4686ff" rx={3} />
            <rect x={col2} y={midY} width={nodeW} height={totalH} fill="#ffffff" rx={3} />
            <rect x={col3} y={endY_profit} width={nodeW} height={netProfitH} fill="#4f7a0dff" rx={3} />
            <rect x={col3} y={endY_opex} width={nodeW} height={opexH} fill="#a34d0fff" rx={3} />
            <rect x={col3} y={endY_cogs} width={nodeW} height={cogsH} fill="#9e283cff" rx={3} />

            {/* Labels */}
            <g className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
              {/* Payment Labels */}
              <text x={col1 - 15} y={startY_cash + cashH / 2} textAnchor="end" className="fill-slate-800">Cash</text>
              <text x={col1 - 15} y={startY_cash + cashH / 2 + 14} textAnchor="end" className="fill-pink-500 font-black">{`${cashPct.toFixed(1)}%`}</text>

              <text x={col1 - 15} y={startY_digital + digitalH / 2} textAnchor="end" className="fill-slate-800">Digital</text>
              <text x={col1 - 15} y={startY_digital + digitalH / 2 + 14} textAnchor="end" className="fill-blue-500 font-black">{`${digitalPct.toFixed(1)}%`}</text>

              {/* Revenue Label */}
              <text x={col2 + nodeW / 2} y={midY - 25} textAnchor="middle" className="fill-slate-900 font-black text-sm tracking-widest">Total Revenue</text>
              <text x={col2 + nodeW / 2} y={midY - 10} textAnchor="middle" className="fill-emerald-600 font-black text-xs">{props.formatMoney(totalRevenue)}</text>

              {/* Output Labels */}
              <text x={col3 + nodeW + 15} y={endY_profit + netProfitH / 2} className="fill-emerald-800">Net Profit</text>
              <text x={col3 + nodeW + 15} y={endY_profit + netProfitH / 2 + 14} className="fill-slate-400 font-bold">{props.formatMoney(netProfit)}</text>

              <text x={col3 + nodeW + 15} y={endY_opex + opexH / 2} className="fill-amber-800">Opex</text>
              <text x={col3 + nodeW + 15} y={endY_opex + opexH / 2 + 14} className="fill-slate-400 font-bold">{props.formatMoney(opex)}</text>

              <text x={col3 + nodeW + 15} y={endY_cogs + cogsH / 2} className="fill-rose-800">COGS</text>
              <text x={col3 + nodeW + 15} y={endY_cogs + cogsH / 2 + 14} className="fill-slate-400 font-bold">{props.formatMoney(cogs)}</text>
            </g>
          </svg>
        )}
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#84cc16]/20 border border-[#84cc16]" />
            <span className="text-xs font-medium text-slate-600">Profitable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#f43f5e]/20 border border-[#f43f5e]" />
            <span className="text-xs font-medium text-slate-600">Goods Cost</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#f97316]/20 border border-[#f97316]" />
            <span className="text-xs font-medium text-slate-600">Operations</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-300 font-bold">
          Analytics Engine • InveFlux Core v2.4
        </div>
      </div>
    </Card>
  );
}

