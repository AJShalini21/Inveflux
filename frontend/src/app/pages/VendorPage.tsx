import { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  vendorService,
  PayablesSummary,
  PaymentDelaySummary,
  LatePaymentSummary,
  PurchaseShare,
  VendorPerformance,
  VendorProfitContribution,
  VendorScore,
} from '../services/vendor';

import tokens from '../../styles/tokens';

export function VendorPage() {
  const [payables, setPayables] = useState<PayablesSummary | null>(null);
  const [paymentDelay, setPaymentDelay] = useState<PaymentDelaySummary | null>(null);
  const [latePayments, setLatePayments] = useState<LatePaymentSummary | null>(null);
  const [purchaseShare, setPurchaseShare] = useState<PurchaseShare[]>([]);
  const [performanceData, setPerformanceData] = useState<VendorPerformance[]>([]);
  const [profitContributions, setProfitContributions] = useState<VendorProfitContribution[]>([]);
  const [vendorScores, setVendorScores] = useState<VendorScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [payablesRes, delayRes, lateRes, shareRes, perfRes, profitRes, scoreRes] =
          await Promise.all([
            vendorService.getPayablesSummary(),
            vendorService.getAveragePaymentDelay(),
            vendorService.getLatePaymentPercentage(),
            vendorService.getPurchaseShare(),
            vendorService.getVendorPerformance(),
            vendorService.getVendorProfitContributions(),
            vendorService.getVendorScore(),
          ]);

        setPayables(payablesRes);
        setPaymentDelay(delayRes);
        setLatePayments(lateRes);
        setPurchaseShare(shareRes);
        setPerformanceData(perfRes);
        setProfitContributions(profitRes);
        setVendorScores(scoreRes);
        setError(null);
      } catch (err) {
        console.error('Failed to load vendor insights:', err);
        setError('Failed to load vendor insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-4 bg-rose-50 rounded-lg max-w-[1600px] mx-auto mt-6"
        style={{ color: tokens.colors.dangerLight }}
      >
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <PageHeader title="Vendor Insights" />

      {/* KPI Cards (Top Row) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Late Rate KPI */}
        <Card className="p-5 flex flex-col justify-between border-none shadow-sm bg-white hover:shadow-md transition-shadow relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-1 h-full"
            style={{ backgroundColor: tokens.colors.dangerLight }}
          />
          <div className="text-xs uppercase font-bold text-gray-400 mb-2 tracking-wider">
            Late Rate
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-gray-900 tracking-tight">
              {latePayments?.latePaymentPercentage.toFixed(1)}%
            </div>
          </div>
          <div
            className="text-[11px] font-bold mt-2 truncate w-full"
            style={{ color: tokens.colors.dangerLight }}
          >
            Overdue Payments
          </div>
        </Card>

        {/* Top Score KPI */}
        <Card className="p-5 flex flex-col justify-between border-none shadow-sm bg-white hover:shadow-md transition-shadow relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-1 h-full"
            style={{ backgroundColor: tokens.colors.purple }}
          />
          <div className="text-xs uppercase font-bold text-gray-400 mb-2 tracking-wider">
            Top Score
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-gray-900 tracking-tight">
              {vendorScores[0]?.vendorScore.toFixed(1) || '0.0'}
            </div>
          </div>
          <div
            className="text-[11px] font-bold mt-2 truncate w-full"
            title={vendorScores[0]?.vendorName}
            style={{ color: tokens.colors.purple }}
          >
            {vendorScores[0]?.vendorName || 'N/A'}
          </div>
        </Card>

        {/* Top Profit Contributor KPI */}
        <Card className="p-5 flex flex-col justify-between border-none shadow-sm bg-white hover:shadow-md transition-shadow relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-1 h-full"
            style={{ backgroundColor: tokens.colors.teal }}
          />
          <div className="text-xs uppercase font-bold text-gray-400 mb-2 tracking-wider">
            Top Profit Vendor
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-gray-900 tracking-tight">
              {formatCurrency(profitContributions[0]?.totalProfit || 0)}
            </div>
          </div>
          <div
            className="text-[11px] font-bold mt-2 truncate w-full"
            title={profitContributions[0]?.vendorName}
            style={{ color: tokens.colors.teal }}
          >
            {profitContributions[0]?.vendorName || 'N/A'}
          </div>
        </Card>

        {/* Average Payment Delay */}
        <Card className="p-6 flex flex-col justify-center col-span-1">
          <div className="text-sm text-gray-600 mb-4">Average Payment Delay</div>
          <div className="relative">
            <div className="h-6 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full relative"
                style={{
                  width: paymentDelay
                    ? `${Math.min(100, (paymentDelay.averageDelayDays / 30) * 100)}%`
                    : '0%',
                }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-slate-800 rounded-full shadow border-2 border-white"></div>
              </div>
            </div>
            <div className="flex justify-between items-end text-xs text-gray-500 font-medium">
              <span>0 Days</span>
              <div className="text-center">
                <span className="text-2xl font-black block leading-none mb-1 text-slate-800">
                  {paymentDelay ? paymentDelay.averageDelayDays.toFixed(1) : '0'}
                </span>
                <span className="text-[10px] uppercase tracking-wider">Avg Days</span>
              </div>
              <span>30 Days</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Vendor Purchase Share & Profit Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-base font-bold mb-2">Purchase Share %</h3>
          <div className="text-xs text-gray-500 mb-4">Total purchase volume by vendor</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={purchaseShare} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={tokens.colors.neutral200}
              />
              <XAxis dataKey="vendorName" fontSize={10} />
              <YAxis fontSize={10} unit="%" />
              <Tooltip />
              <Bar dataKey="percentageOfTotal" radius={[4, 4, 0, 0]}>
                {purchaseShare.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 2 === 0 ? tokens.colors.purple : tokens.colors.purple}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-bold mb-2">Profit Contribution by Vendor</h3>
          <div className="text-xs text-gray-500 mb-4">Gross profit vs Revenue contribution</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={profitContributions}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={tokens.colors.neutral200}
              />
              <XAxis dataKey="vendorName" fontSize={10} />
              <YAxis fontSize={10} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), '']} />
              <Bar
                dataKey="totalRevenue"
                name="Revenue"
                fill={tokens.colors.textMuted}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="totalProfit"
                name="Profit"
                fill={tokens.colors.teal}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Vendor Reliability & Score Ranking */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h3 className="text-base font-bold mb-4">Vendor Efficiency Scores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendorScores.slice(0, 5).map((score, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100"
              >
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-indigo-600 text-sm border border-indigo-100">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-slate-900">{score.vendorName}</span>
                    <span
                      className="text-sm font-black"
                      style={{ color: tokens.colors.accentBlue }}
                    >
                      {score.vendorScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${Math.min(100, (score.vendorScore / (vendorScores[0]?.vendorScore || 1)) * 100)}%`,
                        background: `linear-gradient(to right, ${tokens.colors.accentBlue}, ${tokens.colors.accentIndigo})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
