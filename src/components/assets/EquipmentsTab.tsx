import React from 'react';
import { Plus, Edit, X } from 'lucide-react';
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
  // Action handlers
  const handleCreate = () => {
    console.log('Create new equipment');
    // TODO: Open create equipment modal/form
  };

  const handleUpdate = () => {
    console.log('Update equipment');
    // TODO: Open update equipment modal/form
  };

  const handleCancel = () => {
    console.log('Cancel operation');
    // TODO: Cancel current operation or close modal
  };

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
