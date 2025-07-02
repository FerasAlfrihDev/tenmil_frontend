import { ApiTable } from "../components";
import { AssetFormTemplate } from "../formTemplates/AssetFormTemplate";

const TennantAssetsPage: React.FC = () => {
  return (
    <ApiTable
      endpoint="assets/equipments"
      tableName="Assets"
      hasCreateButton={true}
      clickToView={true}
      useGeneratedPage={false}      
      detailsPageLink={`/assets`}
      hasActionKeys={false}
      columns={[
        { key: 'code', label: 'Code', type: 'string' },
        { key: 'name', label: 'Name', type: 'string' },
        { key: 'make', label: 'Make', type: 'string' },
        { key: 'is_online', label: 'Is Online', type:'boolean' },
        { key: 'location', label: 'Location', type:'object' },
        { key: 'site', label: 'Site', type:'object' },
        { key: 'category', label: 'Category', type:'object' },
      ]}
      formTemplate={AssetFormTemplate}
    />
  );
};

export default TennantAssetsPage;
