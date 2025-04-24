import React, { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';


const Header: React.FC = () => {
    const [tenantName, setTenantName] = useState('');

    useEffect(() => {
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        setTenantName(parts.length > 1 ? parts[0] : 'Default Tenant');
        
    }, []);

    // const [searchText, setSearchText] = useState('');
    // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (event.key === 'Enter') {
    //         console.log(`Searching for: ${searchText}`);
    //     }
    // };

    // const toggleDropdown = () => {
    //     setIsDropdownOpen(!isDropdownOpen);
    // };

    return (
        <Navbar bg="primary" data-bs-theme="dark">
            <Navbar.Brand href="/">WorkCore <small>{tenantName}</small></Navbar.Brand>
        </Navbar>
    );
};

export default Header;