import { ApiTable } from "../components";

const TennantAssetsPage: React.FC = () => {
  return (
    <ApiTable
      endpoint="assets/equipments"
      tableName="Assets"
      hasCreateButton={true}
      clickToView={true}
      useGeneratedPage={false}
      columns={[
        { key: 'code', label: 'Code', type: 'string' },
        { key: 'name', label: 'Name', type: 'string' },
        { key: 'make', label: 'Make', type: 'string' },
        { key: 'is_online', label: 'Is Online', type:'boolean' },
        { key: 'location', label: 'Location', type:'object' },
        { key: 'site', label: 'Site', type:'object' },
        { key: 'category', label: 'Category', type:'object' },
      ]}
      formTemplate={[
        {
          label:"Name",
          name:"name",
          size:"3",
          component:"InputGroup",
          required:true
        },
        {
          label:"Online",
          name:"is_online",
          size:"3",
          component:"Switch",
          required:false,
          unSelectedText:"Offline",
          selectedText:"Online"
        },
        {
          label:"Description",
          name:"description",
          component:"TextArea",
          required:false,
          size:"3",
        },
        {
          label:"Code",
          name:"code",
          size:"3",
          component:"InputGroup",
          required:true
        },
        {
          label:"Category",
          name:"category",
          component:"Select",
          required:true,
          endpoint:"assets/equipment_category",
          hasCreateButton:true,
          createButtonLink:"/category/new",
          createButtonName:"New Category",
          createButtonIcon:true,
          size:"3",
        },      
        {
          label:"Make",
          name:"make",
          size:"3",
          component:"InputGroup",
          required:true
        },
        {
          label:"Model",
          name:"model",
          size:"3",
          component:"InputGroup",
          required:true
        },
        {
          label:"Serial Number",
          name:"serial_number",
          size:"3",
          component:"InputGroup",
          required:true
        },
        {
          label:"Location",
          name:"location",
          component:"Select",
          required:true,
          endpoint:"company/location",
          hasCreateButton:true,
          createButtonLink:"/locations/new",
          createButtonName:"New Location",
          createButtonIcon:true,
          size:"3",

        },         
        {
          label:"Purchase Date",
          name:"purchase_date",
          component:"DatePicker",
          required:true,
          size:"3",
        },
      ]}
    />
  );
};

export default TennantAssetsPage;
