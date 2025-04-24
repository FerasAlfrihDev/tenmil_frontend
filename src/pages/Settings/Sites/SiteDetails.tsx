import { FC } from "react";
import { ApiForm } from "../../../components";

const SiteDetails:FC = () => {
  return (
    <ApiForm 
        isNew={false}
        formName="Site"
        endPoint="company/site"
        children={[
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
          
        ]}
    />
  );
}

export default SiteDetails;