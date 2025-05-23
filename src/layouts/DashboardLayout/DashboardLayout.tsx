import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CopyRightsSection} from '../PublicLayout';


const DashboardLayout: React.FC = () => {
    const { tenant, user } = useAuth();

    const handleLogOut = () => {
        const currentPath = window.location.pathname + window.location.search;
        const encodedPath = encodeURIComponent(currentPath || '/');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = `/login?next=${encodedPath}`;        
    }
    
    return (
        <div className="d-flex min-vh-100">
            {/* Sidebar */}
            <nav className="sidebar bg-light text-secondary p-3" style={{ width: '250px' }}>
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
                        <div></div> {/* empty div to align the username to the right */}
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-secondary dropdown-toggle"
                                type="button"
                                id="userDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {user?.name || 'User'}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                <li>
                                <Link to="/profile" className="dropdown-item">Profile</Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                <button className="dropdown-item" onClick={handleLogOut}>Logout</button>
                                </li>
                            </ul>
                        </div>
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