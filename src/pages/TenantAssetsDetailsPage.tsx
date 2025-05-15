import { useLocation, useParams } from "react-router-dom";
import { TabProps } from "../types/ApiTabsTypes";
import { ApiForm, ApiTabs } from "../components";
import { AssetLogsTab, FinancialTab, MeterReadingTab, PartsTab, ScheduleMaintnanceTab } from "./AssetDetailsTabs";


const TenantAssetsDetailsPage:React.FC = () => {
  const { state } = useLocation();
  const formTemplate = state?.formTemplate || [];
  const { id } = useParams();
  const isNew = id === 'new'
  const isViewOnly = state?.viewOnly || false;
  const tabs: TabProps[] = [
    {
      title: 'Parts',
      tabKey: 'parts',
      content: <PartsTab/>
    },
    {
      title: 'Meter Readings',
      tabKey: 'meterReadings',
      content: <MeterReadingTab/>
    },
    {
      title: 'Schedule Maintnance',
      tabKey: 'scheduleMaintenance',
      content: <ScheduleMaintnanceTab/>
    },
    {
      title: 'Fincancial',
      tabKey: 'financial',
      content: <FinancialTab/>
    },
    {
      title: 'Logs',
      tabKey: 'logs',
      content: <AssetLogsTab/>
    },
  ]
  
  return (
    <div className="flex-vertical main-content">
        <ApiForm
          formName="Asset"
          isNew={isNew}
          endPoint="assets/equipments"
          oriantation="horizontal"
          children={formTemplate}
          formTemplate={formTemplate}
          viewOnly={isViewOnly}
      />
      <ApiTabs
        activeKey={tabs[0].tabKey}
        tabs={tabs}
        className="main-content"
        disabled={isNew}
        intityName="Asset"
      />

    </div>
  );
}

export default TenantAssetsDetailsPage;