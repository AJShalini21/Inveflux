import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Upload, FileText, CheckCircle, AlertCircle, Clock, Download } from "lucide-react";
import { useState } from "react";

export function DataUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: "inventory_data_2024.csv", status: "completed", size: "2.4 MB", date: "2024-03-01" },
    { name: "sales_transactions.xlsx", status: "completed", size: "5.1 MB", date: "2024-03-01" },
    { name: "vendor_information.csv", status: "processing", size: "1.8 MB", date: "2024-03-02" },
  ]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <PageHeader title="Data Upload" />

      {/* Upload Zones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inventory Data Upload */}
        <Card className="p-6">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[var(--bg-primary)] transition-colors cursor-pointer"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)" }}
            >
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-base mb-2">Inventory Data</h3>
            <p className="text-xs text-gray-500 mb-4">Upload CSV or Excel files with inventory information</p>
            <Button
              variant="outline"
              className="text-sm"
              style={{ borderColor: "var(--bg-primary)", color: "var(--bg-primary)" }}
            >
              Select File
            </Button>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <div className="mb-2">Supported formats:</div>
            <ul className="list-disc list-inside space-y-1">
              <li>CSV (.csv)</li>
              <li>Excel (.xlsx, .xls)</li>
            </ul>
          </div>
        </Card>

        {/* Sales Data Upload */}
        <Card className="p-6">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[var(--bg-primary)] transition-colors cursor-pointer"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)" }}
            >
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-base mb-2">Sales Transactions</h3>
            <p className="text-xs text-gray-500 mb-4">Upload order and sales transaction data</p>
            <Button
              variant="outline"
              className="text-sm"
              style={{ borderColor: "var(--bg-primary)", color: "var(--bg-primary)" }}
            >
              Select File
            </Button>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <div className="mb-2">Required columns:</div>
            <ul className="list-disc list-inside space-y-1">
              <li>Order ID, Date, Amount</li>
              <li>Product SKU, Quantity</li>
            </ul>
          </div>
        </Card>

        {/* Vendor Data Upload */}
        <Card className="p-6">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[var(--bg-primary)] transition-colors cursor-pointer"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)" }}
            >
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-base mb-2">Vendor Information</h3>
            <p className="text-xs text-gray-500 mb-4">Upload vendor and supplier data</p>
            <Button
              variant="outline"
              className="text-sm"
              style={{ borderColor: "var(--bg-primary)", color: "var(--bg-primary)" }}
            >
              Select File
            </Button>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <div className="mb-2">Required columns:</div>
            <ul className="list-disc list-inside space-y-1">
              <li>Vendor Name, ID</li>
              <li>Payables, Lead Time</li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Upload History */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base">Upload History</h3>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export Template
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left text-xs">
                <th className="py-3 px-4">FILE NAME</th>
                <th className="py-3 px-4">SIZE</th>
                <th className="py-3 px-4">UPLOAD DATE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{file.size}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{file.date}</td>
                  <td className="py-4 px-4">
                    {file.status === "completed" ? (
                      <span className="flex items-center gap-2 text-xs text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    ) : file.status === "processing" ? (
                      <span className="flex items-center gap-2 text-xs text-blue-600">
                        <Clock className="w-4 h-4" />
                        Processing
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-xs text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Upload Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-base mb-4">Data Upload Guidelines</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "var(--gradient-accent)" }}
              >
                <span className="text-white text-xs">1</span>
              </div>
              <p>Ensure your files are in CSV or Excel format with proper column headers</p>
            </div>
            <div className="flex items-start gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "var(--gradient-accent)" }}
              >
                <span className="text-white text-xs">2</span>
              </div>
              <p>Maximum file size is 50 MB per upload</p>
            </div>
            <div className="flex items-start gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "var(--gradient-accent)" }}
              >
                <span className="text-white text-xs">3</span>
              </div>
              <p>Data will be processed within 5-10 minutes after upload</p>
            </div>
            <div className="flex items-start gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "var(--gradient-accent)" }}
              >
                <span className="text-white text-xs">4</span>
              </div>
              <p>Download our template files to ensure proper formatting</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-base mb-4">Processing Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Inventory Data</span>
                <span className="text-green-600">100%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Sales Transactions</span>
                <span className="text-green-600">100%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Vendor Information</span>
                <span style={{ color: "var(--bg-primary)" }}>65%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full animate-pulse"
                  style={{ width: "65%", background: "var(--gradient-accent)" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-blue-700 mb-1">Processing in progress</div>
                <div className="text-gray-600 text-xs">
                  Your vendor information file is currently being processed. You'll receive a notification when it's complete.
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}