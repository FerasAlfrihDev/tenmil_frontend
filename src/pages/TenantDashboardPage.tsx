
import '../styles/TenantDashboard.scss';

import React, { useEffect } from 'react';
import { Card, Row, Col, Table, ProgressBar } from 'react-bootstrap';
import { apiCall } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { WorkOrderFormTemplate } from '../formTemplates/WorkOrderFormTemplates';
import { AssetFormTemplate } from '../formTemplates/AssetFormTemplate';

const TenantDashboard: React.FC = () => {
  const [data, setData] = React.useState<any>();
  const navigate = useNavigate()

   const handleRoute = (path:string, type:string) => {
    const formTemplate= type ==="work-order" ?
      WorkOrderFormTemplate : AssetFormTemplate
      
    navigate(path, {
        state: {
          formTemplate: formTemplate
        }
      }
    );
  };


  const fetch = async() => {
      const url = '/dashboard'
      const response = await apiCall<any>(url, 'GET')
      setData(response)
    }

  useEffect(() => {
    fetch()
    console.log("data", data);
    
  }, [])

  const recentActions:[string, string, string, number][] = data?.top_assets_utilization
  return (
    <div className="tenant-dashboard container py-4">
      {/* Header */}
      <h4 className="fw-bold mb-4 text-primary">Welcome to Tenmil Dashboard</h4>

      {/* Quick Stats */}
      <Row className="mb-4 g-4">
        {[
          { title: 'Open Work Orders', value: data?.open_work_orders_count },
          { title: 'Assets in Use', value: data?.online_assets_count },
          { title: 'Scheduled Maintenance', value: data?.scheduled_maintenance_count },
          { title: 'Unassigned Tasks', value: data?.unassigned_taskes_count },
        ].map((stat, index) => (
          <Col md={3} key={index}>
            <Card className="shadow-sm stat-card hover-card h-100">
              <Card.Body>
                <h6 className="text-muted small mb-1">{stat.title}</h6>
                <h4 className="fw-bold stat-value">{stat.value}</h4>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Work Order Chart Placeholder */}
      <Row className="mb-4 g-4">
        <Col md={6}>
          <Card className="shadow-sm h-100 hover-card">
            <Card.Body>
              <h6 className="text-muted small mb-3">Work Orders by Status</h6>
              <div className="container">
                <Table hover responsive  className="mb-0">
                  <tbody>
                    {
                      data?.work_orders_by_status.map((wo:any) =>{
                        return (
                          <tr 
                            key={wo.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleRoute(`/work-orders/${wo.id}`, 'work-order')}
                          >
                            <td className=''>{wo.code}</td>
                            <td className=''>{wo.status}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Upcoming Tasks */}
        <Col md={6}>
          <Card className="shadow-sm h-100 hover-card">
            <Card.Body>
              <h6 className="text-muted small mb-3">Upcoming Maintenance</h6>
              <ul className="task-list">
                {data?.upcomming_maintenance.map((task:any, index:number) => (
                  <li key={index} className="mb-2">
                    <i className="bi bi-wrench-adjustable-circle me-2 text-primary"></i>
                    {task}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bottom Section */}
      <Row className="g-4">
        {/* Top Assets */}
        <Col md={6}>
          <Card className="shadow-sm hover-card h-100">
            <Card.Body>
              <h6 className="text-muted small mb-3">Top Performing Assets</h6>
              <Table hover responsive className="asset-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Status</th>
                    <th>Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActions?.map(([id, name, status, percent]) => (
                    <tr 
                      key={id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRoute(`/assets/${id}`, 'assets')}
                    >
                      <td>{name}</td>
                      <td>
                        <span className={`badge ${status == 'Online' ? 'bg-success' : 'bg-danger'}`}>{status}</span>
                      </td>
                      <td>
                        <ProgressBar 
                          now={+percent} 
                          label={`${percent}%`} 
                          variant={percent > 50 ? 'success' : 'danger'}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Users */}
        <Col md={6}>
          <Card className="shadow-sm hover-card h-100">
            <Card.Body>
              <h6 className="text-muted small mb-3">Recent User Activity</h6>
              <ul className="activity-log">
                {data?.recent_user_activity.map((log:any, index:number) => (
                  <li key={index} className="mb-2">
                    <i className="bi bi-person-circle me-2 text-primary"></i>
                    {log}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TenantDashboard;
