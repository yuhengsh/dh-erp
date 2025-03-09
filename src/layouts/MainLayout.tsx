import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, theme } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  DashboardOutlined,
  DatabaseOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  ToolOutlined,
  ShoppingOutlined,
  BankOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '大屏看板',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'basicData',
      icon: <DatabaseOutlined />,
      label: '基础资料',
      children: [
        {
          key: 'materials',
          label: '物料管理',
          onClick: () => navigate('/basicData/materials'),
        },
        {
          key: 'bom',
          label: 'BOM管理',
          onClick: () => navigate('/basicData/bom'),
        },
        {
          key: 'settings',
          label: '其他设置',
          onClick: () => navigate('/basicData/settings'),
        },
      ],
    },
    {
      key: 'taskCenter',
      icon: <TagsOutlined />,
      label: '任务中心',
      onClick: () => navigate('/taskCenter'),
    },
    {
      key: 'sales',
      icon: <ShoppingCartOutlined />,
      label: '销售管理',
      onClick: () => navigate('/sales'),
    },
    {
      key: 'production',
      icon: <ToolOutlined />,
      label: '生产管理',
      onClick: () => navigate('/production'),
    },
    {
      key: 'procurement',
      icon: <ShoppingOutlined />,
      label: '采购管理',
      onClick: () => navigate('/procurement'),
    },
    {
      key: 'warehouse',
      icon: <BankOutlined />,
      label: '仓库管理',
      onClick: () => navigate('/warehouse'),
    },
    {
      key: 'additionalModules',
      icon: <SettingOutlined />,
      label: '附加模块',
      children: [
        {
          key: 'techDocs',
          label: '技术文档管理',
          onClick: () => navigate('/techDocs'),
        },
        {
          key: 'quality',
          label: '质量管理',
          onClick: () => navigate('/quality'),
        },
        {
          key: 'equipment',
          label: '设备管理',
          onClick: () => navigate('/equipment'),
        },
        {
          key: 'finance',
          label: '财务管理集成',
          onClick: () => navigate('/finance'),
        },
      ],
    },
  ];

  const userMenu = {
    items: [
      {
        key: '1',
        label: '个人设置',
        icon: <UserOutlined />,
      },
      {
        key: '2',
        label: '退出登录',
        icon: <LogoutOutlined />,
      },
    ],
  };

  // Find selected keys based on current path
  const getSelectedKeys = () => {
    const path = location.pathname;
    const parts = path.split('/').filter(p => p);
    if (parts.length === 0) return ['dashboard'];
    
    if (parts.length === 1) return [parts[0]];
    
    if (parts[0] === 'basicData' || parts[0] === 'additionalModules') {
      return [parts[1]];
    }
    
    return [parts[0]];
  };
  
  const getOpenKeys = () => {
    const path = location.pathname;
    const parts = path.split('/').filter(p => p);
    
    if (parts.length > 1) {
      if (parts[0] === 'basicData' || parts[0] === 'additionalModules') {
        return [parts[0]];
      }
    }
    
    return [];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          zIndex: 999,
        }}
      >
        <div style={{ 
          height: '64px', 
          margin: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'flex-start' 
        }}>
          <img 
            src={process.env.PUBLIC_URL + '/logo192.png'}
            alt="东红船业" 
            style={{ height: '32px', marginRight: collapsed ? 0 : '16px' }} 
          />
          {!collapsed && <h1 style={{ margin: 0, fontSize: '18px' }}>东红船业 ERP</h1>}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          style={{ borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: 0, 
          background: token.colorBgContainer,
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ marginRight: '24px', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '12px' }}>欢迎，管理员</span>
            <Dropdown menu={userMenu} placement="bottomRight">
              <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 