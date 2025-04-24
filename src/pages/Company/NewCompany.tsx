import { FC } from "react";
import { ApiForm } from "../../components";


const NewCompany:FC = () => {
    return (
        <ApiForm 
            isNew={true}            
            formName="Company"
            endPoint="tenants/tenant"
            children={[
            {
                label:"Name",
                name:"name",
                size:3,
                component:"InputGroup",
                required:true
            },
            {
                label:"Sub Doamin",
                name:"schema_name",
                size:3,
                component:"InputGroup",
                required:true
            },
            
            ]}
        />
    );
}
export default NewCompany;