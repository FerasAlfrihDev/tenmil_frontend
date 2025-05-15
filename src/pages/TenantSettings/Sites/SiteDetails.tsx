import { FC } from "react";
import { ApiForm } from "../../../components";

const SiteDetails:FC = () => {
  const formTemplate = [
          {
            label:"Code",
            name:"code",
            size:"1",
            component:"InputGroup",
            required:true
          },
          {
            label:"Name",
            name:"name",
            size:"3",
            component:"InputGroup",
            required:true
          },
          
        ]
  return (
    <ApiForm 
        isNew={false}
        formName="Site"
        endPoint="company/site"
        children={formTemplate}
        formTemplate={formTemplate}
    />
  );
}

export default SiteDetails;