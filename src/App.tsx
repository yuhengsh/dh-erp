import React, { lazy, Suspense, createContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import MainLayout from './layouts/MainLayout';
import { TaskProvider } from './context/TaskContext';

// 定义应用上下文接口
export interface AppContextType {
  createPurchaseRequestFromInventory: (items: any[]) => void;
  purchaseRequestItems: any[];
}

// 创建应用上下文
export const AppContext = createContext<AppContextType>({
  createPurchaseRequestFromInventory: () => {},
  purchaseRequestItems: []
});

// Lazy load pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Materials = lazy(() => import('./pages/basicData/materials/Materials'));
const BOM = lazy(() => import('./pages/basicData/bom/BOM'));
const Settings = lazy(() => import('./pages/basicData/settings/Settings'));
const TaskCenter = lazy(() => import('./pages/taskCenter/TaskCenter'));
const Sales = lazy(() => import('./pages/sales/Sales'));
const Production = lazy(() => import('./pages/production/Production'));
const Procurement = lazy(() => import('./pages/procurement/Procurement'));
const Warehouse = lazy(() => import('./pages/warehouse/Warehouse'));
const TechDocs = lazy(() => import('./pages/techDocs/TechDocs'));
const Quality = lazy(() => import('./pages/quality/Quality'));
const Equipment = lazy(() => import('./pages/equipment/Equipment'));
const Finance = lazy(() => import('./pages/finance/Finance'));

// Loading component
const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <Spin size="large" />
  </div>
);

const App: React.FC = () => {
  const [purchaseRequestItems, setPurchaseRequestItems] = useState<any[]>([]);
  
  // 从仓库管理创建采购申请
  const createPurchaseRequestFromInventory = (items: any[]) => {
    setPurchaseRequestItems(items);
    
    // 将用户导航到采购管理页面
    // 由于我们使用的是React Router，我们不能直接导航
    // 但我们可以在Procurement组件中检测这个状态变化
    console.log('将创建采购申请，物料：', items);
    
    // 你可以使用window.location进行导航
    // 这不是最优雅的方式，但在这种情况下是有效的
    window.location.href = '/procurement';
  };
  
  const appContextValue: AppContextType = {
    createPurchaseRequestFromInventory,
    purchaseRequestItems
  };

  return (
    <ConfigProvider locale={zhCN} theme={{
      token: {
        colorPrimary: '#1890ff',
      },
    }}>
      <AppContext.Provider value={appContextValue}>
        <TaskProvider>
          <BrowserRouter>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Navigate to="/dashboard" />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="basicData">
                    <Route path="materials" element={<Materials />} />
                    <Route path="bom" element={<BOM />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                  <Route path="taskCenter" element={<TaskCenter />} />
                  <Route path="sales" element={<Sales />} />
                  <Route path="production" element={<Production />} />
                  <Route path="procurement" element={<Procurement />} />
                  <Route path="warehouse" element={<Warehouse />} />
                  <Route path="techDocs" element={<TechDocs />} />
                  <Route path="quality" element={<Quality />} />
                  <Route path="equipment" element={<Equipment />} />
                  <Route path="finance" element={<Finance />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TaskProvider>
      </AppContext.Provider>
    </ConfigProvider>
  );
}

export default App;
