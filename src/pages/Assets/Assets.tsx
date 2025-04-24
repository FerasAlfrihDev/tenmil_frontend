import React from 'react';
import '../../styles/pages.scss';
import { ApiTable } from '../../components';

const Assets: React.FC = () => {
    return (
        <div className="main-container assets">
            <ApiTable
                endpoint="assets/equipments"
                createButtonLink='assets'
                columns={[
                    { key: 'code', label: 'Code', type: 'string' },
                    { key: 'name', label: 'Name', type: 'string' },
                    { key: 'make', label: 'Make', type: 'string' },
                    { key: 'is_online', label: 'Is Online', type:'boolean' },
                    { key: 'location', label: 'Location', type:'object' },
                    { key: 'site', label: 'Site', type:'object' },
                    { key: 'category', label: 'Category', type:'object' },
                    
                ]}/>
        </div>
    );
};

export default Assets;
