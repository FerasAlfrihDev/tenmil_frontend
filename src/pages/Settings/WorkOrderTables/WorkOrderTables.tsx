import { FC } from "react";
import { ApiTable } from "../../../components";

const WorkOrderTables:FC = () => {
    return (
        <div className="multi-tables">
            <div >
                <h2>Work Order Status</h2>
                <ApiTable
                    endpoint="work-orders/status"
                    createButtonLink='settings/work-order-status'
                    columns={[
                        { key: 'name', label: 'Name' },
                        { key: 'control', label: 'Control' , type:"object"},
                    ]}/>

            </div>
            {/* <div >
                <h2>Locations</h2>
                <ApiTable
                    endpoint="company/location"
                    createButtonLink='settings/locations'
                    columns={[
                        { key: 'site', label: 'Site', type:"object"},
                        { key: 'address', label: 'Address' },
                        { key: 'name', label: 'Name' },
                        { key: 'slug', label: 'Slug' },
                    ]}/>

            </div> */}
        </div>
    )
};
export default WorkOrderTables;