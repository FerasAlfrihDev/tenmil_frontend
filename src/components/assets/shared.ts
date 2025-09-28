import type { ColumnConfig } from '../ui/APITable/types';

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

// Configuration options for creating asset columns
export interface AssetColumnsConfig<T extends BaseAsset> {
  additionalColumns?: ColumnConfig<T>[];
  excludeColumns?: (keyof BaseAsset)[];
  overrideColumns?: Partial<Record<keyof BaseAsset, Partial<ColumnConfig<T>>>>;
}

// Default base columns for all asset types
const baseAssetColumns: ColumnConfig<BaseAsset>[] = [
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
    type: "boolean",
  },
];

// Factory function to create customized asset columns
export function createAssetColumns<T extends BaseAsset>(
  config: AssetColumnsConfig<T> = {}
): ColumnConfig<T>[] {
  const { additionalColumns = [], excludeColumns = [], overrideColumns = {} } = config;

  // Start with base columns, excluding any specified columns
  let columns = baseAssetColumns
    .filter(col => !excludeColumns.includes(col.key as keyof BaseAsset))
    .map(col => {
      // Apply any overrides for this column
      const override = overrideColumns[col.key as keyof BaseAsset];
      return override ? { ...col, ...override } : col;
    }) as ColumnConfig<T>[];

  // Add any additional columns
  if (additionalColumns.length > 0) {
    columns = [...columns, ...additionalColumns];
  }

  return columns;
}

// Shared response transformer for asset endpoints
export const createAssetResponseTransformer = (assetTypeName: string) => {
  return (response: any) => {
    // Handle different response formats
    if (response.data && response.pagination) {
      // Already in correct format
      return response;
    } else if (Array.isArray(response)) {
      // Direct array response - create pagination
      return {
        data: response,
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_items: response.length,
          page_size: response.length,
          has_next: false,
          has_previous: false,
          next_page: null,
          previous_page: null,
        },
        meta_data: {
          success: true,
          total: response.length,
          status_code: 200,
        }
      };
    } else if (response.results) {
      // Django REST framework format
      return {
        data: response.results,
        pagination: {
          current_page: 1,
          total_pages: Math.ceil((response.count || response.results.length) / 25),
          total_items: response.count || response.results.length,
          page_size: 25,
          has_next: !!response.next,
          has_previous: !!response.previous,
          next_page: response.next ? 2 : null,
          previous_page: response.previous ? 0 : null,
        },
        meta_data: {
          success: true,
          total: response.count || response.results.length,
          status_code: 200,
        }
      };
    } else {
      // Unknown format - try to extract data
      const data = response.data || response.items || response[assetTypeName] || [];
      return {
        data: Array.isArray(data) ? data : [],
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_items: Array.isArray(data) ? data.length : 0,
          page_size: Array.isArray(data) ? data.length : 0,
          has_next: false,
          has_previous: false,
          next_page: null,
          previous_page: null,
        },
        meta_data: {
          success: true,
          total: Array.isArray(data) ? data.length : 0,
          status_code: 200,
        }
      };
    }
  };
};
