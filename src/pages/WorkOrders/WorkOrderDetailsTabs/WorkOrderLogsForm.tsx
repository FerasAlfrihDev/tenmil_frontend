import { FC } from "react"
import { ApiForm } from "../../../components"


const WorkOrderLogsForm:FC = () => {
    return(
        <div className="flex-vertical main-content">
            <ApiForm 
                formName="WO Log"
                isNew={false}
                endPoint="work-orders/work_order_log"
                oriantation="vertical"
                viewOnly={true}
                children={[
                {
                    label:"Work Order",
                    name:"work_order",
                    size:"1",
                    component:"Select",
                    required:true,
                    endpoint:"work-orders/work_order",
                    hasCreateButton:false,
                },
                {
                    label:"User",
                    name:"user",
                    size:"3",
                    component:"Select",
                    required:true,
                    endpoint:"users/user",
                    hasCreateButton:false,
                },
                {
                    label:"Amount",
                    name:"amount",
                    size:"3",
                    component:"InputGroup",
                    required:true
                },
                {
                    label:"Log Type",
                    name:"log_type",
                    size:"3",
                    component:"InputGroup",
                    required:true
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

export default WorkOrderLogsForm;