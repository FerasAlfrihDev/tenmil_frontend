import { FC } from "react";
import { ApiForm } from "../../../components";

const NewCategory:FC = () => {
  return (
    <ApiForm 
        formName="Category"
        isNew={true}
        endPoint="assets/equipment_category"
        children={[
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
        ]}
    />
  );
}

export default NewCategory;