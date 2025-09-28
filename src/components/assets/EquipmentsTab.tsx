import React from 'react';
import { APITable } from '../ui';
import type { BaseAsset } from './shared';
import { createAssetColumns } from './shared';
import './EquipmentsTab.scss';

// Equipment interface extends BaseAsset for type safety
interface Equipment extends BaseAsset {
  // Add any equipment-specific fields here if needed
  equipment_type?: string;
}

const EquipmentsTab: React.FC = () => {
  return (
    <APITable<Equipment>
        endpoint="/assets/equipments"
        columns={createAssetColumns<Equipment>({})}
        exportable={true}
        size="middle"
        defaultPageSize={25}
        onRowClick={(record: Equipment) => {
          console.log('Equipment clicked:', record);
        }}
        onSelectionChange={(selectedRows: Equipment[], selectedKeys: (string | number)[]) => {
          console.log('Equipment selection changed:', selectedRows, selectedKeys);
        }}
      />
  );
};

export default EquipmentsTab;
