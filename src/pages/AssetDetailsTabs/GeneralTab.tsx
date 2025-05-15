import { ApiForm } from "../../../components";

const GeneralTab = () => {
    const apiFormParams = {
         isNew:false,
        endPoint:"assets/equipments",
        formName:"",
        children: [
          {
            label:"Make",
            name:"make",
            size:"3",
            component:"InputGroup",
            required:true
          },
          {
            label:"Model",
            name:"model",
            size:"3",
            component:"InputGroup",
            required:true
          },
          {
            label:"Serial Number",
            name:"serial_number",
            size:"3",
            component:"InputGroup",
            required:true
          },
          {
            label:"Location",
            name:"location",
            component:"Select",
            required:true,
            endpoint:"company/location",
            hasCreateButton:true,
            createButtonLink:"/locations/new",
            createButtonName:"New Location",
            createButtonIcon:true,
            size:"3",

          },
          {
            label:"Category",
            name:"category",
            component:"Select",
            required:true,
            endpoint:"assets/equipment_category",
            hasCreateButton:true,
            createButtonLink:"/category/new",
            createButtonName:"New Category",
            createButtonIcon:true,
            size:"3",
          },          
          {
            label:"Purchase Date",
            name:"purchase_date",
            component:"DatePicker",
            required:true,
            size:"3",
          },
          {
            label:"Description",
            name:"description",
            component:"TextArea",
            required:false,
            size:"3",
          }
        ]
    }
    return(
        <div className="p-3">
            <ApiForm {...apiFormParams}/>
        </div>
    )
    
}

export default GeneralTab;
 