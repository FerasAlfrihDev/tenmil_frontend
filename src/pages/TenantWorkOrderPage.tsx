import { ApiTable } from "../components";

const TenantWorkOrderPage: React.FC = () => {
  return (
    <ApiTable
      endpoint="work-orders/work_order"
      tableName="Workorders"
      hasCreateButton={true}
      clickToView={true}
      useGeneratedPage={false}
      detailsPageLink={`/work-orders`}
      columns={[
        { key: 'asset', label: 'Asset', type: 'object' },
        { key: 'status', label: 'Status', type: 'object' },
        { key: 'maint_type', label: 'Maint Type', type: 'string' },
        { key: 'priority', label: 'Priority', type:'string' },
        { key: 'suggested_start_date', label: 'Suggested Start Date', type:'string' },
        { key: 'completion_end_date', label: 'Completion Date', type:'string' },
        { key: 'is_closed', label: 'Closed', type:'boolean' },
      ]}
      formTemplate={[
        {
          label:"Asset",
          name:"asset",
          size:"1",
          component:"Select",
          required:true,
          endpoint:"assets/equipments",
          hasCreateButton:true,
          createButtonLink:"/assets/new",
          createButtonName:"New Asset",
          createButtonIcon:true

        },
        {
          label:"Status",
          name:"status",
          size:"3",
          component:"Select",
          required:true,
          endpoint:"work-orders/status",
          hasCreateButton:false,
        },
        {
          label:"Maint Type",
          name:"maint_type",
          size:"3",
          component:"InputGroup",
          required:true
        },
        {
          label:"Priority",
          name:"priority",
          size:"3",
          component:"InputGroup",
          required:true
        },         
        {
          label:"Suggested Start Date",
          name:"suggested_start_date",
          size:3,
          component:"DatePicker",
          required:true,
        },
        {
          label:"Completion Date",
          name:"completion_end_date",
          size:3,
          component:"DatePicker",
          required:true,
        },
        {
          label:"Description",
          name:"description",
          size:3,
          component:"TextArea",
          required:false,
        },
        {
          label:"Amount",
          name:"amount",
          size:"3",
          component:"InputGroup",
          required:false
        },   
      ]}
    />
  );
};

export default TenantWorkOrderPage;
