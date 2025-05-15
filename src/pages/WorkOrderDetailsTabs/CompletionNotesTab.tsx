import { useParams } from "react-router";
import { ApiForm } from "../../components";

const CompletionNotesTab =  () => {
    const workOrderId = useParams().id;
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
            label:"Completion Notes",
            name:"completion_notes",
            size:"3",
            component:"TextArea",
            required:false,
        },
        {
            label:"Problem",
            name:"problem",
            size:3,
            component:"TextArea",
            required:false,
            helperMsg:"(briefly outline the problem, if any)"
        },
        {
            label:"Root Cause",
            name:"root_cause",
            size:3,
            component:"TextArea",
            required:false,
            helperMsg:"(short description of the cause of issue, if any)"
        },
        {
            label:"Solution",
            name:"solution",
            size:3,
            component:"TextArea",
            required:false,
            helperMsg:"(short description of the solution, if any)"
        },
        {
            label:"Admin Notes",
            name:"admin_notes",
            size:3,
            component:"TextArea",
            required:false,
        },
    ]
    return (
        <div className="flex-vertical main-content">
            <ApiForm
                formName="Completion Note"
                isNew={true}
                endPoint="work-orders/work_order_completion_note"
                oriantation="vertical"
                singleIntityForm={{work_order: workOrderId}}
                formTemplate={formTemplate}
                children={formTemplate}
            />
        </div>
    )
}
export default CompletionNotesTab;
 