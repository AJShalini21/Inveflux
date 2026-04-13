import { useState, Fragment } from 'react';
import { ChevronsDown, ChevronsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ReorderAlert } from '../../services/operational';
import { CoverageIndicator } from './CoverageIndicator';

interface ProductRiskTableProps {
  vendorGroups: Record<string, ReorderAlert[]>;
}

export function ProductRiskTable({ vendorGroups }: ProductRiskTableProps) {
  const [isGlobalExpanded, setIsGlobalExpanded] = useState(false);

  const getRiskColor = (type: string) => {
    switch (type) {
      case 'RED':
        return 'bg-[#f43f5e]';
      case 'YELLOW':
        return 'bg-[#f97316]';
      case 'BLUE':
        return 'bg-[#06b6d4]';
      default:
        return 'bg-[#84cc16]';
    }
  };

  const getAlertLabel = (level: string) => {
    switch (level) {
      case 'RED':
        return 'OUT OF STOCK';
      case 'YELLOW':
        return 'LOW STOCK';
      case 'BLUE':
        return 'OVERSTOCK';
      default:
        return 'HEALTHY';
    }
  };

  return (
    <div className="border border-gray-100 rounded-xl bg-white shadow-sm flex flex-col max-h-[600px] overflow-hidden">
      <div className="overflow-y-auto overflow-x-auto custom-scrollbar flex-1 relative">
        <Table>
          <TableHeader className="bg-gray-50/95 sticky top-0 z-20 backdrop-blur-sm border-b border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-semibold text-gray-500 uppercase tracking-wider text-[11px] w-[35%] py-4">
                Vendor
              </TableHead>
              <TableHead className="font-semibold text-gray-500 uppercase tracking-wider text-[11px] py-4">
                Total Risks
              </TableHead>
              <TableHead className="font-semibold text-gray-500 uppercase tracking-wider text-[11px] py-4">
                Risk Breakdown
              </TableHead>
              <TableHead className="text-right pr-4 py-3">
                <button
                  onClick={() => setIsGlobalExpanded(!isGlobalExpanded)}
                  className="p-1 rounded-full hover:bg-slate-200 transition-colors text-slate-500 bg-slate-100 shadow-sm border border-slate-200"
                  title={isGlobalExpanded ? 'Collapse All' : 'Expand All'}
                >
                  {isGlobalExpanded ? <ChevronsUp size={18} /> : <ChevronsDown size={18} />}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(vendorGroups)
              .sort(([, alertsA], [, alertsB]) => {
                const redA = alertsA.filter((a) => a.alertLevel === 'RED').length;
                const redB = alertsB.filter((a) => a.alertLevel === 'RED').length;
                if (redB !== redA) return redB - redA;
                const yellowA = alertsA.filter((a) => a.alertLevel === 'YELLOW').length;
                const yellowB = alertsB.filter((a) => a.alertLevel === 'YELLOW').length;
                return yellowB - yellowA;
              })
              .map(([vendor, alerts]) => {
                const stats = {
                  red: alerts.filter((a) => a.alertLevel === 'RED').length,
                  yellow: alerts.filter((a) => a.alertLevel === 'YELLOW').length,
                  blue: alerts.filter((a) => a.alertLevel === 'BLUE').length,
                };
                const sortedAlerts = [...alerts].sort(
                  (a, b) => a.stockCoverageDays - b.stockCoverageDays,
                );

                return (
                  <Fragment key={vendor}>
                    <TableRow
                      className={`transition-colors ${isGlobalExpanded ? 'bg-slate-50/30 border-b-transparent' : 'hover:bg-slate-50 border-b-slate-100'}`}
                    >
                      <TableCell className="py-4 align-middle">
                        <span className="font-bold text-slate-800 tracking-tight">{vendor}</span>
                      </TableCell>
                      <TableCell className="py-4 align-middle">
                        <span className="font-black text-slate-700 tracking-tight bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1.5 rounded-lg text-[11px] shadow-sm ring-1 ring-slate-200/50">
                          {alerts.length}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 align-middle">
                        <div className="flex items-center gap-2">
                          {[
                            { key: 'outOfStock', count: stats.red, color: 'bg-[#f43f5e]' },
                            { key: 'lowStock', count: stats.yellow, color: 'bg-[#f97316]' },
                            { key: 'overstock', count: stats.blue, color: 'bg-[#06b6d4]' },
                          ].map((indicator) => (
                            <div
                              key={indicator.key}
                              className={[
                                indicator.color,
                                'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white shadow-sm ring-2 ring-white/50',
                                indicator.count === 0 ? 'hidden' : '',
                              ].join(' ')}
                              title={`${indicator.count} items`}
                            >
                              {indicator.count}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 align-middle"></TableCell>
                    </TableRow>

                    {/* Expanded Row */}
                    <AnimatePresence>
                      {isGlobalExpanded && (
                        <TableRow className="bg-slate-50/30 hover:bg-slate-50/30 border-b-slate-100">
                          <TableCell colSpan={4} className="p-0 border-b">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="p-1 pb-4 px-6">
                                <div className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
                                  <Table>
                                    <TableHeader className="bg-slate-100/50">
                                      <TableRow className="border-none">
                                        <TableHead className="py-2 px-4 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                          ID
                                        </TableHead>
                                        <TableHead className="py-2 px-4 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                          Product Name
                                        </TableHead>
                                        <TableHead className="py-2 px-4 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                          Risk Type
                                        </TableHead>
                                        <TableHead className="text-right py-2 px-4 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                          Coverage
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {sortedAlerts.map((alert) => (
                                        <TableRow
                                          key={alert.productId}
                                          className="border-slate-50 hover:bg-slate-50/80 transition-colors"
                                        >
                                          <TableCell className="py-2 px-4 text-[11px] font-mono text-slate-400 tracking-tight">
                                            #{alert.productId}
                                          </TableCell>
                                          <TableCell className="py-2 px-4 font-semibold text-[12px] text-slate-700 tracking-tight">
                                            {alert.productName}
                                          </TableCell>
                                          <TableCell className="py-2 px-4 flex items-center gap-1.5 h-full">
                                            <Badge
                                              className={`${getRiskColor(alert.alertLevel)} text-white border-none shadow-sm text-[9px] px-2 py-0.5 rounded-full font-bold tracking-widest`}
                                            >
                                              {getAlertLabel(alert.alertLevel)}
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="py-2 px-4 flex justify-end">
                                            <CoverageIndicator days={alert.stockCoverageDays} />
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </Fragment>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
