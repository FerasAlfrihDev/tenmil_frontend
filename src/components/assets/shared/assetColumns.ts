import type { ColumnConfig } from '../../ui/APITable/types';

// Base asset interface that all asset types extend
export interface BaseAsset {
  id: string;
  name: string;
  code: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  make: string;
  model: string;
  location: {
    id: string;
    name: string;
  };
  is_online: boolean;
}

// Base column configuration for all asset tables
export const baseAssetColumns: ColumnConfig<BaseAsset>[] = [
  { key: "name", title: "Name" },
  { key: "code", title: "Code" },
  { key: "description", title: "Description" },
  { key: "category", title: "Category", type: "custom" },
  { key: "make", title: "Make" },
  { key: "model", title: "Model" },
  { key: "location", title: "Location", type: "custom" },
  {
    key: "is_online",
    title: "Online Status",
    type: "boolean"
  },
];

// Utility function to create customized columns
export function createAssetColumns<T extends BaseAsset>(
  customizations?: {
    additionalColumns?: ColumnConfig<T>[];
    excludeColumns?: (keyof BaseAsset)[];
    overrideColumns?: Partial<Record<keyof BaseAsset, Partial<ColumnConfig<T>>>>;
  }
): ColumnConfig<T>[] {
  let columns = [...baseAssetColumns] as ColumnConfig<T>[];

  // Apply column overrides
  if (customizations?.overrideColumns) {
    columns = columns.map(col => {
      const override = customizations.overrideColumns?.[col.key as keyof BaseAsset];
      return override ? { ...col, ...override } : col;
    });
  }

  // Exclude specified columns
  if (customizations?.excludeColumns) {
    columns = columns.filter(col => 
      !customizations.excludeColumns!.includes(col.key as keyof BaseAsset)
    );
  }

  // Add additional columns
  if (customizations?.additionalColumns) {
    columns = [...columns, ...customizations.additionalColumns];
  }

  return columns;
}

// Pre-configured column sets for common use cases
export const equipmentColumns = createAssetColumns();
export const attachmentColumns = createAssetColumns();
export const supportColumns = createAssetColumns();
