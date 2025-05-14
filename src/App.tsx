import { Routes, Route } from 'react-router-dom';
import { AdminLayout, DashboardLayout, PublicLayout } from './layouts';
import { useAuth } from './context/AuthContext';
import { useEffect, useState } from 'react';
import { fetchTenantBySubdomain } from './utils/fakeApi';
import { AdminCompaniesPage, AdminUsersPage, DynamicFormPage, NotFoundPage, TenantDashboardPage, TenantWorkOrderPage, TennantAssetsPage } from './pages';
import LoginPage from './pages/Authentication/LoginPage';
import { ProtectedRoute } from './components';
import { getTenantName } from './utils/api';


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
            <Route path="/work-orders" element={<TenantWorkOrderPage />} />
            <Route path="/assets" element={<TennantAssetsPage />} />
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
