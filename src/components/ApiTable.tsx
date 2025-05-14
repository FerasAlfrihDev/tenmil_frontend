import React, { useEffect, useState } from 'react';
import { apiCall } from './../utils/api';
import Table from 'react-bootstrap/Table';
import { Form, Button, InputGroup } from 'react-bootstrap';
import MaintenanceSpinner from './MaintenanceSpinner';
import { useNavigate } from 'react-router-dom';

interface ApiTableColumn {
  key: string;
  label: string;
  type?: 'number' | 'date' | 'string' | 'boolean' | 'object';
  render?: (row: any) => React.ReactNode;
  sortable?: boolean;
}

interface ApiTableProps {
  endpoint: string;
  columns: ApiTableColumn[];
  paginate?: boolean;
  pageSize?: number;
  hasCreateButton?: boolean;
  createButtonName?: string;
  reload?: boolean;
  setReload?: (reload: boolean) => void;
  filters?: any;
  formTemplate?: any[];
  clickToView?: boolean;
  tableName: string;
  useGeneratedPage?: boolean;
}

const ApiTable: React.FC<ApiTableProps> = ({
  endpoint,
  columns,
  hasCreateButton = true,
  createButtonName = 'Create',
  pageSize = 10,
  reload = false,
  filters = {},
  setReload,
  formTemplate,
  clickToView = false,
  tableName,
  useGeneratedPage = false,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
  const navigate = useNavigate();

  const encodeEndpoint = (endpoint: string) => endpoint.replace('/', '__');

  const handleRoute = (id: string | 'new', isView: boolean = false) => {
    const path = useGeneratedPage
      ? `/generated/${encodeEndpoint(endpoint)}/${id}`
      : `/form/${encodeEndpoint(endpoint)}/${id}`;

    navigate(path, {
      state: {
        formTemplate: formTemplate || columns.map((col) => ({
          component: 'InputGroup',
          name: col.key,
          label: col.label,
          type: col.type === 'date' ? 'date' : 'text',
          required: true,
        })),
        ...(isView ? { viewOnly: true } : {})
      }
    });
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let orderingParam = '';
      if (sortConfig.key) {
        orderingParam = sortConfig.direction === 'desc' ? `-${sortConfig.key}` : sortConfig.key;
      }

      const queryParams = {
        ...filters,
        search: globalSearch || undefined,
        ordering: orderingParam || undefined,
        ...columnFilters,
      };

      const response = await apiCall<any[]>(endpoint, 'GET', undefined, queryParams);
      setData(response);
    } catch (err: any) {
      console.error('API Fetch Error:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [endpoint, pageSize, globalSearch, columnFilters, sortConfig]);

  useEffect(() => {
    if (reload) {
      fetchData();
      setReload && setReload(false);
    }
  }, [reload]);

  const handleColumnFilterChange = (key: string, value: any) => {
    setColumnFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleSort = (key: string) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        setSortConfig({ key, direction: 'desc' });
      } else if (sortConfig.direction === 'desc') {
        setSortConfig({ key: '', direction: null });
      } else {
        setSortConfig({ key, direction: 'asc' });
      }
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiCall<any[]>(`${endpoint}/${id}`, 'DELETE');
      fetchData();
    } catch {
      setError("Something went wrong while deleting the data");
    }
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <i className="bi bi-arrow-down-up ms-1"></i>;
    if (sortConfig.direction === 'asc') return <i className="bi bi-arrow-up ms-1"></i>;
    if (sortConfig.direction === 'desc') return <i className="bi bi-arrow-down ms-1"></i>;
    return null;
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary mb-0">{tableName}</h4>
      </div>

      <div className="api-table-container">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <div className="d-flex gap-2">
            <InputGroup style={{ maxWidth: '300px' }}>
              <Form.Control
                type="text"
                placeholder="Search..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
              <Button variant="outline-secondary">
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>

            <Button variant="outline-primary" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {hasCreateButton && (
            <Button className="btn btn-primary" onClick={() => handleRoute('new')}>
              <i className="bi bi-plus-circle me-2" /> {createButtonName}
            </Button>
          )}
        </div>

        <div className="table-responsive bg-light rounded shadow-sm p-3">
          <Table hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="text-uppercase small text-muted fw-bold"
                    style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    {col.label}
                    {col.sortable && renderSortIcon(col.key)}
                  </th>
                ))}
                <th className="text-uppercase small text-muted fw-bold text-center">Actions</th>
              </tr>

              {showFilters && (
                <tr>
                  {columns.map((col) => (
                    <th key={col.key}>
                      {col.type === 'boolean' || col.type === 'object' ? (
                        <div className="text-center text-muted small">N/A</div>
                      ) : (
                        <Form.Control
                          size="sm"
                          type={col.type === 'number' ? 'number' : 'text'}
                          placeholder="Filter"
                          value={columnFilters[col.key] || ''}
                          onChange={(e) => handleColumnFilterChange(col.key, e.target.value)}
                          className="small-input"
                        />
                      )}
                    </th>
                  ))}
                  <th></th>
                </tr>
              )}
            </thead>

            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-5">
                    <MaintenanceSpinner size={64} />
                  </td>
                </tr>
              </tbody>
            ) : error ? (
              <tbody>
                <tr>
                  <td colSpan={columns.length + 1} className="text-center text-danger py-5">
                    {error}
                  </td>
                </tr>
              </tbody>
            ) : data && data.length > 0 ? (
              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={index}
                    style={{ cursor: clickToView ? 'pointer' : 'default' }}
                    className="table-hover-row"
                    onClick={() => clickToView && handleRoute(`${row.id}`, true)}
                  >
                    {columns.map((col) => {
                      let value = row[col.key];
                      if (col.type === 'boolean') {
                        return (
                          <td key={col.key} className="text-center">
                            {value ? (
                              <i className="bi bi-check-circle-fill text-success"></i>
                            ) : (
                              <i className="bi bi-x-circle-fill text-danger"></i>
                            )}
                          </td>
                        );
                      }
                      if (col.type === 'object') {
                        return <td key={col.key}>{value?.name || value?.id || '-'}</td>;
                      }
                      if (col.type === 'date') {
                        value = value ? new Date(value).toLocaleDateString() : '-';
                      }
                      return <td key={col.key}>{col.render ? col.render(row) : value ?? '-'}</td>;
                    })}
                    <td className="text-center">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoute(row.id);
                        }}
                      >
                        <i className="bi bi-pencil" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(row.id);
                        }}
                      >
                        <i className="bi bi-trash" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={columns.length + 1} className="text-center text-muted py-5">
                    No records found.
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ApiTable;
