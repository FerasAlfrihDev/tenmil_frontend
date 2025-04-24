import { useParams } from "react-router";
import { ApiTable } from "../../../components";

export const WorkOrderChicklistTab =  () => {
    const workOrderId = useParams().id
    return (
    <div className="main-container work-order-logs">
        <ApiTable
            endpoint="work-orders/work_order_checklist"
            createButtonLink={`/work-orders/${workOrderId}/work-order-checklist`}
            hasCreateButton={true}
            columns={[
                { key: 'description', label: 'Description', type: 'string' },
                { key: 'assigned_to', label: 'Assigned To', type: 'object' },
                { key: 'start_date', label: 'Start Date', type: 'date' },
                { key: 'hrs_estimated', label: 'Hrs Estimated', type: 'number' },
                { key: 'completed_by', label: 'Completed By', type: 'object' },
                { key: 'completion_date', label: 'Completion Date', type: 'date' },
                { key: 'hrs_spent', label: 'Hrs Spent', type: 'number' },
                { key: 'notes', label: 'Notes', type: 'string' }
                
            ]}/>
    </div>
)}
 