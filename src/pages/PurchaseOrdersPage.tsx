import React from 'react';
import { TabLayout, type TabItem } from '../components/ui';
import { FileText, ShoppingCart, Users } from 'lucide-react';
import './PurchaseOrdersPage.scss';

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

const PurchaseOrdersPage: React.FC = () => {
  const purchaseOrderTabs: TabItem[] = [
    {
      label: 'Purchase Requests',
      content: (
        <PlaceholderContent
          title="Purchase Requests"
          description="Initiate and manage purchase requests with automated approval workflows. Streamline procurement processes from request to approval."
          icon={<FileText size={48} />}
          features={[
            'Digital purchase request forms',
            'Multi-level approval workflows',
            'Budget validation and controls',
            'Request tracking and notifications',
            'Vendor quote comparisons',
            'Compliance and audit trails'
          ]}
        />
      )
    },
    {
      label: 'Purchase Orders',
      content: (
        <PlaceholderContent
          title="Purchase Orders"
          description="Create, manage, and track purchase orders throughout their lifecycle. Monitor deliveries, payments, and vendor performance."
          icon={<ShoppingCart size={48} />}
          features={[
            'Digital purchase order generation',
            'Delivery tracking and management',
            'Invoice matching and validation',
            'Payment status monitoring',
            'Contract and pricing management',
            'Performance analytics and reporting'
          ]}
        />
      )
    },
    {
      label: 'Vendors',
      content: (
        <PlaceholderContent
          title="Vendor Management"
          description="Comprehensive vendor relationship management system. Track performance, manage contracts, and maintain supplier databases."
          icon={<Users size={48} />}
          features={[
            'Vendor profile and contact management',
            'Performance scoring and analytics',
            'Contract and agreement tracking',
            'Qualification and certification management',
            'Price comparison and negotiation tools',
            'Risk assessment and compliance monitoring'
          ]}
        />
      )
    }
  ];

  return (
    <div className="purchase-orders-page tabs-page">
      <TabLayout 
        tabs={purchaseOrderTabs}
        variant="default"
        size="medium"
        onTabChange={(index) => {
          console.log('Purchase Orders tab changed to:', purchaseOrderTabs[index].label);
        }}
      />
    </div>
  );
};

export default PurchaseOrdersPage;
