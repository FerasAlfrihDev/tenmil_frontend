import { FC } from "react";
import { ApiForm } from "../../../components";

const LocationDetails:FC = () => {
  const formTemplate = [
    {
      label:"Site",
      name:"site",
      size:undefined,
      component:"Select",
      required:true,
      endpoint:"company/site",
      hasCreateButton:true,
      createButtonLink:"/settings/sites/new",
      createButtonName:"New Site",

    },
    {
      label:"Name",
      name:"name",
      size:"3",
      component:"InputGroup",
      required:true
    },
    {
      label:"Address",
      name:"address",
      size:"3",
      component:"InputGroup",
      required:false
    },
    {
      label:"Slug",
      name:"slug",
      size:"3",
      component:"InputGroup",
      required:true,
    },
  ]
  return (
    <ApiForm 
        isNew={false}
        formName="Location"
        endPoint="company/location"
        children={formTemplate}
        formTemplate={formTemplate}
    />
  );
}

export default LocationDetails;