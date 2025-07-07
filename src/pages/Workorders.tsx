import ApiTable from "@/components/ApiTable";

const Workorders = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Work Orders</h1>
        <p className="text-muted-foreground">
          Manage and track work orders
        </p>
      </div>
      
      <ApiTable
        title="Work Orders"
        endpoint="/work-orders/work_order"
        createNewHref="/workorders/create"
        createNewText="New Work Order"
        columns={[
          { key: 'code', header: 'Code' },
          { key: 'asset', header: 'Asset', type: 'object' },
          { key: 'status', header: 'Status', type: 'object' },
          { key: 'maint_type', header: 'Maint Type' },
          { key: 'priority', header: 'Priority' },
          { key: 'starting_meter_reading', header: 'Starting Meter Reading' },
          { key: 'completion_meter_reading', header: 'Completion Meter Reading' },
          { key: 'suggested_start_date', header: 'Suggested Start Date' },
          { key: 'completion_end_date', header: 'Completion Date' },
          { key: 'is_closed', header: 'Closed', render: (value) => value ? 'Yes' : 'No' },
        ]}
      />
    </div>
  );
};

export default Workorders;