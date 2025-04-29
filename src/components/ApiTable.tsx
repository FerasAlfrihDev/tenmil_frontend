import React, { useEffect, useState } from 'react';
import { apiCall } from './../utils/api';
import Table from 'react-bootstrap/Table';
import LoadingModal from './LoadingModal';


interface ApiTableColumn {
  key: string;
  label: string;
  type?: 'number' | 'date' | 'string' | 'boolean' | 'object';
  render?: (row: any) => React.ReactNode;
}

interface ApiTableProps {
  endpoint: string;
  columns: ApiTableColumn[];
  paginate?: boolean;
  pageSize?: number;
  hasCreateButton?: boolean;
  createButtonLink?: string;
  createButtonName?: string;
  reload?: boolean;
  setReload?: (reload: boolean) => void;
  filters?: any;
}

const ApiTable: React.FC<ApiTableProps> = ({
  endpoint,
  columns,
  hasCreateButton = true,
  createButtonLink,
  createButtonName = 'Create',
  pageSize = 10,
  reload = false,
  filters = {},
  setReload,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall<any[]>(endpoint, 'GET', undefined, {
        ...filters,
      });
      setData(response);
    } catch (err: any) {
      console.error('API Fetch Error:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, pageSize]);

  useEffect(() => {
    if (reload) {
      fetchData();
      setReload && setReload(false);
    }
  }, [reload]);

  const goToDetailsPage = (id: string) => {
    if (!createButtonLink) return;
    window.location.href = `${createButtonLink}/${id}`;
  };

  return (
    <div className="api-table-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-bold text-primary">Data List</h5>
        {hasCreateButton && createButtonLink && (
          <a href={`${createButtonLink}/new`} className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i> {createButtonName}
          </a>
        )}
      </div>

      <div className="table-responsive rounded shadow-sm bg-light p-3">
        <Table hover responsive>
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="text-uppercase small fw-bold text-secondary">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {loading ? (
            <tbody>
              <tr>
                <td colSpan={columns.length} className="text-center p-5">
                  <LoadingModal loading={loading} />
                </td>
              </tr>
            </tbody>
          ) : error ? (
            <tbody>
              <tr>
                <td colSpan={columns.length} className="text-center text-danger p-5">
                  {error}
                </td>
              </tr>
            </tbody>
          ) : data.length > 0 ? (
            <tbody>
              {data.map((row, index) => (
                <tr key={index} onClick={() => goToDetailsPage(row.id)} style={{ cursor: 'pointer' }} className="table-row-hover">
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
                      return (
                        <td key={col.key}>
                          {value?.name || value?.id || '-'}
                        </td>
                      );
                    }

                    if (col.type === 'date') {
                      value = value ? new Date(value).toLocaleDateString() : '-';
                    }

                    return (
                      <td key={col.key}>
                        {col.render ? col.render(row) : value ?? '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={columns.length} className="text-center text-muted p-5">
                  No records found.
                </td>
              </tr>
            </tbody>
          )}
        </Table>
      </div>
    </div>
  );
};

export default ApiTable;
