import { ApiTable } from "../../components";

const DashboardHomePage:React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <ApiTable
                endpoint="tenants/tenant"
                columns={[
                    { key: 'schema_name', label: 'Sub Doamin', type: 'string' },
                    { key: 'name', label: 'Name', type: 'string' }
                    
                ]}
            />
        </div>
    )
};
export default DashboardHomePage;