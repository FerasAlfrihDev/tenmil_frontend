import { FC } from "react"
import { ApiForm } from "../../../components"
import { useParams } from "react-router"


const WorkOrderChecklistForm:FC = () => {
    const workOrderId = useParams().workOrderId;
    
    return(
        <div className="flex-vertical main-content">
            <ApiForm 
                formName="Checklist"
                isNew={false}
                endPoint="work-orders/work_order_checklist"
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
                        label:"Description",
                        name:"description",
                        size:"3",
                        component:"TextArea",
                        required:true,
                    },
                    {
                        label:"Assigned To",
                        name:"assigned_to",
                        size:"1",
                        component:"Select",
                        required:false,
                        endpoint:"users/user",
                        hasCreateButton:false,
                        createButtonIcon:false
                    },
                    {
                        label:"Start Date",
                        name:"start_date",
                        size:"3",
                        component:"DatePicker",
                        required:false,
                    },
                    {
                        label:"Hrs Estimated",
                        name:"hrs_estimated",
                        size:"3",
                        component:"InputGroup",
                        required:false,
                    },
                    {
                        label:"Completed By",
                        name:"completed_by",
                        size:"1",
                        component:"Select",
                        required:false,
                        endpoint:"users/user",
                        hasCreateButton:false,
                        createButtonIcon:false
                    },
                    {
                        label:"Completion Date",
                        name:"completion_date",
                        size:"3",
                        component:"DatePicker",
                        required:false,
                    },
                    {
                        label:"Hrs Spent",
                        name:"hrs_spent",
                        size:"3",
                        component:"InputGroup",
                        required:false,
                    },
                    {
                        label:"Notes",
                        name:"notes",
                        size:3,
                        component:"TextArea",
                        required:false,
                    },
                ]}
            />
        </div>
    )
}

export default WorkOrderChecklistForm;