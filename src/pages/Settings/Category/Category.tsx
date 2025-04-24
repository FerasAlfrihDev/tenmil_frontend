import React from 'react';
import '../../../styles/pages.scss';
import { ApiTable } from '../../../components';

const Category: React.FC = () => {
    return (
        
        <>
            
            <div className="main-container assets">
                <div >
                    {/* <h2>Recent Activity</h2> */}
                    <ApiTable
                        endpoint="assets/equipment_category"
                        createButtonLink='settings/category'
                        columns={[
                            { key: 'name', label: 'Name' },
                            { key: 'slug', label: 'Slug' },
                        ]}/>

                </div>
                {/* <div className="reports">
                    <h2>Reports</h2>
                    <div className="chart-placeholder">[Chart Placeholder]</div>
                </div> */}
            </div>
        </>
    );
};

export default Category;
