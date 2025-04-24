import { FC } from "react";
import { ApiForm, ApiTabs } from "../../components";
import FinancialTab from "./AssetDetailsTabs/FinancialTab/FinancialTab";
import { PartsTab } from "./AssetDetailsTabs/PartsTab";
import { TabProps } from "../../types/ApiTabsTypes";
import MeterReadingTab from "./AssetDetailsTabs/MeterReadingTab";
import { ScheduleMaintnanceTab } from "./AssetDetailsTabs/ScheduleMaintnanceTab";
import { AssetLogsTab } from "./AssetDetailsTabs/AssetLogsTab";



const AssetBase:FC<{isNew:boolean}> = ({isNew}) => {
  const tabs: TabProps[] = [
    // {
    //   title: 'General',
    //   tabKey: 'general',
    //   content: <GeneralTab/>
    // },
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
          children={[
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
      <ApiTabs  activeKey='meterReadings' tabs={tabs} className="main-content" disabled={isNew} intityName="Asset"/>
    </div>
  );
}

export default AssetBase;