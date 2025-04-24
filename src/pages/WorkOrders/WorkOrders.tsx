import React from 'react';
import '../../styles/pages.scss';
import { ApiTable } from '../../components';

const WorkOrders: React.FC = () => {
    return (
        <div className="main-container work-orders">
            <ApiTable
                endpoint="work-orders/work_order"
                createButtonLink='work-orders'
                columns={[
                    { key: 'asset', label: 'Asset', type: 'object' },
                    { key: 'status', label: 'Status', type: 'object' },
                    { key: 'maint_type', label: 'Maint Type', type: 'string' },
                    { key: 'priority', label: 'Priority', type:'string' },
                    { key: 'suggested_start_date', label: 'Suggested Start Date', type:'string' },
                    { key: 'completion_end_date', label: 'Completion Date', type:'string' },
                    { key: 'is_closed', label: 'Closed', type:'boolean' },

                    
                ]}/>
        </div>
    );
};

export default WorkOrders;
