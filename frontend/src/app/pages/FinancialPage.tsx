import { useState, useEffect } from "react";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import {
  financialService,
  RevenueSummary,
  GrossMargin,
  NetProfit,
  AovSummary,
  PaymentMix,
  ProductProfitability,
  RevenueTrend,
  OrderSizeBucket,
  TopBottomRevenue,
} from "../services/financial";
import { ProfitFlowCard } from "../components/financial/ProfitFlowCard";

export function FinancialPage() {
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null);
  const [grossMargin, setGrossMargin] = useState<GrossMargin | null>(null);
  const [netProfit, setNetProfit] = useState<NetProfit | null>(null);
  const [aov, setAov] = useState<AovSummary | null>(null);
  const [paymentMix, setPaymentMix] = useState<PaymentMix | null>(null);
  const [profitability, setProfitability] = useState<ProductProfitability[]>([]);
  const [revenueTrends, setRevenueTrends] = useState<RevenueTrend[]>([]);
  const [orderDistribution, setOrderDistribution] = useState<OrderSizeBucket[]>([]);
  const [topBottom, setTopBottom] = useState<TopBottomRevenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [revRes, gmRes, npRes, aovRes, pmRes, profRes, trendRes, orderRes, tbRes] =
          await Promise.all([
            financialService.getTotalRevenue(),
            financialService.getGrossMargin(),
            financialService.getNetProfit(),
            financialService.getAverageOrderValue(),
            financialService.getPaymentMix(),
            financialService.getProductProfitability(),
            financialService.getRevenueTrends(),
            financialService.getOrderSizeDistribution(),
            financialService.getTopBottomRevenue(),
          ]);

        setRevenue(revRes);
        setGrossMargin(gmRes);
        setNetProfit(npRes);
        setAov(aovRes);
        setPaymentMix(pmRes);
        setProfitability(profRes);
        setRevenueTrends(trendRes);
        setOrderDistribution(orderRes);
        setTopBottom(tbRes);
        setError(null);
      } catch (err) {
        console.error("Failed to load financial insights:", err);
        setError("Failed to load financial insights. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fmt = (val: number | undefined | null, prefix = "$", decimals = 0) => {
    if (val == null) return `${prefix}0`;
    if (val >= 1_000_000) return `${prefix}${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${prefix}${(val / 1_000).toFixed(1)}K`;
    return `${prefix}${val.toFixed(decimals)}`;
  };

  // Scatter chart needs revenue as a number for the X axis
  const scatterData = profitability.map((p) => ({
    revenue: p.revenueValue,
    margin: p.grossMarginPercentage,
    name: p.productName,
  }));

  // Top vs Bottom data preparation
  const topProducts = topBottom?.topProducts ?? [];
  const bottomProducts = [...(topBottom?.bottomProducts ?? [])].reverse();
  const totalTopRevenue = topProducts.reduce((s, p) => s + (p.revenueValue ?? 0), 0);

  const gmPct = grossMargin?.grossMarginPercentage ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 text-[#f43f5e] rounded-lg max-w-[1600px] mx-auto mt-6">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <PageHeader title="Financial Insights" />

      {/* Profit Flow (Sankey-style) */}
      {revenue && grossMargin && netProfit && paymentMix && (
        <ProfitFlowCard
          revenueTotal={revenue.totalRevenue}
          cashPercentage={paymentMix.cashPercentage}
          digitalPercentage={paymentMix.digitalPercentage}
          grossMargin={grossMargin.grossMargin}
          grossMarginPct={grossMargin.grossMarginPercentage}
          netProfit={netProfit.netProfit}
          formatMoney={(v) => fmt(v)}
        />
      )}

      {/* Revenue Trends / Product Profitability Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-base mb-2">Revenue Trend (Daily)</h3>
          <div className="text-xs text-gray-500 mb-4">Daily revenue for dataset period</div>
          <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickMargin={8} minTickGap={20} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => fmt(val, "$", 0)} />
                <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(val: number) => fmt(val, "$", 0)} />
                <Line type="monotone" dataKey="revenue" stroke="#84cc16" strokeWidth={2} name="Revenue" dot={false} />
              </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-base mb-2">Product Contribution vs Profitability</h3>
          <div className="text-xs text-gray-500 mb-4">Each point = one product (X: revenue, Y: margin %)</div>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="revenue" name="Revenue" tickFormatter={(v) => fmt(v, "$")} label={{ value: "Revenue", position: "bottom" }} />
              <YAxis type="number" dataKey="margin" name="Margin %" label={{ value: "Gross Margin %", angle: -90, position: "insideLeft" }} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ payload }) => {
                  if (!payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border rounded p-2 text-xs shadow">
                      <div className="font-medium">{d.name}</div>
                      <div>Revenue: {fmt(d.revenue)}</div>
                      <div>Margin: {d.margin?.toFixed(1)}%</div>
                    </div>
                  );
                }}
              />
                <Scatter data={scatterData} name="Products">
                  {scatterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.margin > 40 ? "#84cc16" : entry.margin > 25 ? "#f97316" : "#f43f5e"}
                    />
                  ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#84cc16]" /><span>High Margin</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f97316]" /><span>Medium</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f43f5e]" /><span>Low Margin</span></div>
            </div>
        </Card>
      </div>

      {/* Order Size Distribution & Combined Top/Bottom Revenue Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold">Order Size Distribution</h3>
              <p className="text-xs text-gray-500">Distribution of order values</p>
            </div>
            <div className="mb-4 bg-slate-50 rounded-lg p-4 flex items-center justify-between border border-slate-100">
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Target AOV: $85.00</div>
                <div className="text-xl font-bold text-[#06b6d4]">{fmt(aov?.averageOrderValue, "$", 2)}</div>
              </div>
              <div className="w-1/2 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#06b6d4]"
                  style={{ width: `${Math.min(100, ((aov?.averageOrderValue ?? 0) / 85) * 100)}%` }}
                />
                </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={orderDistribution} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="range" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(val: number) => [val, "Orders"]}
              />
                <Bar dataKey="orderCount" radius={[4, 4, 0, 0]}>
                  {orderDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#06b6d4" : "#3b82f6"} />
                  ))}
                </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Combined Top & Bottom Products */}
        <Card className="p-6 flex flex-col">
          <h3 className="text-base font-semibold mb-2">Top & Bottom Products by Revenue</h3>
          <div className="text-xs text-gray-500 mb-4">Performance extremes across inventory</div>
          
          <div className="flex-1 flex flex-col space-y-4">
            {/* Top 5 Section */}
            <div className="flex-1 min-h-[140px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#84cc16]"></div>
                <h4 className="font-bold text-slate-700">Highest Revenue</h4>
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart
                  data={topProducts}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
                >
                  <XAxis type="number" hide domain={[0, 'auto']} />
                  <YAxis
                    type="category"
                    dataKey="productName"
                    fontSize={10}
                    width={80}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(v: number) => [fmt(v), "Revenue"]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                    <Bar dataKey="revenueValue" radius={[0, 4, 4, 0]} barSize={24}>
                      {topProducts.map((_, index) => (
                        <Cell key={`top-${index}`} fill={index === 0 ? "#65a30d" : index < 3 ? "#84cc16" : "#bef264"} />
                      ))}
                    </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Subtle separator */}
            <div className="w-full flex justify-center">
               <div className="w-1/3 h-px bg-gray-100"></div>
            </div>

            {/* Bottom 5 Section */}
            <div className="flex-1 min-h-[140px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#f43f5e]"></div>
                <h4 className="font-bold text-slate-700">Lowest Revenue</h4>
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart
                  data={bottomProducts}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
                >
                  <XAxis type="number" hide domain={[0, 'auto']} />
                  <YAxis
                    type="category"
                    dataKey="productName"
                    fontSize={10}
                    width={80}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(v: number) => [fmt(v), "Revenue"]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                    <Bar dataKey="revenueValue" radius={[0, 4, 4, 0]} barSize={24}>
                      {bottomProducts.map((_, index) => (
                        <Cell key={`bot-${index}`} fill={index === 0 ? "#be123c" : index < 2 ? "#f43f5e" : "#fda4af"} />
                      ))}
                    </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
