import React from 'react';
import { TabLayout, type TabItem } from '../components/ui';
import { Send, Truck, Wrench } from 'lucide-react';
import './PartsPage.scss';

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

const PartsPage: React.FC = () => {
  const partsTabs: TabItem[] = [
    {
      label: 'Warehouse Requests',
      content: (
        <PlaceholderContent
          title="Warehouse Requests"
          description="Manage and track warehouse requests for parts and supplies. Streamline the requisition process with automated approvals and inventory allocation."
          icon={<Send size={48} />}
          features={[
            'Digital requisition forms',
            'Automated approval workflows',
            'Real-time request tracking',
            'Priority-based processing',
            'Budget and cost control',
            'Request history and analytics'
          ]}
        />
      )
    },
    {
      label: 'Warehouse Receiving',
      content: (
        <PlaceholderContent
          title="Warehouse Receiving"
          description="Efficiently manage incoming shipments and inventory receiving processes. Track deliveries, verify quantities, and update inventory levels automatically."
          icon={<Truck size={48} />}
          features={[
            'Shipment tracking and notifications',
            'Quality inspection workflows',
            'Automated inventory updates',
            'Discrepancy reporting',
            'Barcode scanning integration',
            'Vendor performance tracking'
          ]}
        />
      )
    },
    {
      label: 'Parts',
      content: (
        <PlaceholderContent
          title="Parts Inventory"
          description="Comprehensive parts inventory management system. Track stock levels, manage reorder points, and ensure critical components are always available."
          icon={<Wrench size={48} />}
          features={[
            'Real-time inventory tracking',
            'Automated reorder notifications',
            'Parts categorization and search',
            'Usage analytics and forecasting',
            'Supplier and pricing management',
            'Equipment compatibility tracking'
          ]}
        />
      )
    }
  ];

  return (
    <div className="parts-page tabs-page">
      <TabLayout 
        tabs={partsTabs}
        variant="default"
        size="medium"
        onTabChange={(index) => {
          console.log('Parts tab changed to:', partsTabs[index].label);
        }}
      />
    </div>
  );
};

export default PartsPage;
