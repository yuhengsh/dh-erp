import React from 'react';
import { Typography, Row, Col, Card, Statistic, Divider, Button } from 'antd';
import { 
  ArrowUpOutlined, 
  ShoppingCartOutlined,
  ShoppingOutlined,
  BankOutlined,
} from '@ant-design/icons';
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const { Title } = Typography;

interface ProductionStatus {
  status: string;
  count: number;
}

const Dashboard: React.FC = () => {
  // Mock data for charts
  const salesData = [
    { month: '1月', sales: 380 },
    { month: '2月', sales: 420 },
    { month: '3月', sales: 650 },
    { month: '4月', sales: 410 },
    { month: '5月', sales: 550 },
    { month: '6月', sales: 680 },
  ];

  const materialCategoryData = [
    { name: '原料', value: 45 },
    { name: '辅料', value: 25 },
    { name: '成品', value: 30 },
  ];

  const productionStatusData: ProductionStatus[] = [
    { status: '计划中', count: 12 },
    { status: '生产中', count: 8 },
    { status: '已完成', count: 22 },
    { status: '延期', count: 3 },
  ];

  // 颜色配置
  const COLORS = ['#1890ff', '#52c41a', '#722ed1', '#f5222d'];
  const PIE_COLORS = ['#1890ff', '#13c2c2', '#722ed1'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>东红船业 - 运营驾驶舱</Title>
        <div>
          <Button type="primary" style={{ marginRight: 16 }}>今日数据</Button>
          <Button>本周</Button>
        </div>
      </div>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="本月销售额"
              value={680000}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="¥"
              suffix={<ArrowUpOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <span>较上月: </span>
              <span style={{ color: '#3f8600' }}>↑ 12%</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="库存物料数量"
              value={1280}
              valueStyle={{ color: '#1890ff' }}
              prefix={<BankOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <span>需补充物料: </span>
              <span style={{ color: '#f5222d' }}>23 种</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待处理采购订单"
              value={35}
              valueStyle={{ color: '#faad14' }}
              prefix={<ShoppingOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <span>逾期订单: </span>
              <span style={{ color: '#f5222d' }}>5 笔</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="未完成销售订单"
              value={8}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <span>本月新增: </span>
              <span style={{ color: '#3f8600' }}>↑ 3 笔</span>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Divider />
      
      <Row gutter={[16, 16]}>
        <Col span={24} lg={12}>
          <Card title="销售趋势 (近6个月)">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" name="销售额" fill="#1890ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col span={24} lg={12}>
          <Card title="物料类别分布">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={materialCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {materialCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="生产订单状态">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={productionStatusData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="订单数量">
                    {productionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 