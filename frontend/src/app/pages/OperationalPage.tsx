import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  operationalService,
  ReorderAlert,
  TopProduct,
  CategoryPerformance,
  SalesTrend,
} from '../services/operational';
import { vendorService, VendorPerformance, PayablesSummary } from '../services/vendor';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { RiskSummaryPanel } from '../components/operational/RiskSummaryPanel';
import { ProductRiskTable } from '../components/operational/ProductRiskTable';
import tokens from '../../styles/tokens';

export function OperationalPage() {
  const [alerts, setAlerts] = useState<ReorderAlert[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [categoryPerf, setCategoryPerf] = useState<CategoryPerformance[]>([]);
  const [salesTrend, setSalesTrend] = useState<SalesTrend[]>([]);
  const [performanceData, setPerformanceData] = useState<VendorPerformance[]>([]);
  const [payables, setPayables] = useState<PayablesSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [alertsData, topProductsData, categoryData, trendData, perfData, payablesData] =
          await Promise.all([
            operationalService.fetchReorderAlerts(),
            operationalService.fetchTopProducts('revenue'),
            operationalService.fetchCategoryPerformance(),
            operationalService.fetchMonthlySalesTrend(),
            vendorService.getVendorPerformance(),
            vendorService.getPayablesSummary(),
          ]);
        setAlerts(alertsData);
        setTopProducts(topProductsData);
        setCategoryPerf(categoryData);
        setSalesTrend(trendData);
        setPerformanceData(perfData);
        setPayables(payablesData);
      } catch (error) {
        console.error('Failed to load operational data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const reorderAlerts = alerts.filter((a) => a.alertLevel === 'RED' || a.alertLevel === 'YELLOW');

  // Group by vendor for Coverage section
  const vendorGroups = alerts.reduce(
    (acc, alert) => {
      if (alert.alertLevel === 'GREEN') return acc;
      if (!acc[alert.vendorName]) {
        acc[alert.vendorName] = [];
      }
      acc[alert.vendorName].push(alert);
      return acc;
    },
    {} as Record<string, ReorderAlert[]>,
  );

  const getRiskColor = (type: string) => {
    switch (type) {
      case 'RED':
        return tokens.colors.dangerLight;
      case 'YELLOW':
        return tokens.colors.warningDark;
      case 'BLUE':
        return tokens.colors.accentBlue; // Overstock cyan
      default:
        return tokens.colors.successLight;
    }
  };

  const getAlertLabel = (level: string) => {
    switch (level) {
      case 'RED':
        return 'Out of Stock';
      case 'YELLOW':
        return 'Low Stock';
      case 'BLUE':
        return 'Overstocked';
      default:
        return 'Healthy';
    }
  };
  const counts = {
    outOfStock: alerts.filter((a) => a.alertLevel === 'RED').length,
    lowStock: alerts.filter((a) => a.alertLevel === 'YELLOW').length,
    overstock: alerts.filter((a) => a.alertLevel === 'BLUE').length,
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader title="Operational Insights" />

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Alerts & Risk Summary */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Risk Summary
            </h2>
          </div>
          <RiskSummaryPanel
            outOfStock={counts.outOfStock}
            lowStock={counts.lowStock}
            overstock={counts.overstock}
          />
        </div>

        {/* Right Panel: Vendor Risk Breakdown */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Product Risk Breakdown
            </h2>
            <div className="flex gap-4 text-xs font-medium text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tokens.colors.dangerLight }}
                />
                Critical
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tokens.colors.warningDark }}
                />
                Caution
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tokens.colors.accentBlue }}
                />
                Excess
              </span>
            </div>
          </div>

          <div className="flex flex-col overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
            {Object.keys(vendorGroups).length > 0 ? (
              <ProductRiskTable vendorGroups={vendorGroups} />
            ) : (
              <div className="h-64 flex flex-col items-center justify-center bg-white border border-dashed border-gray-200 rounded-2xl text-gray-400 space-y-3">
                <p className="text-sm font-medium">
                  {loading
                    ? 'Analyzing vendor data...'
                    : 'No inventory risks detected across vendors'}
                </p>
                {!loading && <p className="text-xs">Your supply chain is currently healthy</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vendor Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Total Vendor Payables KPI */}
        <Card className="p-6 flex flex-col justify-center col-span-1 border-none shadow-sm bg-white">
          <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-3">
            Total Vendor Payables
          </div>
          <div className="text-4xl font-light mb-2" style={{ color: tokens.colors.dangerLight }}>
            {payables ? formatCurrency(payables.totalPayables) : '$0'}
          </div>
          <div className="text-xs text-gray-500 font-medium">Outstanding payments</div>
        </Card>

        {/* Vendor Performance Table */}
        <Card className="p-6 col-span-1 lg:col-span-3 border-none shadow-sm bg-white">
          <h3 className="text-base font-black text-gray-900 mb-4 tracking-tight">
            VENDOR PERFORMANCE
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider rounded-tl-lg">
                    Vendor Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Payables
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Avg Payment Delay
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider rounded-tr-lg">
                    % Late Payments
                  </th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((vendor, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-slate-700">{vendor.vendorName}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatCurrency(vendor.totalPayables)}
                    </td>
                    <td
                      className="py-3 px-4 font-bold"
                      style={{
                        color:
                          vendor.avgPaymentDelay > 15
                            ? tokens.colors.dangerLight
                            : vendor.avgPaymentDelay > 5
                              ? tokens.colors.warningDark
                              : tokens.colors.successLight,
                      }}
                    >
                      {vendor.avgPaymentDelay.toFixed(1)} Days
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                          vendor.latePaymentPercentage > 10
                            ? 'bg-rose-50'
                            : vendor.latePaymentPercentage > 0
                              ? 'bg-orange-50'
                              : 'bg-lime-50'
                        }`}
                        style={{
                          color:
                            vendor.latePaymentPercentage > 10
                              ? tokens.colors.dangerLight
                              : vendor.latePaymentPercentage > 0
                                ? tokens.colors.warningDark
                                : tokens.colors.successLight,
                        }}
                      >
                        {vendor.latePaymentPercentage.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
