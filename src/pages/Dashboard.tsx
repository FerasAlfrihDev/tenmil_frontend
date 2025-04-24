import React from 'react';
import '../styles/pages.scss';
import { Card } from 'react-bootstrap';

const Dashboard: React.FC = () => {
    return (
        <>
            <div className="dashboard__cards">
                <Card style={{ width: '10rem' }}>
                    <Card.Body>                        
                        <Card.Text>
                            150
                        </Card.Text>
                        <Card.Title>Total Work Orders</Card.Title>
                    </Card.Body>
                </Card>
                <Card style={{ width: '10rem' }}>
                    <Card.Body>                        
                        <Card.Text>
                            50
                        </Card.Text>
                        <Card.Title>Open Work Orders</Card.Title>
                    </Card.Body>
                </Card>
                <Card style={{ width: '10rem' }}>
                    <Card.Body>                        
                        <Card.Text>
                            10
                        </Card.Text>
                        <Card.Title>Assets Under Maintenance</Card.Title>
                    </Card.Body>
                </Card>
                <Card style={{ width: '10rem' }}>
                    <Card.Body>                        
                        <Card.Text>
                            100
                        </Card.Text>
                        <Card.Title>Completed Tasks</Card.Title>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};

export default Dashboard;
