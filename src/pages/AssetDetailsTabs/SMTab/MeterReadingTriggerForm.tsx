import { ApiForm } from "../../../components";
import { useParams } from "react-router";


const MeterReadingTriggerForm: React.FC = () => {
    const id = useParams().id
    const formTemplate = [
        {
            label:"Asset",
            name:"asset",
            size:"3",
            component:"InputGroup",
            required:false,
            value:id,
            hidden:true
        },
        {
            label:"Every",
            name:"every",
            size:"3",
            component:"InputGroup",
            required:true
        },
        {
            label:"",
            name:"circle_type",
            size:"3",
            component:"Select",
            required:true,
            endpoint:"scheduled-maintenance/circle_types",
            hasCreateButton:false

        },
        {
            label:"Starting At",
            name:"starting_at",
            size:"6",
            component:"InputGroup",
            required:true
        }
    ]
    return(
        <ApiForm
            endPoint="scheduled-maintenance/create/meter_reading_triggers"
            oriantation="horizontal"
            formName="Meter Raading Trigger"
            children={formTemplate}
            formTemplate={formTemplate}
            isNew={true}
        
        />
    )
};

export default MeterReadingTriggerForm;