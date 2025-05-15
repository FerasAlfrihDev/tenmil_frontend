import { FC } from "react"
import { useParams } from "react-router"
import { ApiForm } from "../../components"


const MiscCostTabDetails:FC = () => {
    const workOrderId = useParams().workOrderId
    const formTemplate = [
        {
            label:"Work Order",
            name:"work_order",
            size:"1",
            component:"InputGroup",
            required:true,
            value:workOrderId,
            hidden:true,
        },
        {
            label:"Total Cost",
            name:"total_cost",
            size:"3",
            component:"InputGroup",
            required:true,
        },
        {
            label:"Description",
            name:"description",
            size:3,
            component:"TextArea",
            required:false,
        },
    ]
    
    return(
        <div className="flex-vertical main-content">
            <ApiForm 
                formName="Misc Cost"
                isNew={false}
                endPoint="work-orders/work_order_misc_cost"
                oriantation="vertical"
                children={formTemplate}
                formTemplate={formTemplate}
            />
        </div>
    )
}

export default MiscCostTabDetails;