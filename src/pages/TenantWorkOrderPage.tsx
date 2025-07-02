import { ApiTable } from "../components";
import { WorkOrderFormTemplate } from "../formTemplates/WorkOrderFormTemplates";

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
        { key: 'code', label: 'Code', type: 'string' },
        { key: 'asset', label: 'Asset', type: 'object' },
        { key: 'status', label: 'Status', type: 'object' },
        { key: 'maint_type', label: 'Maint Type', type: 'string' },
        { key: 'priority', label: 'Priority', type:'string' },
        { key: 'starting_meter_reading', label: 'Starting Meter Reading', type:'number' },
        { key: 'completion_meter_reading', label: 'Completion Meter Reading', type:'number' },
        { key: 'suggested_start_date', label: 'Suggested Start Date', type:'string' },
        { key: 'completion_end_date', label: 'Completion Date', type:'string' },
        { key: 'is_closed', label: 'Closed', type:'boolean' },
      ]}
      formTemplate={WorkOrderFormTemplate}
    />
  );
};

export default TenantWorkOrderPage;
