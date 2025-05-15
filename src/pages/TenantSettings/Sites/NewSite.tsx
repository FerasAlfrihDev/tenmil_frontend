import { FC } from "react";
import { ApiForm } from "../../../components";

const NewSite:FC = () => {
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
        isNew={true}
        formName="Site"
        endPoint="company/site"
        children={formTemplate}
        formTemplate={formTemplate}
    />
  );
}

export default NewSite;