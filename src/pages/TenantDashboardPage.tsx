
import '../styles/TenantDashboard.scss';

import React from 'react';
import { Card, Row, Col, Table, ProgressBar } from 'react-bootstrap';

const TenantDashboard: React.FC = () => {
  const recentActions:[string, string, number][] = [
    ['Pump A1', 'Online', 90],
    ['Boiler B3', 'Online', 75],
    ['Conveyor 9', 'Offline', 0],
  ]
  return (
    <div className="tenant-dashboard container py-4">
      {/* Header */}
      <h4 className="fw-bold mb-4 text-primary">Welcome to Tenmil Dashboard</h4>

      {/* Quick Stats */}
      <Row className="mb-4 g-4">
        {[
          { title: 'Open Work Orders', value: 12 },
          { title: 'Assets in Use', value: 34 },
          { title: 'Scheduled Maintenance', value: 5 },
          { title: 'Unassigned Tasks', value: 3 },
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
              <div className="chart-placeholder">[Chart Here]</div>
            </Card.Body>
          </Card>
        </Col>

        {/* Upcoming Tasks */}
        <Col md={6}>
          <Card className="shadow-sm h-100 hover-card">
            <Card.Body>
              <h6 className="text-muted small mb-3">Upcoming Maintenance</h6>
              <ul className="task-list">
                {[
                  'Check HVAC filters in Building A',
                  'Inspect generator oil level',
                  'Replace worn motor belts',
                ].map((task, index) => (
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
              <Table size="sm" responsive className="asset-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Status</th>
                    <th>Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActions.map(([name, status, percent], index) => (
                    <tr key={index}>
                      <td>{name}</td>
                      <td>
                        <span className={`badge bg-${status === 'Online' ? 'success' : 'danger'}`}>{status}</span>
                      </td>
                      <td>
                        <ProgressBar 
                          now={+percent} 
                          label={`${percent}%`} 
                          variant={percent > 0 ? 'success' : 'danger'}
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
                {[
                  'Ali logged in',
                  'Feras submitted Work Order #3312',
                  'Maintenance team completed Task #9981',
                ].map((log, index) => (
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
