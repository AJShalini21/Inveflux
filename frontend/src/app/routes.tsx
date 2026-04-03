import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { OperationalPage } from "./pages/OperationalPage";
import { InventoryPage } from "./pages/InventoryPage";
import { FinancialPage } from "./pages/FinancialPage";
import { VendorPage } from "./pages/VendorPage";
import { DataUploadPage } from "./pages/DataUploadPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: OperationalPage },
      { path: "inventory", Component: InventoryPage },
      { path: "financial", Component: FinancialPage },
      { path: "vendor", Component: VendorPage },
      { path: "data-upload", Component: DataUploadPage },
    ],
  },
]);
