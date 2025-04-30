import { ApiTable } from "../../components";

const AdminCompaniesPage: React.FC = () => {
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary mb-0">Companies</h4>
      </div>

      <ApiTable
        endpoint="tenants/tenant"
        createButtonLink="company"
        columns={[
          { key: 'schema_name', label: 'Subdomain', type: 'string', sortable: true },
          { key: 'name', label: 'Company Name', type: 'string', sortable: true }
        ]}
      />
    </div>
  );
};

export default AdminCompaniesPage;
