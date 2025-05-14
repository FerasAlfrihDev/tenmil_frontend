import { ApiTable } from "../components";

const AdminCompaniesPage: React.FC = () => {
  return (
    <ApiTable
      endpoint="tenants/tenant"
      tableName="Tenants"
      hasCreateButton={true}
      clickToView={true}
      columns={[
        { key: 'schema_name', label: 'Subdomain', type: 'string' },
        { key: 'name', label: 'Company Name', type: 'string' },
      ]}
      formTemplate={[
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
};

export default AdminCompaniesPage;
