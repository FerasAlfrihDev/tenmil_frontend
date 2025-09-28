import React from 'react';
import { APITable } from '../ui';
import type { BaseAsset } from './shared';
import { createAssetColumns, createAssetResponseTransformer } from './shared';
import './EquipmentsTab.scss';

// Equipment interface extends BaseAsset for type safety
interface Equipment extends BaseAsset {
  // Add any equipment-specific fields here if needed
}

const EquipmentsTab: React.FC = () => {
  // Use shared columns with optional customizations
  const columns = createAssetColumns<Equipment>({
    // Example customizations (uncomment to use):
    // additionalColumns: [
    //   { key: "serial_number", header: "Serial Number" },
    // ],
    // excludeColumns: ["make"],
    // overrideColumns: {
    //   name: { header: "Equipment Name", sortable: true }
    // }
  });

  return (
    <div className="equipments-tab">
      <APITable<Equipment>
        endpoint="/assets/equipments"
        columns={columns}
        title="Equipment Management"
        searchable={true}
        rowSelection={{ type: 'checkbox' }}
        exportConfig={{ enabled: true }}
        size="middle"
        bordered={true}
        defaultPageSize={25}
        requestConfig={{
          transform: createAssetResponseTransformer('equipments')
        }}
        bulkActions={[
          {
            key: 'delete',
            label: 'Delete Selected',
            icon: '🗑️',
            onClick: async (_selectedRows: Equipment[], selectedKeys: (string | number)[]) => {
              console.log('Delete equipment:', selectedKeys);
              // Implement delete logic here
            },
            confirm: {
              title: 'Delete Equipment',
              content: 'Are you sure you want to delete the selected equipment?'
            }
          }
        ]}
        onRowClick={(record: Equipment) => {
          console.log('Equipment clicked:', record);
        }}
        onError={(error: Error) => {
          console.error('Equipment table error:', error);
        }}
      />
    </div>
  );
};

export default EquipmentsTab;
