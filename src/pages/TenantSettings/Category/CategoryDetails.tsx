import { FC } from "react";
import { ApiForm } from "../../../components";

const CategoryDetails:FC = () => {
  const formTemplate = [
    {
      label:"Name",
      name:"name",
      size:"3",
      component:"InputGroup",
      required:true
    },
    {
      label:"Slug",
      name:"slug",
      size:"3",
      component:"InputGroup",
      required:true
    },
  ]
  return (
    <ApiForm 
        isNew={false}        
        formName="Category"
        endPoint="assets/equipment_category"
        children={formTemplate}
        formTemplate={formTemplate}
    />
  );
}

export default CategoryDetails;