import React, { useState } from 'react';
import {
  Table,
  Form,
  Input,
  TextArea,
  Dropdown,
  DatePicker,
  Switch,
  Radio,
  Checkbox,
  type TableColumn,
  type DropdownOption,
  type RadioOption,
  type CheckboxOption,
} from '../components';
import apiService from '../services/api';
import { TrendingUp, DollarSign, Package, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  isDarkMode?: boolean;
  count?: number;
  setCount?: (count: number | ((prev: number) => number)) => void;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const Dashboard: React.FC<DashboardProps> = ({ count = 0, setCount }) => {
  const [localCount, setLocalCount] = useState(0);
  
  // Use provided setCount or local state
  const currentCount = setCount ? count : localCount;
  const handleCountChange = setCount ? setCount : setLocalCount;

  // Sample data for the table
  const [userData] = useState<UserData[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@tenmil.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@tenmil.com',
      role: 'Editor',
      status: 'active',
      lastLogin: '2024-01-14T15:45:00',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@tenmil.com',
      role: 'Viewer',
      status: 'inactive',
      lastLogin: '2024-01-10T08:20:00',
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@tenmil.com',
      role: 'Editor',
      status: 'active',
      lastLogin: '2024-01-16T12:10:00',
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    country: '',
    birthDate: '',
    notifications: false,
    theme: 'light',
    preferences: [] as string[],
    terms: false,
  });

  // Table columns configuration
  const columns: TableColumn<UserData>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sortable: true,
      filterable: true,
      resizable: true,
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      sortable: true,
      filterable: true,
      resizable: true,
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      sortable: true,
      filterable: true,
      resizable: true,
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: value === 'active' ? '#10B981' : '#EF4444',
          color: 'white',
        }}>
          {value.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      title: 'Last Login',
      dataIndex: 'lastLogin',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  // Dropdown options
  const countryOptions: DropdownOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },
    { value: 'jp', label: 'Japan' },
  ];

  // Radio options
  const themeOptions: RadioOption[] = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' },
    { value: 'auto', label: 'Auto (System)' },
  ];

  // Checkbox options
  const preferenceOptions: CheckboxOption[] = [
    { value: 'email', label: 'Email Notifications' },
    { value: 'sms', label: 'SMS Notifications' },
    { value: 'push', label: 'Push Notifications' },
    { value: 'newsletter', label: 'Newsletter' },
  ];

  // Handle form submission
  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  const handleUpdate = () => {
    console.log('Form updated:', formData);
  };

  const handleCancel = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      bio: '',
      country: '',
      birthDate: '',
      notifications: false,
      theme: 'light',
      preferences: [],
      terms: false,
    });
  };

  const handleRowClick = (record: UserData) => {
    console.log('Row clicked:', record);
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Stats Cards */}
      <div className="stats-grid mb-lg" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5vmin' 
      }}>
        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1vmin' }}>
            <div className="stat-icon" style={{ 
              backgroundColor: 'rgba(34, 197, 94, 0.1)', 
              color: '#22c55e',
              padding: '1vmin',
              borderRadius: '0.5vmin'
            }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="text-lg font-semibold">$24,780</div>
              <div className="text-sm text-muted">Monthly Revenue</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1vmin' }}>
            <div className="stat-icon" style={{ 
              backgroundColor: 'rgba(59, 130, 246, 0.1)', 
              color: '#3b82f6',
              padding: '1vmin',
              borderRadius: '0.5vmin'
            }}>
              <Package size={24} />
            </div>
            <div>
              <div className="text-lg font-semibold">156</div>
              <div className="text-sm text-muted">Active Assets</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1vmin' }}>
            <div className="stat-icon" style={{ 
              backgroundColor: 'rgba(245, 158, 11, 0.1)', 
              color: '#f59e0b',
              padding: '1vmin',
              borderRadius: '0.5vmin'
            }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="text-lg font-semibold">12</div>
              <div className="text-sm text-muted">Pending Work Orders</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1vmin' }}>
            <div className="stat-icon" style={{ 
              backgroundColor: 'rgba(168, 85, 247, 0.1)', 
              color: '#a855f7',
              padding: '1vmin',
              borderRadius: '0.5vmin'
            }}>
              <DollarSign size={24} />
            </div>
            <div>
              <div className="text-lg font-semibold">$8,432</div>
              <div className="text-sm text-muted">Outstanding Invoices</div>
            </div>
          </div>
        </div>
      </div>

      {/* System Info Section */}
      <div className="card mb-lg">
        <div className="card-header">
          <h2>Tenmil Dashboard - UI Components Demo</h2>
        </div>
        <div className="card-body">
          <p>Your comprehensive maintenance management system with <strong>smart viewport scaling</strong>. 
          This dashboard now showcases our complete set of reusable UI components.</p>
          
          <div className="mt-lg mb-lg">
            <h4>Quick Actions</h4>
            <div className="mt-base gap-base" style={{ display: 'flex', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => handleCountChange((prev) => prev + 1)}
              >
                Interactive Counter: {currentCount}
              </button>
              <button className="btn btn-secondary">
                Create Work Order
              </button>
            </div>
          </div>

          <div className="mt-lg">
            <h4>System Information</h4>
            <p>Current subdomain: <span className="text-primary font-semibold">{apiService.getSubdomainType()}</span></p>
            <p>API Base URL: <code className="text-sm font-medium">{apiService.getBaseURL()}</code></p>
          </div>
        </div>
      </div>

      {/* Table Example */}
      <div className="mb-xl">
        <Table<UserData>
          title="User Management Table - Complete Example"
          columns={columns}
          dataSource={userData}
          rowKey="id"
          allowColumnResize={true}
          allowColumnReorder={true}
          allowFiltering={true}
          onRowClick={handleRowClick}
          pagination={{
            current: 1,
            pageSize: 10,
            total: userData.length,
            onChange: (page, pageSize) => console.log('Pagination:', page, pageSize),
          }}
        />
      </div>

      {/* Form Example */}
      <div className="mb-xl">
        <Form
          title="Complete Form Example - All Field Types"
          description="This form demonstrates all available field components with consistent styling and behavior. All fields marked with * are required."
          onSubmit={handleSubmit}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
          showSubmit={true}
          showUpdate={true}
          showCancel={true}
          submitText="Create Profile"
          updateText="Update Profile"
          cancelText="Reset Form"
        >
          {/* Text Inputs */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <Input
              label="First Name"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="Last Name"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              fullWidth
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            fullWidth
            helperText="We'll never share your email with anyone else."
          />

          {/* TextArea */}
          <TextArea
            label="Bio"
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            fullWidth
            minRows={4}
            helperText="Maximum 500 characters"
          />

          {/* Dropdown */}
          <Dropdown
            label="Country"
            placeholder="Select your country"
            options={countryOptions}
            value={formData.country}
            onChange={(value) => setFormData({ ...formData, country: value.toString() })}
            searchable
            fullWidth
            required
          />

          {/* Date Picker */}
          <DatePicker
            label="Birth Date"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            fullWidth
            helperText="Used for age verification"
          />

          {/* Switch */}
          <Switch
            label="Enable Notifications"
            checked={formData.notifications}
            onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
            helperText="Receive email notifications about account activity"
          />

          {/* Radio Buttons */}
          <Radio
            label="Theme Preference"
            options={themeOptions}
            value={formData.theme}
            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            orientation="horizontal"
            required
          />

          {/* Checkboxes */}
          <Checkbox
            label="Communication Preferences"
            options={preferenceOptions}
            orientation="vertical"
            helperText="Select all that apply"
          />

          {/* Terms Checkbox */}
          <Checkbox
            label="I agree to the Terms and Conditions"
            checked={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
            required
            color="success"
          />
        </Form>
      </div>
    </div>
  );
};

export default Dashboard;