import React from 'react';
import { APITable } from '../ui';
import type { BaseAsset } from './shared';
import { createAssetColumns } from './shared';
import './SupportsTab.scss';

// Support interface extends BaseAsset for type safety
interface Support extends BaseAsset {
  // Add any support-specific fields here if needed
}

const SupportsTab: React.FC = () => {
  return (
    <APITable<Support>
        endpoint="/assets/supports"
        columns={createAssetColumns<Support>({
          // Example customizations (uncomment to use):
          // additionalColumns: [
          //   { key: "support_type", title: "Support Type", dataIndex: "support_type" },
          // ],
          // excludeColumns: ["make"],
          // overrideColumns: {
          //   name: { title: "Support Equipment Name", sortable: true }
          // }
        })}
        exportable={true}
        size="middle"
        defaultPageSize={25}
        onRowClick={(record: Support) => {
          console.log('Support clicked:', record);
        }}
        onSelectionChange={(selectedRows: Support[], selectedKeys: (string | number)[]) => {
          console.log('Support selection changed:', selectedRows, selectedKeys);
        }}
      />
  );
};

export default SupportsTab;
