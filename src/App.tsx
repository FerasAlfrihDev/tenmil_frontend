import { Routes, Route } from 'react-router-dom';
import { AdminLayout, DashboardLayout, PublicLayout } from './layouts';
import { useAuth } from './context/AuthContext';
import { useEffect, useState } from 'react';
import { fetchTenantBySubdomain } from './utils/fakeApi';
import { AdminCompaniesPage, AdminUsersPage, DynamicFormPage, NotFoundPage, TenantAssetsDetailsPage, TenantDashboardPage, TenantReportsPage, TenantWorkOrderDetailsPage, TenantWorkOrderPage, TennantAssetsPage } from './pages';
import LoginPage from './pages/Authentication/LoginPage';
import { ProtectedRoute } from './components';
import { getTenantName } from './utils/api';
import { MiscCostsTab, MiscCostTabDetails, MiscCostTabNew, WorkOrderChecklistForm, WorkOrderChecklistNew, WorkOrderChicklistTab, WorkOrderLogsForm, WorkOrderLogsTab } from './pages/WorkOrderDetailsTabs';
import TenantSettingsPage from './pages/TenantSettings/TenantSettingsPage';
import Sites from './pages/TenantSettings/Sites/Sites';
import NewSite from './pages/TenantSettings/Sites/NewSite';
import SiteDetails from './pages/TenantSettings/Sites/SiteDetails';
import NewLocation from './pages/TenantSettings/Sites/NewLocation';
import LocationDetails from './pages/TenantSettings/Sites/LocationDetails';
import NewCategory from './pages/TenantSettings/Category/NewCategory';
import CategoryDetails from './pages/TenantSettings/Category/CategoryDetails';
import NewWorkOrderStatus from './pages/TenantSettings/WorkOrderTables/NewWorkOrderStatus';


const App: React.FC = () => {
  const subdomain =getTenantName();
  const { tenant, setTenant } = useAuth();
  const [tenantError, setTenantError] = useState(false); // NEW

  useEffect(() => {
    if (subdomain && subdomain !== 'admin' && !tenant) {
      fetchTenantBySubdomain(subdomain).then((fetchedTenant) => {
        if (fetchedTenant) {
          setTenant(fetchedTenant);
        } else {
          setTenantError(true); // Tenant not found
        }
      });
    }
  }, [subdomain, tenant, setTenant]);
  
  if (tenantError) {
    return <NotFoundPage />; // 🚨 Show 404 for missing tenant
  }

  if (!subdomain) {
    return (
      <>
        <PublicLayout />
      </>
    );
  }

  if (subdomain === 'admin') {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage isAdmin={true} />} />
          <Route path="/" element={
            <ProtectedRoute>
            <AdminLayout />
            </ProtectedRoute>
          }>
          {/* <Route index element={<AdminHome />} /> */}
          <Route path="/form/:encodedEntity/:id" element={<DynamicFormPage />} />
          {/* <Route path="/generated/:encodedEntity/:id" element={<GeneratedEntityPage />} /> */}
          <Route path="admin/companies" element={<AdminCompaniesPage />} />
          <Route path="admin/users" element={<AdminUsersPage />} />
          {/* <Route path="settings" element={<AdminSettingsPage />} />  */}
        </Route>
      </Routes>
    );
  }
  
  // Tenant dashboard layout with nested routing
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage isAdmin={false} />} />
          <Route path="/" element={
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/form/:encodedEntity/:id" element={<DynamicFormPage />} />
            {/* <Route path="/generated/:encodedEntity/:id" element={<GeneratedEntityPage />} /> */}
            <Route index element={<TenantDashboardPage />} />
            <Route path="/reports" element={<TenantReportsPage />} />

            <Route path="/settings" element={<TenantSettingsPage />} />
              
            <Route path="settings/sites" element={<Sites />} />
            <Route path="settings/sites/new" element={<NewSite />} />
            <Route path="settings/sites/:id" element={<SiteDetails />} />
            <Route path="settings/locations/new" element={<NewLocation />} />
            <Route path="settings/locations/:id" element={<LocationDetails />} />

            <Route path="settings/category/new" element={<NewCategory />} />
            <Route path="settings/category/:id" element={<CategoryDetails />} />

            <Route path="settings/work-order-status/new" element={<NewWorkOrderStatus />} />
            <Route path="settings/work-order-status/:id" element={<CategoryDetails />} />

            <Route path="/work-orders" element={<TenantWorkOrderPage />} />
            <Route path="/work-orders/:id" element={<TenantWorkOrderDetailsPage />} />
            <Route path="/work-orders/:workOrderId/work-order-logs" element={<WorkOrderLogsTab />} />
            <Route path="/work-orders/:workOrderId/work-order-logs/:id" element={<WorkOrderLogsForm />} />
            <Route path="/work-orders/:workOrderId/work-order-checklist" element={<WorkOrderChicklistTab />} />
            <Route path="/work-orders/:workOrderId/work-order-checklist/new" element={<WorkOrderChecklistNew />} />
            <Route path="/work-orders/:workOrderId/work-order-checklist/:id" element={<WorkOrderChecklistForm />} />
            <Route path="/work-orders/:workOrderId/work-order-misc-cost" element={<MiscCostsTab />} />
            <Route path="/work-orders/:workOrderId/work-order-misc-cost/new" element={<MiscCostTabNew />} />
            <Route path="/work-orders/:workOrderId/work-order-misc-cost/:id" element={<MiscCostTabDetails />} />

            <Route path="/assets" element={<TennantAssetsPage />} />
            <Route path="/assets/:id" element={<TenantAssetsDetailsPage />} />
            {/* 
            <Route path="assets" element={<AssetsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} /> */}
          </Route>
      </Routes>
    </>
  );
};

export default App;
