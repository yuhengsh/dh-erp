import React from 'react';
import { Typography, Card, Button, Space, Alert } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <div>
      <Title level={2}>{title}</Title>
      <Card>
        <Alert
          message="模块开发中"
          description={description || `${title}功能正在开发中，敬请期待。`}
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />
        <div style={{ display: 'flex', justifyContent: 'center', padding: '30px 0' }}>
          <Space direction="vertical" align="center">
            <ToolOutlined style={{ fontSize: 64, color: '#1890ff' }} />
            <Title level={4}>即将推出</Title>
            <p>我们正在努力为您构建此功能模块</p>
            <Button type="primary">了解开发计划</Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default PlaceholderPage; 