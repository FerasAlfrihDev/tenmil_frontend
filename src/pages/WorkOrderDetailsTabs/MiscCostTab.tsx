import { useParams } from "react-router";
import { ApiTable } from "../../components";

const MiscCostsTab =  () => {
    const workOrderId = useParams().id
    return (
        <div className="main-container work-order-logs">
            <ApiTable
                tableName="Misc Costs"
                endpoint="work-orders/work_order_misc_cost"
                useGeneratedPage={false}
                detailsPageLink={`/work-orders/${workOrderId}/work-order-misc-cost`}
                hasCreateButton={true}
                filters={{work_order_id: workOrderId}}
                columns={[
                    { key: 'total_cost', label: 'Total Cost', type: 'string' },                  
                    { key: 'description', label: 'Description', type:'string' },
                    
                ]}/>
        </div>
    )
}

export default MiscCostsTab;
 