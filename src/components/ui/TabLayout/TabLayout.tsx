import React, { useState } from 'react';
import './TabLayout.scss';

export interface TabItem {
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabLayoutProps {
  tabs: TabItem[];
  defaultActiveTab?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'small' | 'medium' | 'large';
}

const TabLayout: React.FC<TabLayoutProps> = ({
  tabs,
  defaultActiveTab = 0,
  onTabChange,
  className,
  variant = 'default',
  size = 'medium'
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  const handleTabClick = (index: number) => {
    if (tabs[index]?.disabled) return;
    
    setActiveTab(index);
    onTabChange?.(index);
  };

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className={`tab-layout ${variant} ${size} ${className || ''}`}>
      {/* Tab Headers */}
      <div className="tab-headers">
        {tabs.map((tab, index) => (
          <button
            key={index}
            type="button"
            className={`tab-header ${activeTab === index ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}`}
            onClick={() => handleTabClick(index)}
            disabled={tab.disabled}
            aria-selected={activeTab === index}
            role="tab"
            tabIndex={activeTab === index ? 0 : -1}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default TabLayout;
