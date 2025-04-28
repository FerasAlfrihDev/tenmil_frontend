import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav className="bg-dark text-secondary p-3" style={{ width: '250px' }}>
        <div className="mb-5 nav-brand pb-3">
            <h4 className="mb-1 text-secondary">Tenmil Admin</h4>
        </div>       
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/admin" className="nav-link text-secondary">Dashboard</Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/companies" className="nav-link text-secondary">Companies</Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/users" className="nav-link text-secondary">Users</Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/settings" className="nav-link text-secondary">Settings</Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Topbar */}
        <header className="bg-light p-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 text-dark">Platform Admin</h5>
            <button className="btn btn-outline-dark btn-sm">Logout</button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4" style={{ flex: '1 1 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;