import { FC } from "react";
import { ApiForm } from "../../../components";

const LocationDetails:FC = () => {
  return (
    <ApiForm 
        isNew={false}
        formName="Location"
        endPoint="company/location"
        children={[
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
        ]}
    />
  );
}

export default LocationDetails;