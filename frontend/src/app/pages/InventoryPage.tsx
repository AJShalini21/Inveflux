import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { PieChart, Pie, Cell, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from "recharts";
import { inventoryService, StockPulse, HealthStatus, Velocity, RiskProduct } from "../services/inventory";

export function InventoryPage() {
  const [stockPulse, setStockPulse] = useState<StockPulse | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [velocity, setVelocity] = useState<Velocity[]>([]);
  const [riskProducts, setRiskProducts] = useState<RiskProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pulseData, healthData, velocityData, riskData] = await Promise.all([
          inventoryService.fetchStockPulse(),
          inventoryService.fetchDioHealth(),
          inventoryService.fetchVelocity(),
          inventoryService.fetchRiskProducts(),
        ]);
        setStockPulse(pulseData);
        setHealthStatus(healthData);
        setVelocity(velocityData);
        setRiskProducts(riskData);
      } catch (err) {
        console.error("Error fetching inventory data:", err);
        setError("Failed to load inventory data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading inventory data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
      <div className="text-lg text-[#f43f5e]">{error}</div>
      </div>
    );
  }

  // Map Backend Stock Pulse Distribution to Chart Data
  const productDistributionData = stockPulse ? [
    { name: "Healthy", value: stockPulse.summary.healthyStockCount, color: "#84cc16" },
    { name: "Low", value: stockPulse.summary.lowStockCount, color: "#f97316" },
    { name: "Out", value: stockPulse.summary.outOfStockCount, color: "#f43f5e" },
    { name: "Overstock", value: stockPulse.summary.overstockedCount, color: "#06b6d4" },
  ] : [];

  const inventoryValueData = stockPulse?.categoryValueContribution.map((c, i) => {
    const COLORS = ["#0ea5e9", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#6366f1"];
    return {
      name: c.category,
      value: c.inventoryValue,
      color: COLORS[i % COLORS.length]
    };
  }) || [];

  const velocityChartData = velocity.map(v => {
    const color =
      v.sellThroughRate >= 60 ? "#10b981" : // High (Green)
      v.sellThroughRate >= 40 ? "#3b82f6" : // Medium-High (Blue)
      v.sellThroughRate >= 20 ? "#f97316" : // Low (Orange)
      "#ef4444"; // Very Low (Red)
      
    return {
      ...v,
      coverage: v.stockCoverageDays,
      sellThrough: v.sellThroughRate,
      color: color
    };
  });


  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <PageHeader title="Stock Pulse" />

      {/* Stock Pulse Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stock Pulse - Dual Ring Donut */}
        <Card className="p-6">
          <h3 className="text-base mb-2">STOCK PULSE - Current Inventory Health</h3>
          <div className="grid grid-cols-2 gap-8">
            {/* % of Products */}
            <div className="flex flex-col items-center">
              <div className="text-xs mb-4 text-gray-600">% of Products</div>
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {productDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className="text-2xl font-bold">{stockPulse?.summary.totalProducts}</div>
                  <div className="text-xs text-gray-600">Total Products</div>
                </div>
              </div>
              <div className="mt-6 space-y-2 w-full">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-[#84cc16]"></div>
                      <span>Healthy</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
                      <span>Low</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-[#f43f5e]"></div>
                      <span>Out</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-[#06b6d4]"></div>
                      <span>Overstock</span>
                    </div>
                  </div>
              </div>
            </div>

            {/* % Inventory Value */}
            <div className="flex flex-col items-center">
              <div className="text-xs mb-4 text-gray-600">% Inventory Value</div>
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={inventoryValueData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {inventoryValueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col text-center px-4">
                  <div className="text-lg font-bold">
                    ${((stockPulse?.summary.totalInventoryValue || 0) / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-[10px] text-gray-600">Total Value</div>
                </div>
              </div>
              <div className="mt-6 space-y-2 w-full px-2 max-h-24 overflow-y-auto custom-scrollbar">
                {inventoryValueData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-600 truncate max-w-[120px]" title={item.name}>{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">${(item.value / 1000).toFixed(1)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* DIO Gauge */}
        <Card className="p-6">
          <h3 className="text-base mb-4">DIO GAUGE - Inventory Efficiency Health</h3>
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-[280px] aspect-[2/1] mb-8 mt-2">
              {(() => {
                const dioValue = Math.min(healthStatus?.dio || 0, 120);
                const angle = 180 - (dioValue / 120) * 180;
                const rad = (angle * Math.PI) / 180;
                const nx = 100 + 65 * Math.cos(rad);
                const ny = 100 - 65 * Math.sin(rad);
                
                return (
                  <svg className="w-full h-full drop-shadow-sm" viewBox="0 0 200 110">
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 20 100 A 80 80 0 0 1 60 30.7"
                      fill="none"
                      stroke="#84cc16"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 60 30.7 A 80 80 0 0 1 140 30.7"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="16"
                    />
                    <path
                      d="M 140 30.7 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />
                    <line x1="100" y1="100" x2={nx} y2={ny} stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="100" cy="100" r="6" fill="#1e293b" />
                    <circle cx="100" cy="100" r="2.5" fill="#ffffff" />
                  </svg>
                );
              })()}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-center w-full">
                <div className="text-3xl font-bold text-gray-800">{healthStatus?.dio.toFixed(0)} <span className="text-sm text-gray-500 font-medium">Days</span></div>
              </div>
            </div>
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Health Rating</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#06b6d4]"></div>
                  <span className="font-medium text-[#06b6d4]">{healthStatus?.healthStatus}</span>
                </div>
              </div>
              <div className="space-y-2 pl-5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#f43f5e]"></div>
                    <span>Dead Stock</span>
                  </div>
                  <span>{healthStatus?.deadStockPercentage.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#06b6d4]"></div>
                    <span>Inventory Turnover</span>
                  </div>
                  <span>{healthStatus?.inventoryTurnover.toFixed(1)}x</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#f97316]"></div>
                    <span>Overstock</span>
                  </div>
                  <span>{healthStatus?.overstockPercentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Inventory Velocity & Risk Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Velocity */}
        <Card className="p-6">
          <h3 className="text-base mb-2 font-semibold">INVENTORY VELOCITY</h3>
          <div className="mb-4">
            <div className="flex items-center gap-4 text-xs mb-2">
              <span className="text-gray-600">Avg Velocity Score:</span>
              <span className="text-2xl font-bold text-[#06b6d4]">
                {(velocityChartData.reduce((acc, v) => acc + v.velocityScore, 0) / (velocityChartData.length || 1)).toFixed(0)}
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis type="number" dataKey="coverage" name="Stock Coverage (Days)" label={{ value: "Stock Coverage (Days)", position: "bottom", fontSize: 10 }} />
              <YAxis type="number" dataKey="sellThrough" name="Sell-through Rate %" label={{ value: "Sell-through Rate %", angle: -90, position: "insideLeft", fontSize: 10 }} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="Products" data={velocityChartData} fill="#06b6d4">
                {velocityChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>


        </Card>

        {/* Top Risk Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold">TOP RISK PRODUCTS</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">CASH RISK SCORE:</span>
              <span className="font-bold text-[#06b6d4]">{healthStatus?.cashRiskScore.toFixed(1)}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-gray-100 italic">
                <tr>
                  <th className="text-left py-3 font-semibold text-gray-500">ID</th>
                  <th className="text-left py-3 font-semibold text-gray-500">PRODUCT</th>
                  <th className="text-left py-3 font-semibold text-gray-500">CATEGORY</th>
                  <th className="text-left py-3 font-semibold text-gray-500">RISK</th>
                  <th className="text-right py-3 font-semibold text-gray-500">VALUE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {riskProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 text-gray-400 font-mono">#{product.productId}</td>
                    <td className="py-3 font-medium text-gray-700">{product.productName}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        product.riskType === 'OUT_OF_STOCK' ? 'bg-red-50 text-red-600' :
                        product.riskType === 'LOW_STOCK' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {product.riskType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-gray-900">${product.inventoryValue.toLocaleString()}</td>
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