import { FC, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { ApiTabsProps } from "../types/ApiTabsTypes";

const ApiTabs: FC<ApiTabsProps> = ({
  tabs,
  activeKey,
  className = "",
  disabled = false,
  intityName
}) => {
  const [key, setKey] = useState<string>(activeKey);

  useEffect(() => {
    setKey(activeKey); // Sync with parent changes
  }, [activeKey]);

  return (
    <Tabs
      id="custom-api-tabs"
      activeKey={key}
      onSelect={(k) => setKey(k || activeKey)}
      mountOnEnter
      unmountOnExit
      className={`api-tabs ${className}`}
    >
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          eventKey={tab.tabKey}
          title={tab.title}
          disabled={tab.disabled || false}
        >
          <div className={className}>
            {!disabled ? (
              tab.content
            ) : (
              <p className="text-muted">Save {intityName} to proceed</p>
            )}
          </div>
        </Tab>
      ))}
    </Tabs>
  );
};

export default ApiTabs;
