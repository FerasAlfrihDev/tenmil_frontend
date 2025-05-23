import { useParams } from "react-router";
import { ApiTable } from "../../components";

const WorkOrderChicklistTab =  () => {
    const workOrderId = useParams().id
    return (
    <div className="main-container work-order-logs">
        <ApiTable
            tableName="Work Order Checklist"
            endpoint={`work-orders/work_order_checklist?work_order_id=${workOrderId}`}
            hasCreateButton={true}
            useGeneratedPage={false}
            detailsPageLink={`/work-orders/${workOrderId}/work-order-checklist`}
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
export default WorkOrderChicklistTab;