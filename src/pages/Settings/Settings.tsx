import { FC } from "react";
import { ApiTabs } from "../../components";
import Sites from "./Sites/Sites";
import { TabProps } from "../../types/ApiTabsTypes";
import Category from "./Category/Category";
import WorkOrderTables from "./WorkOrderTables/WorkOrderTables";



const Settings:FC = () => {
  const tabs: TabProps[] = [
    {
      title: 'Sites',
      tabKey: 'sites',
      content: <Sites/>
    },
    {
      title: 'Category',
      tabKey: 'category',
      content: <Category/>
    },
    {
        title: "Work Orders",
        tabKey: "workOrders",
        content: <WorkOrderTables/>
    }
   
  ]
  
  return (
    <ApiTabs intityName="" activeKey='sites' tabs={tabs} className="main-content"/>
  );
}

export default Settings;