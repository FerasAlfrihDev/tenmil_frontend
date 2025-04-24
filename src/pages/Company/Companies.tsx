import { FC } from "react";
import { ApiTable } from "../../components";


const Companies:FC = () => {
    return (
        <div className="main-container companies">
            <ApiTable
                endpoint="tenants/tenant"
                createButtonLink='company'
                columns={[
                    { key: 'schema_name', label: 'Sub Doamin', type: 'string' },
                    { key: 'name', label: 'Name', type: 'string' }
                    
                ]}/>
        </div>
    )
}
export default Companies;