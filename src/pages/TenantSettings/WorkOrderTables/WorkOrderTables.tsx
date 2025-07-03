import { FC } from "react";
import { ApiTable } from "../../../components";

const WorkOrderTables:FC = () => {
    return (
        <div className="multi-tables">
            <div >
                <ApiTable
                    tableName="Work Order Status"
                    endpoint="work-orders/status"
                    useGeneratedPage={false}
                    detailsPageLink="work-order-status"
                    protected_records_field="is_system_level"
                    columns={[
                        { key: 'name', label: 'Name' },
                        { key: 'control', label: 'Control' , type:"object"},
                    ]}
                />
            </div>
        </div>
    )
};
export default WorkOrderTables;