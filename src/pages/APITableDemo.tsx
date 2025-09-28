// ========================================
// API TABLE DEMO PAGE
// ========================================

import React from 'react';
import { APITable } from '../components/ui/APITable';
import type { ColumnConfig, FilterConfig } from '../components/ui/APITable';
import './APITableDemo.scss';

const APITableDemo: React.FC = () => {
  const columns: ColumnConfig[] = [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
      width: 80,
    },
    {
      key: 'name',
      title: 'Equipment Name',
      sortable: true,
      searchable: true,
      ellipsis: true,
    },
    {
      key: 'category',
      title: 'Category',
      sortable: true,
      filterable: true,
      width: 150,
    },
    {
      key: 'price',
      title: 'Price',
      type: 'number',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="price">
          ${value?.toLocaleString() || '0'}
        </span>
      ),
    },
    {
      key: 'is_active',
      title: 'Status',
      type: 'boolean',
      filterable: true,
      width: 100,
      render: (value) => (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'created_at',
      title: 'Created',
      type: 'date',
      sortable: true,
      dateFormat: 'short',
      width: 120,
    },
  ];

  const filters: FilterConfig[] = [
    {
      field: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Machinery', value: 'machinery' },
        { label: 'Tools', value: 'tools' },
      ],
    },
    {
      field: 'is_active',
      type: 'boolean',
      label: 'Status',
    },
    {
      field: 'price',
      type: 'numberrange',
      label: 'Price Range',
    },
    {
      field: 'created_at',
      type: 'daterange',
      label: 'Created Date',
    },
  ];

  const handleRowClick = (record: any) => {
    console.log('Row clicked:', record);
  };

  const handleSelectionChange = (selectedRows: any[], selectedKeys: (string | number)[]) => {
    console.log('Selection changed:', { selectedRows, selectedKeys });
  };

  return (
    <div className="api-table-demo">
      <div className="demo-header">
        <h1>APITable Component Demo</h1>
        <p>
          This demo shows the comprehensive APITable component with all features enabled.
          Try sorting, filtering, searching, and selecting rows to see it in action.
        </p>
      </div>

      <div className="demo-content">
        <APITable
          endpoint="/api/equipment/"
          columns={columns}
          filters={filters}
          defaultPageSize={25}
          defaultSort="-created_at"
          exportable
          selectable
          onRowClick={handleRowClick}
          onSelectionChange={handleSelectionChange}
          showRefreshButton
          showColumnSettings
          showDensitySettings
          bordered
          striped
          hover
          sticky
          className="demo-table"
        />
      </div>

      <div className="demo-info">
        <h2>Features Demonstrated</h2>
        <ul>
          <li>✅ Server-side pagination with customizable page sizes</li>
          <li>✅ Column sorting with visual indicators</li>
          <li>✅ Advanced filtering (text, select, boolean, date range, number range)</li>
          <li>✅ Global search across searchable columns</li>
          <li>✅ Row selection with bulk actions</li>
          <li>✅ Export functionality (CSV, Excel, JSON)</li>
          <li>✅ Column settings (show/hide, resize)</li>
          <li>✅ Density settings (compact, default, comfortable)</li>
          <li>✅ Responsive design with mobile support</li>
          <li>✅ Light/dark theme compatibility</li>
          <li>✅ Loading states and error handling</li>
          <li>✅ URL state synchronization</li>
        </ul>
      </div>
    </div>
  );
};

export default APITableDemo;
