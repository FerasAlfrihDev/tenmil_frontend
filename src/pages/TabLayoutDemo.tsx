import React from 'react';
import { TabLayout, type TabItem } from '../components/ui';

const TabLayoutDemo: React.FC = () => {
  const demoTabs: TabItem[] = [
    {
      label: 'Overview',
      content: (
        <div>
          <h2>Overview Content</h2>
          <p>This is the overview tab content. You can put any React component here.</p>
          <ul>
            <li>Feature 1: Responsive design with viewport scaling</li>
            <li>Feature 2: Multiple style variants (default, pills, underline)</li>
            <li>Feature 3: Customizable sizes (small, medium, large)</li>
            <li>Feature 4: Keyboard navigation support</li>
          </ul>
        </div>
      )
    },
    {
      label: 'Settings',
      content: (
        <div>
          <h2>Settings Panel</h2>
          <p>Configure your application settings here.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label>
              <input type="checkbox" /> Enable notifications
            </label>
            <label>
              <input type="checkbox" /> Auto-save changes
            </label>
            <label>
              Theme: 
              <select style={{ marginLeft: '0.5rem' }}>
                <option>Light</option>
                <option>Dark</option>
                <option>Auto</option>
              </select>
            </label>
          </div>
        </div>
      )
    },
    {
      label: 'Analytics',
      content: (
        <div>
          <h2>Analytics Dashboard</h2>
          <p>View your application analytics and metrics.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
              <h3>Total Users</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>1,234</p>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
              <h3>Page Views</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>45,678</p>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
              <h3>Conversion Rate</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>3.2%</p>
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'Help',
      disabled: false,
      content: (
        <div>
          <h2>Help & Support</h2>
          <p>Get help with using the TabLayout component.</p>
          <h3>Basic Usage:</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`import { TabLayout, type TabItem } from '../components/ui';

const tabs: TabItem[] = [
  {
    label: 'Tab 1',
    content: <div>Content for tab 1</div>
  },
  {
    label: 'Tab 2', 
    content: <div>Content for tab 2</div>
  }
];

<TabLayout 
  tabs={tabs}
  variant="default"
  size="medium"
  onTabChange={(index) => console.log('Tab changed:', index)}
/>`}
          </pre>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>TabLayout Component Demo</h1>
      <p>This demonstrates the reusable TabLayout component with different variants and content.</p>
      
      <div style={{ marginBottom: '3rem' }}>
        <h2>Default Variant</h2>
        <TabLayout 
          tabs={demoTabs}
          variant="default"
          size="medium"
          onTabChange={(index) => console.log('Default tab changed to:', index)}
        />
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2>Pills Variant</h2>
        <TabLayout 
          tabs={demoTabs.slice(0, 3)} // Show fewer tabs for variety
          variant="pills"
          size="medium"
          onTabChange={(index) => console.log('Pills tab changed to:', index)}
        />
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2>Underline Variant (Small Size)</h2>
        <TabLayout 
          tabs={demoTabs.slice(0, 2)} // Show even fewer tabs
          variant="underline"
          size="small"
          onTabChange={(index) => console.log('Underline tab changed to:', index)}
        />
      </div>

      <div>
        <h2>Large Size Variant</h2>
        <TabLayout 
          tabs={demoTabs}
          variant="default"
          size="large"
          onTabChange={(index) => console.log('Full width tab changed to:', index)}
        />
      </div>
    </div>
  );
};

export default TabLayoutDemo;
