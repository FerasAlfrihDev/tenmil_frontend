import React from 'react';
import Sidebar from './layouts/Sidebar';
import Header from './layouts/Header';
import { BrowserRouter, Routes, Route } from "react-router";
import { 
  AssetDetails,
  Assets,
  CategoryDetails,
  Companies,
  CompanyDetails,
  Dashboard,
  LocationDetails,
  Login,
  NewAsset,
  NewCategory,
  NewCompany,
  NewLocation,
  NewSite,
  NewWorkOrder,
  Register,
  Settings,
  SiteDetails,
  Sites, 
  WorkOrderDetails, 
  WorkOrderLogsForm, 
  WorkOrders
} from './pages';
import { Col, Container, Row } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/pages.scss"
import "./styles/global.scss"
import { WorkOrderLogsTab } from './pages/WorkOrders/WorkOrderDetailsTabs/WorkOrderLogs';
import { WorkOrderChicklistTab } from './pages/WorkOrders/WorkOrderDetailsTabs/WorkOrderChecklistTab';
import WorkOrderChecklistForm from './pages/WorkOrders/WorkOrderDetailsTabs/WorkOrderChecklistForm';
import WorkOrderChecklistNew from './pages/WorkOrders/WorkOrderDetailsTabs/WorkOrderChecklistNew';
import NewWorkOrderStatus from './pages/Settings/WorkOrderTables/NewWorkOrderStatus';
import { MiscCostsTab } from './pages/WorkOrders/WorkOrderDetailsTabs/MiscCostTab';
import MiscCostTabDetails from './pages/WorkOrders/WorkOrderDetailsTabs/MiscCostTabDetails';
import MiscCostTabNew from './pages/WorkOrders/WorkOrderDetailsTabs/MiscCostTabNew';


const App: React.FC = () => {
  return (
    <Container className='root-container'>
      <Row>
        <Header />
      </Row>      
      <Row>
        <Col xs={1}>
          <Sidebar />
        </Col>
        <Col className='main-content'>
          <BrowserRouter>
            <Routes>
              {/* system pathes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* admin pathes */}
              <Route path="/company" element={<Companies />} />
              <Route path="/company/new" element={<NewCompany />} />
              <Route path="/company/:id" element={<CompanyDetails />} />


              {/* user pathes */}
              <Route path="/" element={<Dashboard />} />
              
              <Route path="/assets" element={<Assets />} />
              <Route path="/assets/new" element={<NewAsset />} />
              <Route path="/assets/:id" element={<AssetDetails />} />
              
              <Route path="/work-orders" element={<WorkOrders />} />
              <Route path="/work-orders/new" element={<NewWorkOrder />} />
              <Route path="/work-orders/:id" element={<WorkOrderDetails />} />
              <Route path="/work-orders/:workOrderId/work-order-logs" element={<WorkOrderLogsTab />} />
              <Route path="/work-orders/:workOrderId/work-order-logs/:id" element={<WorkOrderLogsForm />} />
              <Route path="/work-orders/:workOrderId/work-order-checklist" element={<WorkOrderChicklistTab />} />
              <Route path="/work-orders/:workOrderId/work-order-checklist/new" element={<WorkOrderChecklistNew />} />
              <Route path="/work-orders/:workOrderId/work-order-checklist/:id" element={<WorkOrderChecklistForm />} />
              <Route path="/work-orders/:workOrderId/work-order-misc-cost" element={<MiscCostsTab />} />
              <Route path="/work-orders/:workOrderId/work-order-misc-cost/new" element={<MiscCostTabNew />} />
              <Route path="/work-orders/:workOrderId/work-order-misc-cost/:id" element={<MiscCostTabDetails />} />


              <Route path="/settings" element={<Settings />} />
              
              <Route path="settings/sites" element={<Sites />} />
              <Route path="settings/sites/new" element={<NewSite />} />
              <Route path="settings/sites/:id" element={<SiteDetails />} />
              <Route path="settings/locations/new" element={<NewLocation />} />
              <Route path="settings/locations/:id" element={<LocationDetails />} />

              <Route path="settings/category/new" element={<NewCategory />} />
              <Route path="settings/category/:id" element={<CategoryDetails />} />

              <Route path="settings/work-order-status/new" element={<NewWorkOrderStatus />} />
              <Route path="settings/work-order-status/:id" element={<CategoryDetails />} />



              

            </Routes>
          </BrowserRouter>
        </Col>
      </Row>      
      <Row>
        <Col></Col>
      </Row>
    </Container>
    
  );
};

export default App;