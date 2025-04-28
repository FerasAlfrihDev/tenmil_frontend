import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CopyRightsSection} from '../PublicLayout';


const DashboardLayout: React.FC = () => {
    const { tenant } = useAuth();
    return (
        <div className="d-flex min-vh-100">
            {/* Sidebar */}
            <nav className="bg-primary text-secondary p-3" style={{ width: '250px' }}>
                <div className="mb-5 nav-brand pb-3">
                    <h4 className="mb-1 text-secondary">Tenmil</h4>
                    <small className="text-secondary-50" style={{ fontSize: '0.9rem' }}>
                        {tenant?.name || 'Tenant Name'}
                    </small>
                </div>       
                {/* Navigation Links */}
                <ul className="nav flex-column mt-4">
                <li className="nav-item mb-2">
                    <Link to="/" className="nav-link text-secondary">Dashboard</Link>
                </li>
                <li className="nav-item mb-2">
                    <Link to="/work-orders" className="nav-link text-secondary">Work Orders</Link>
                </li>
                <li className="nav-item mb-2">
                    <Link to="/assets" className="nav-link text-secondary">Assets</Link>
                </li>
                <li className="nav-item mb-2">
                    <Link to="/reports" className="nav-link text-secondary">Reports</Link>
                </li>
                <li className="nav-item">
                    <Link to="/settings" className="nav-link text-secondary">Settings</Link>
                </li>
                </ul>
            </nav>

            {/* Main Content */}
            <div className="flex-grow-1 d-flex flex-column">
                {/* Topbar */}
                <header className="bg-light p-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-primary">Welcome, [Username]</h5>
                    <button className="btn btn-outline-primary btn-sm">Logout</button>
                </div>
                </header>

                {/* Page Content */}
                <main className="p-4" style={{ flex: '1 1 auto' }}>
                <Outlet />
                </main>
            </div>
            
            <CopyRightsSection/>
        </div>
    );
};

export default DashboardLayout;