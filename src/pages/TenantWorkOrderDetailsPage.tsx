import { useLocation, useParams } from "react-router-dom";
import { ApiForm, ApiTabs } from "../components";
import { TabProps } from "../types/ApiTabsTypes";
import { CompletionNotesTab, MiscCostsTab, WorkOrderChicklistTab, WorkOrderLogsTab } from "./WorkOrderDetailsTabs";

const TenantWorkOrderDetailsPage: React.FC = () => {
    const { state } = useLocation();
    const formTemplate = state?.formTemplate || [];
    const { id } = useParams();
    const isNew = id === 'new'
    const isViewOnly = state?.viewOnly || false;
    
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
                formName='Work Order'
                endPoint={'work-orders/work_order'}
                isNew={isNew}
                children={formTemplate}
                viewOnly={isViewOnly}
                formTemplate={formTemplate}
                oriantation="horizontal"
            />
            <ApiTabs  
                activeKey='checklist' 
                tabs={tabs} 
                className="main-content" 
                disabled={isNew} 
                intityName="Work Order"
            />
        </div>
    );
}

export default TenantWorkOrderDetailsPage;