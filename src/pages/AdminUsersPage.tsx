import { ApiTable } from "../components";

const AdminUsersPage: React.FC = () => {
  return (
    <ApiTable
        endpoint="users/user"
        tableName="Users"
        hasCreateButton={false}
        clickToView={true}
        columns={[
          { key: 'email', label: 'Email', type: 'string' },
          { key: 'name', label: 'Name', type: 'string' },
          { key: 'is_active', label: 'Active', type: 'boolean' },
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
            label:"Email",
            name:"email",
            size:3,
            component:"InputGroup",
            required:true
          },
          {
            label:"Active",
            name:"is_active",
            size:3,
            component:"Switch",
            required:false,
            unSelectedText:"Inactive",
            selectedText:"Active"
          },
        ]}
    />
  );
};

export default AdminUsersPage;
