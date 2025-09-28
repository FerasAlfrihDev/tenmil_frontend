# APITable Component

A comprehensive, production-ready table component that integrates seamlessly with Django REST API backends. Built with React, TypeScript, and follows the Tenmil Frontend project's styling guidelines.

## Features

- ✅ **Dynamic Data Loading**: Fetch data from any API endpoint
- ✅ **Advanced Pagination**: Previous/Next buttons, page numbers, page size selector
- ✅ **Column Sorting**: Clickable headers with visual sort indicators
- ✅ **Advanced Filtering**: Text search, date ranges, dropdowns, boolean toggles, multi-select
- ✅ **Loading States**: Skeleton loading with proper UX
- ✅ **Error Handling**: User-friendly error messages with retry functionality
- ✅ **Responsive Design**: Mobile-friendly with horizontal scroll
- ✅ **Row Selection**: Single/multiple selection with bulk actions
- ✅ **Export Functionality**: CSV, Excel, JSON export with customizable options
- ✅ **URL State Sync**: Sync table state with URL parameters
- ✅ **Column Management**: Show/hide columns, resize, reorder
- ✅ **Customizable Styling**: Light/dark mode support, density settings
- ✅ **Expandable Rows**: Support for nested content
- ✅ **Real-time Updates**: Optional auto-refresh with configurable intervals
- ✅ **Accessibility**: Full keyboard navigation and screen reader support

## Backend API Requirements

The APITable component is designed to work with Django REST API backends using the following specifications:

### Response Format
```json
{
  "data": [...],
  "meta_data": {
    "success": true,
    "total": 25,
    "status_code": 200
  },
  "pagination": {
    "current_page": 1,
    "total_pages": 4,
    "total_items": 100,
    "page_size": 25,
    "has_next": true,
    "has_previous": false,
    "next_page": 2,
    "previous_page": null
  }
}
```

### Query Parameters
- **Pagination**: `?page=1&pageSize=25`
- **Sorting**: `?ordering=name` (asc) or `?ordering=-name` (desc)
- **Search**: `?search=query`
- **Filtering**: Django field lookups like `?name__icontains=value`, `?status__in=active,pending`

## Basic Usage

```tsx
import { APITable } from '../components/ui';

const EquipmentTable = () => {
  return (
    <APITable
      endpoint="/api/equipment/"
      columns={[
        { key: 'id', title: 'ID', sortable: true },
        { key: 'name', title: 'Name', sortable: true, searchable: true },
        { key: 'category', title: 'Category', sortable: true, filterable: true },
        { key: 'is_active', title: 'Active', type: 'boolean', filterable: true },
        { key: 'created_at', title: 'Created', type: 'date', sortable: true }
      ]}
      searchable={true}
      exportable={true}
      selectable={true}
      onRowClick={(record) => console.log('Row clicked:', record)}
    />
  );
};
```

## Advanced Usage

```tsx
import { APITable, ColumnConfig, FilterConfig } from '../components/ui';

const AdvancedTable = () => {
  const columns: ColumnConfig[] = [
    {
      key: 'id',
      title: 'ID',
      width: 80,
      sortable: true,
      fixed: 'left'
    },
    {
      key: 'name',
      title: 'Equipment Name',
      sortable: true,
      searchable: true,
      ellipsis: true,
      render: (value, record) => (
        <div>
          <strong>{value}</strong>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.serial_number}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      type: 'text',
      render: (value) => (
        <span className={`status-badge status-${value}`}>
          {value.toUpperCase()}
        </span>
      )
    },
    {
      key: 'price',
      title: 'Price',
      type: 'currency',
      align: 'right',
      sortable: true
    },
    {
      key: 'created_at',
      title: 'Created Date',
      type: 'date',
      sortable: true,
      width: 120
    },
    {
      key: 'actions',
      title: 'Actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <div>
          <button onClick={() => editRecord(record)}>Edit</button>
          <button onClick={() => deleteRecord(record)}>Delete</button>
        </div>
      )
    }
  ];

  const filters: FilterConfig[] = [
    {
      field: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'furniture', label: 'Furniture' },
        { value: 'vehicles', label: 'Vehicles' }
      ]
    },
    {
      field: 'status',
      type: 'multiselect',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'maintenance', label: 'Maintenance' }
      ]
    },
    {
      field: 'is_active',
      type: 'boolean',
      label: 'Active Status'
    },
    {
      field: 'created_at',
      type: 'daterange',
      label: 'Creation Date'
    },
    {
      field: 'price',
      type: 'number',
      label: 'Price Range',
      numberFormat: { min: 0, max: 100000, step: 100 }
    }
  ];

  const handleSelectionChange = (selectedRows, selectedKeys) => {
    console.log('Selection changed:', { selectedRows, selectedKeys });
  };

  const handleDataChange = (data) => {
    console.log('Data updated:', data.length, 'items');
  };

  return (
    <APITable
      endpoint="/api/equipment/"
      columns={columns}
      filters={filters}
      defaultPageSize={50}
      defaultSort="-created_at"
      searchable={true}
      searchPlaceholder="Search equipment..."
      exportable={true}
      selectable={true}
      showRefreshButton={true}
      showColumnSettings={true}
      showDensitySettings={true}
      refreshInterval={30000} // Auto-refresh every 30 seconds
      size="middle"
      bordered={true}
      hover={true}
      sticky={true}
      maxHeight={600}
      onRowClick={handleRowClick}
      onSelectionChange={handleSelectionChange}
      onDataChange={handleDataChange}
      expandable={{
        expandedRowRender: (record) => (
          <div style={{ padding: '16px' }}>
            <h4>Equipment Details</h4>
            <p>Serial Number: {record.serial_number}</p>
            <p>Description: {record.description}</p>
            <p>Location: {record.location}</p>
          </div>
        ),
        expandRowByClick: false
      }}
      rowClassName={(record, index) => 
        record.status === 'inactive' ? 'row-inactive' : ''
      }
    />
  );
};
```

## Column Configuration

### Basic Column Properties

```tsx
interface ColumnConfig {
  key: string;                    // Unique identifier
  title: string;                  // Column header text
  dataIndex?: string | string[];  // Data field path (supports nested)
  type?: ColumnType;              // Data type for formatting
  width?: number;                 // Fixed width in pixels
  minWidth?: number;              // Minimum width
  maxWidth?: number;              // Maximum width
  sortable?: boolean;             // Enable sorting
  filterable?: boolean;           // Enable filtering
  searchable?: boolean;           // Include in search
  resizable?: boolean;            // Allow column resizing
  fixed?: 'left' | 'right';       // Fix column position
  align?: 'left' | 'center' | 'right'; // Text alignment
  ellipsis?: boolean;             // Truncate with ellipsis
  render?: (value, record, index) => ReactNode; // Custom renderer
  className?: string;             // Custom CSS class
  headerClassName?: string;       // Header CSS class
}
```

### Column Types

- `text`: Default text display
- `number`: Formatted numbers with locale
- `currency`: Currency formatting ($1,234.56)
- `percentage`: Percentage display (45.67%)
- `date`: Date formatting (MM/DD/YYYY)
- `datetime`: Date and time formatting
- `boolean`: Yes/No display
- `custom`: Use render function

### Custom Renderers

```tsx
{
  key: 'status',
  title: 'Status',
  render: (value, record, index) => (
    <span className={`status-${value}`}>
      {value.toUpperCase()}
    </span>
  )
}
```

## Filter Configuration

### Filter Types

```tsx
interface FilterConfig {
  field: string;                  // API field name
  type: FilterType;              // Filter input type
  label?: string;                // Display label
  placeholder?: string;          // Input placeholder
  options?: FilterOption[];      // Options for select/multiselect
  multiple?: boolean;            // Allow multiple selections
  searchable?: boolean;          // Searchable dropdown
  dateFormat?: string;           // Date format string
  numberFormat?: {               // Number constraints
    min?: number;
    max?: number;
    step?: number;
  };
}
```

### Available Filter Types

- `text`: Text input with contains search
- `select`: Single selection dropdown
- `multiselect`: Multiple selection dropdown
- `boolean`: Toggle switch
- `date`: Single date picker
- `daterange`: Start and end date pickers
- `number`: Number input with constraints

### Filter Examples

```tsx
const filters: FilterConfig[] = [
  // Text filter
  {
    field: 'name',
    type: 'text',
    placeholder: 'Search by name...'
  },
  
  // Select filter
  {
    field: 'category',
    type: 'select',
    label: 'Category',
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'furniture', label: 'Furniture' }
    ]
  },
  
  // Date range filter
  {
    field: 'created_at',
    type: 'daterange',
    label: 'Creation Date'
  },
  
  // Number range filter
  {
    field: 'price',
    type: 'number',
    label: 'Max Price',
    numberFormat: { min: 0, max: 10000, step: 100 }
  },
  
  // Boolean filter
  {
    field: 'is_active',
    type: 'boolean',
    label: 'Active Only'
  }
];
```

## Export Functionality

### Export Options

```tsx
interface ExportOptions {
  format: 'csv' | 'excel' | 'json';
  filename?: string;
  selectedOnly?: boolean;        // Export only selected rows
  visibleColumnsOnly?: boolean;  // Export only visible columns
  includeHeaders?: boolean;      // Include column headers
}
```

### Programmatic Export

```tsx
const handleCustomExport = () => {
  // Access the export function through ref or callback
  exportData({
    format: 'csv',
    filename: 'equipment-report',
    selectedOnly: false,
    visibleColumnsOnly: true,
    includeHeaders: true
  });
};
```

## Bulk Actions

```tsx
interface BulkAction {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: (selectedRows, selectedKeys) => void;
}

const bulkActions: BulkAction[] = [
  {
    key: 'activate',
    label: 'Activate Selected',
    icon: <CheckIcon />,
    onClick: (selectedRows, selectedKeys) => {
      // Perform bulk activation
      activateEquipment(selectedKeys);
    }
  },
  {
    key: 'delete',
    label: 'Delete Selected',
    icon: <TrashIcon />,
    danger: true,
    onClick: (selectedRows, selectedKeys) => {
      if (confirm('Delete selected items?')) {
        deleteEquipment(selectedKeys);
      }
    }
  }
];
```

## Styling and Theming

### Size Variants

- `small`: Compact table for dense data
- `middle`: Default size (recommended)
- `large`: Spacious table for better readability

### Density Settings

- `compact`: Minimal padding
- `middle`: Default padding
- `comfortable`: Extra padding

### Theme Support

The component automatically supports light/dark mode based on:
- CSS classes: `.theme-light`, `.theme-dark`
- System preference: `prefers-color-scheme`

### Custom Styling

```scss
// Custom row styling
.api-table {
  .table-body__row {
    &.row-inactive {
      opacity: 0.6;
      background: #f5f5f5;
    }
    
    &.row-urgent {
      border-left: 4px solid #ff4444;
    }
  }
}
```

## Performance Optimization

### Virtual Scrolling

```tsx
<APITable
  virtualScroll={true}
  maxHeight={400}
  // ... other props
/>
```

### Debounced Filtering

All filter inputs are automatically debounced (300ms default) to prevent excessive API calls.

### Request Deduplication

The component automatically deduplicates identical requests to prevent unnecessary API calls.

### Caching

API responses are cached based on query parameters to improve performance.

## Accessibility

- Full keyboard navigation support
- Screen reader compatibility
- ARIA labels and roles
- Focus management
- High contrast mode support

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## TypeScript Support

The component is fully typed with comprehensive TypeScript interfaces. All props, callbacks, and data structures include proper type definitions.

## Error Handling

- Network errors with retry functionality
- Validation errors with user-friendly messages
- Loading state management
- Graceful fallbacks for missing data

## Migration from Basic Table

If you're migrating from the basic Table component:

```tsx
// Old Table component
<Table
  columns={columns}
  dataSource={data}
  pagination={{ current: 1, pageSize: 25, total: 100 }}
  loading={loading}
/>

// New APITable component
<APITable
  endpoint="/api/data/"
  columns={columns}
  defaultPageSize={25}
/>
```

The APITable handles data fetching, pagination, and state management automatically.

## Contributing

When contributing to the APITable component:

1. Follow the project's TypeScript and SCSS guidelines
2. Ensure all new features include proper type definitions
3. Add comprehensive tests for new functionality
4. Update documentation for any API changes
5. Follow the established naming conventions

## License

This component is part of the Tenmil Frontend project and follows the project's licensing terms.