import { FC } from "react"
import { ApiForm } from "../../../components"
import { useParams } from "react-router"


const MiscCostTabDetails:FC = () => {
    const workOrderId = useParams().workOrderId
    
    return(
        <div className="flex-vertical main-content">
            <ApiForm 
                formName="Misc Cost"
                isNew={false}
                endPoint="work-orders/work_order_misc_cost"
                oriantation="vertical"
                children={[
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
                ]}
            />
        </div>
    )
}

export default MiscCostTabDetails;