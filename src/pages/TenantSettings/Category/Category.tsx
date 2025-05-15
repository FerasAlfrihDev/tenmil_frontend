import React from 'react';
import '../../../styles/pages.scss';
import { ApiTable } from '../../../components';

const Category: React.FC = () => {
    return (
        <div className="main-container assets">
            <div >
                <ApiTable
                    tableName='Categories'
                    endpoint="assets/equipment_category"
                    useGeneratedPage={false}
                    detailsPageLink="category"
                    columns={[
                        { key: 'name', label: 'Name' },
                        { key: 'slug', label: 'Slug' },
                    ]}
                />
            </div>
        </div>
    );
};

export default Category;
