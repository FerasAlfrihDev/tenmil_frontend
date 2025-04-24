import { FC, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { ApiTabsProps } from "../types/ApiTabsTypes";

const ApiTabs:FC<ApiTabsProps> = ({tabs, activeKey, className, intityName, disabled=false}) => {
  const [key, setKey] = useState<string>(activeKey);
  return(
    <Tabs
      id="custom-tabs"
      className={`mb-3`}
      activeKey={key}
      onSelect={(k) => setKey(k || activeKey)}
      mountOnEnter
      unmountOnExit
      
    >
      {
        tabs.map((tab, index) =>(
          <Tab 
            key={index}
            eventKey={tab.tabKey}
            title={tab.title}
            disabled={tab.disabled||false}
          >
            <div className={className ? `${className} text-center` : "text-center"}>
              {!disabled ? tab.content : <p>Save {intityName} to proceed</p>}
              </div>
          </Tab>
        ))
      }
    </Tabs>
  )
}
export default ApiTabs;