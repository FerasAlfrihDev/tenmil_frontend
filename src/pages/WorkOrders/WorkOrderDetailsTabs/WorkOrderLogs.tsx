import { useParams } from "react-router";
import { ApiTable } from "../../../components";

export const WorkOrderLogsTab =  () => {
    const id = useParams().id
    return (
        <div className="main-container work-order-logs">
            <ApiTable
                endpoint="work-orders/work_order_log"
                createButtonLink='work-orders/work-order-logs'
                hasCreateButton={false}
                filters={{work_order_id: id}}
                columns={[
                    { key: 'user', label: 'User', type: 'object' },
                    { key: 'amount', label: 'Amount', type: 'string' },
                    { key: 'log_type', label: 'Log Type', type: 'string' },                    
                    { key: 'description', label: 'Description', type:'string' },
                    
                ]}/>
        </div>
    )
}
 