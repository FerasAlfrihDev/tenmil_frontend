import React from 'react';
import { APITable } from '../ui';
import type { BaseAsset } from './shared';
import { createAssetColumns, createAssetResponseTransformer } from './shared';
import './SupportsTab.scss';

// Support interface extends BaseAsset for type safety
interface Support extends BaseAsset {
  // Add any support-specific fields here if needed
}

const SupportsTab: React.FC = () => {
  // Use shared columns with optional customizations
  const columns = createAssetColumns<Support>({
    // Example customizations (uncomment to use):
    // additionalColumns: [
    //   { key: "support_type", header: "Support Type" },
    // ],
    // excludeColumns: ["make"],
    // overrideColumns: {
    //   name: { header: "Support Equipment Name", sortable: true }
    // }
  });

  return (
    <div className="supports-tab">
      <APITable<Support>
        endpoint="/assets/supports"
        columns={columns}
        title="Support Equipment"
        searchable={true}
        rowSelection={{ type: 'checkbox' }}
        exportConfig={{ enabled: true }}
        size="middle"
        bordered={true}
        defaultPageSize={25}
        requestConfig={{
          transform: createAssetResponseTransformer('supports')
        }}
        bulkActions={[
          {
            key: 'delete',
            label: 'Delete Selected',
            icon: '🗑️',
            onClick: async (_selectedRows: Support[], selectedKeys: (string | number)[]) => {
              console.log('Delete supports:', selectedKeys);
              // Implement delete logic here
            },
            confirm: {
              title: 'Delete Support Equipment',
              content: 'Are you sure you want to delete the selected support equipment?'
            }
          }
        ]}
        onRowClick={(record: Support) => {
          console.log('Support clicked:', record);
        }}
        onError={(error: Error) => {
          console.error('Supports table error:', error);
        }}
      />
    </div>
  );
};

export default SupportsTab;
