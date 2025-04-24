import React from 'react';
import { Nav } from 'react-bootstrap';
import { getTenantName } from '../utils/api';


const Sidebar: React.FC = () => {
    const tenentName = getTenantName()
    if (tenentName == null) {
        return (
            <Nav defaultActiveKey="/" className="flex-column ">
                <Nav.Link href="/">Dashboard</Nav.Link>
                <Nav.Link  href="/company" eventKey="/company">Company</Nav.Link>             
            </Nav>
        )
    }
    return (
        <Nav defaultActiveKey="/" className="flex-column ">
            <small>---Permenent---</small>
            <Nav.Link href="/">Dashboard</Nav.Link>
            <Nav.Link  href="/assets" eventKey="/assets">Assets</Nav.Link>
            <Nav.Link  href="/work-orders" eventKey="/work-orders">Work Orders</Nav.Link>
            <small>---Temporary---</small>
            <Nav.Link  href="/settings" eventKey="/settings">Settings</Nav.Link>
            
        </Nav>
    );
};

export default Sidebar;
