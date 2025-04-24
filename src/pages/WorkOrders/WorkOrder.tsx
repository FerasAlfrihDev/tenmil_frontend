import { FC } from "react";
import { ApiForm, ApiTabs } from "../../components";
import { TabProps } from "../../types/ApiTabsTypes";
import { WorkOrderLogsTab } from "./WorkOrderDetailsTabs/WorkOrderLogs";
import { MiscCostsTab } from "./WorkOrderDetailsTabs/MiscCostTab";
import { CompletionNotesTab } from "./WorkOrderDetailsTabs/CompletionNotesTab";
import { WorkOrderChicklistTab } from "./WorkOrderDetailsTabs/WorkOrderChecklistTab";



const WorkOrderBase:FC<{isNew:boolean}> = ({isNew}) => {
  const tabs: TabProps[] = [
    {
      title: 'Checklist',
      tabKey: 'checklist',
      content: <WorkOrderChicklistTab/>
    },
    {
      title: 'Completion Notes',
      tabKey: 'completionNotes',
      content: <CompletionNotesTab/>
    },
    {
      title: 'Misc Costs',
      tabKey: 'miscCosts',
      content: <MiscCostsTab/>
    },
    {
      title: 'Logs',
      tabKey: 'logs',
      content: <WorkOrderLogsTab/>
    },
  ]
  
  return (
    <div className="flex-vertical main-content">
        <ApiForm 
          formName="Work Order"
          isNew={isNew}
          endPoint="work-orders/work_order"
          oriantation="horizontal"
          children={[
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
      <ApiTabs  activeKey='checklist' tabs={tabs} className="main-content" disabled={isNew} intityName="Work Order"/>
    </div>
  );
}

export default WorkOrderBase;