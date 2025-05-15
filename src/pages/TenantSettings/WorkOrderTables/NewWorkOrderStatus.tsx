import { FC } from "react"
import { ApiForm } from "../../../components"

const NewWorkOrderStatus:FC = () => {
  const formTemplate = [
    {
      label:"Control",
      name:"control",
      size:undefined,
      component:"Select",
      required:true,
      endpoint:"work-orders/controls",
      hasCreateButton:false,
    },
    {
      label:"Name",
      name:"name",
      size:"3",
      component:"InputGroup",
      required:true
    },
    
  ]
  return(
    <ApiForm
        isNew={true}
        formName="Work Order Status"
        endPoint="work-orders/status"
        children={formTemplate}
        formTemplate={formTemplate}
    />
  )
};
export default NewWorkOrderStatus;