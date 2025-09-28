import React from 'react';
import { TabLayout, type TabItem } from '../components/ui';
import { EquipmentsTab, AttachmentsTab, SupportsTab } from '../components/assets';
import './AssetsPage.scss';

const AssetsPage: React.FC = () => {
  const assetTabs: TabItem[] = [
    {
      label: 'Equipments',
      content: <EquipmentsTab />
    },
    {
      label: 'Attachments',
      content: <AttachmentsTab />
    },
    {
      label: 'Support',
      content: <SupportsTab />
    }
  ];

  return (
    <div className="assets-page tabs-page">
      <TabLayout 
        tabs={assetTabs}
        variant="default"
        size="medium"
        onTabChange={(index) => {
          console.log('Assets tab changed to:', assetTabs[index].label);
        }}
      />
    </div>
  );
};

export default AssetsPage;
