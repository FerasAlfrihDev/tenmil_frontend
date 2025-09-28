import React from 'react';
import { APITable } from '../ui';
import type { BaseAsset } from './shared';
import { createAssetColumns } from './shared';
import './AttachmentsTab.scss';

// Attachment interface extends BaseAsset for type safety
interface Attachment extends BaseAsset {
  // Add any attachment-specific fields here if needed
}

const AttachmentsTab: React.FC = () => {
  return (
    <APITable<Attachment>
        endpoint="/assets/attachments"
        columns={createAssetColumns<Attachment>({
          // Example customizations (uncomment to use):
          // additionalColumns: [
          //   { key: "attachment_type", title: "Attachment Type", dataIndex: "attachment_type" },
          // ],
          // excludeColumns: ["model"],
          // overrideColumns: {
          //   name: { title: "Attachment Name", sortable: true }
          // }
        })}
        exportable={true}
        size="middle"
        defaultPageSize={25}
        onRowClick={(record: Attachment) => {
          console.log('Attachment clicked:', record);
        }}
        onSelectionChange={(selectedRows: Attachment[], selectedKeys: (string | number)[]) => {
          console.log('Attachment selection changed:', selectedRows, selectedKeys);
        }}
      />
  );
};

export default AttachmentsTab;
