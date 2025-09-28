import React from 'react';
import { TabLayout, type TabItem } from '../components/ui';
import { Clock, CheckCircle, FileText } from 'lucide-react';
import './WorkOrdersPage.scss';

// Placeholder content component for tabs
const PlaceholderContent: React.FC<{ 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  features?: string[];
}> = ({ title, description, icon, features = [] }) => (
  <div className="placeholder-content">
    <div className="placeholder-icon">
      {icon}
    </div>
    
    <h2 className="placeholder-title">{title}</h2>
    <p className="placeholder-description">
      {description}
    </p>
    
    {features.length > 0 && (
      <div className="features-card">
        <h4 className="features-title">Planned Features:</h4>
        <ul className="features-list">
          {features.map((feature, index) => (
            <li key={index} className="feature-item">
              <span className="feature-checkmark">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const WorkOrdersPage: React.FC = () => {
  const workOrderTabs: TabItem[] = [
    {
      label: 'Open Work Orders',
      content: (
        <PlaceholderContent
          title="Open Work Orders"
          description="Manage and track all active work orders. Monitor progress, assign resources, and ensure timely completion of maintenance tasks."
          icon={<Clock size={48} />}
          features={[
            'Real-time work order status tracking',
            'Priority-based task management',
            'Resource allocation and scheduling',
            'Progress monitoring and updates',
            'Technician assignment and notifications',
            'Mobile-friendly task management'
          ]}
        />
      )
    },
    {
      label: 'Closed Work Orders',
      content: (
        <PlaceholderContent
          title="Closed Work Orders"
          description="Review completed work orders, analyze performance metrics, and maintain comprehensive maintenance history records."
          icon={<CheckCircle size={48} />}
          features={[
            'Completion history and records',
            'Performance analytics and metrics',
            'Cost tracking and analysis',
            'Quality assurance reviews',
            'Maintenance history reports',
            'Compliance documentation'
          ]}
        />
      )
    },
    {
      label: 'All Work Orders',
      content: (
        <PlaceholderContent
          title="All Work Orders"
          description="Comprehensive view of all work orders across all statuses. Search, filter, and analyze your complete work order database."
          icon={<FileText size={48} />}
          features={[
            'Advanced search and filtering',
            'Comprehensive reporting dashboard',
            'Trend analysis and forecasting',
            'Export and data management',
            'Bulk operations and updates',
            'Custom views and saved searches'
          ]}
        />
      )
    }
  ];

  return (
    <div className="work-orders-page tabs-page">
      <TabLayout 
        tabs={workOrderTabs}
        variant="default"
        size="medium"
        onTabChange={(index) => {
          console.log('Work Orders tab changed to:', workOrderTabs[index].label);
        }}
      />
    </div>
  );
};

export default WorkOrdersPage;
