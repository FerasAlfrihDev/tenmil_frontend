import { Routes, Route } from 'react-router-dom';
import { AdminLayout, DashboardLayout, PublicLayout } from './layouts';
import { useAuth } from './context/AuthContext';
import { useEffect, useState } from 'react';
import { fetchTenantBySubdomain } from './utils/fakeApi';
import { NotFoundPage } from './pages';
import LoginPage from './pages/Authentication/LoginPage';
import { ProtectedRoute } from './components';

const getSubdomain = (): string | null => {
  const parts = window.location.hostname.split('.');
  console.log("getSubdomain parts: ", parts.length);
  
  if (parts.length > 2) {
    return parts[0];
  }
  return null;
};

const App: React.FC = () => {
  const subdomain = getSubdomain();
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
    
    console.log("App useEffect subdomain: ", subdomain);
  }, [subdomain, tenant, setTenant]);
  

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
            {/* <Route index element={<AdminHome />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<AdminSettingsPage />} /> */}
          </Route>
      </Routes>
    );
  }
  if (tenantError) {
    console.log("App tenantError: ", tenantError);
    return <NotFoundPage />; // 🚨 Show 404 for missing tenant
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
            {/* <Route index element={<DashboardHome />} /> */}
            {/* <Route path="work-orders" element={<WorkOrdersPage />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} /> */}
          </Route>
      </Routes>
    </>
  );
};

export default App;
