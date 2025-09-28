import React from 'react';
import { APITable } from '../ui';
import type { BaseAsset } from './shared';
import { createAssetColumns, createAssetResponseTransformer } from './shared';
import './AttachmentsTab.scss';

// Attachment interface extends BaseAsset for type safety
interface Attachment extends BaseAsset {
  // Add any attachment-specific fields here if needed
}

const AttachmentsTab: React.FC = () => {
  // Use shared columns with optional customizations
  const columns = createAssetColumns<Attachment>({
    // Example customizations (uncomment to use):
    // additionalColumns: [
    //   { key: "attachment_type", header: "Attachment Type" },
    // ],
    // excludeColumns: ["model"],
    // overrideColumns: {
    //   name: { header: "Attachment Name", sortable: true }
    // }
  });

  return (
    <div className="attachments-tab">
      <APITable<Attachment>
        endpoint="/assets/attachments"
        columns={columns}
        title="Equipment Attachments"
        searchable={true}
        rowSelection={{ type: 'checkbox' }}
        exportConfig={{ enabled: true }}
        size="middle"
        bordered={true}
        defaultPageSize={25}
        requestConfig={{
          transform: createAssetResponseTransformer('attachments')
        }}
        bulkActions={[
          {
            key: 'delete',
            label: 'Delete Selected',
            icon: '🗑️',
            onClick: async (_selectedRows: Attachment[], selectedKeys: (string | number)[]) => {
              console.log('Delete attachments:', selectedKeys);
              // Implement delete logic here
            },
            confirm: {
              title: 'Delete Attachments',
              content: 'Are you sure you want to delete the selected attachments?'
            }
          }
        ]}
        onRowClick={(record: Attachment) => {
          console.log('Attachment clicked:', record);
        }}
        onError={(error: Error) => {
          console.error('Attachments table error:', error);
        }}
      />
    </div>
  );
};

export default AttachmentsTab;
