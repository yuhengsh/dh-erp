import React from 'react';
import { Typography, Card, Tabs, List, Badge, Avatar, Tag, Space, Button } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  BellOutlined,
} from '@ant-design/icons';

const { Title } = Typography;
const { TabPane } = Tabs;

const TaskCenter: React.FC = () => {
  // Mock data for tasks
  const pendingTasks = [
    {
      id: '1',
      title: '采购申请审核',
      description: '需要审核来自生产部门的原材料采购申请',
      department: '采购部',
      priority: '高',
      createdAt: '2023-09-15 09:30',
    },
    {
      id: '2',
      title: '销售订单确认',
      description: '新客户订单需要确认交期和价格',
      department: '销售部',
      priority: '高',
      createdAt: '2023-09-15 10:15',
    },
    {
      id: '3',
      title: '物料入库待检',
      description: '钢板已到货，需要进行质量检验',
      department: '质检部',
      priority: '中',
      createdAt: '2023-09-14 16:45',
    },
    {
      id: '4',
      title: '生产计划审核',
      description: '下周生产计划需要审批',
      department: '生产部',
      priority: '中',
      createdAt: '2023-09-14 14:30',
    },
  ];

  const completedTasks = [
    {
      id: '5',
      title: '采购订单确认',
      description: '确认焊条采购订单',
      department: '采购部',
      completedAt: '2023-09-13 15:20',
    },
    {
      id: '6',
      title: '销售报价审核',
      description: '审核国际客户销售报价',
      department: '销售部',
      completedAt: '2023-09-12 11:45',
    },
  ];

  const notifications = [
    {
      id: '1',
      title: '物料库存不足提醒',
      description: '5种物料低于安全库存，需要及时补充',
      time: '2023-09-15 08:30',
      type: 'warning',
    },
    {
      id: '2',
      title: '生产任务已完成',
      description: '订单SL-2023-089的生产任务已完成，等待质检',
      time: '2023-09-14 16:20',
      type: 'success',
    },
    {
      id: '3',
      title: '系统维护通知',
      description: '系统将于本周日进行例行维护，请提前做好工作安排',
      time: '2023-09-13 10:00',
      type: 'info',
    },
  ];

  return (
    <div>
      <Title level={2}>任务中心</Title>
      
      <Tabs defaultActiveKey="1">
        <TabPane 
          tab={
            <span>
              <ClockCircleOutlined />
              待办任务
              <Badge count={pendingTasks.length} style={{ marginLeft: 8 }} />
            </span>
          } 
          key="1"
        >
          <Card>
            <List
              itemLayout="horizontal"
              dataSource={pendingTasks}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" key="process">处理</Button>,
                    <Button type="link" key="transfer">转交</Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          backgroundColor: 
                            item.priority === '高' ? '#f5222d' : 
                            item.priority === '中' ? '#faad14' : '#52c41a' 
                        }}
                      >
                        {item.department.charAt(0)}
                      </Avatar>
                    }
                    title={
                      <Space>
                        {item.title}
                        <Tag 
                          color={
                            item.priority === '高' ? 'error' : 
                            item.priority === '中' ? 'warning' : 'success'
                          }
                        >
                          {item.priority}优先级
                        </Tag>
                      </Space>
                    }
                    description={
                      <>
                        <div>{item.description}</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                          来源: {item.department} · 创建时间: {item.createdAt}
                        </div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <CheckCircleOutlined />
              已完成任务
            </span>
          } 
          key="2"
        >
          <Card>
            <List
              itemLayout="horizontal"
              dataSource={completedTasks}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" key="view">查看详情</Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: '#52c41a' }}>
                        {item.department.charAt(0)}
                      </Avatar>
                    }
                    title={item.title}
                    description={
                      <>
                        <div>{item.description}</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                          来源: {item.department} · 完成时间: {item.completedAt}
                        </div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <BellOutlined />
              通知
              <Badge count={notifications.length} style={{ marginLeft: 8 }} />
            </span>
          } 
          key="3"
        >
          <Card>
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" key="read">标记为已读</Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          backgroundColor: 
                            item.type === 'warning' ? '#faad14' : 
                            item.type === 'success' ? '#52c41a' : '#1890ff' 
                        }}
                        icon={
                          item.type === 'warning' ? <WarningOutlined /> : 
                          item.type === 'success' ? <CheckCircleOutlined /> : <BellOutlined />
                        }
                      />
                    }
                    title={item.title}
                    description={
                      <>
                        <div>{item.description}</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                          时间: {item.time}
                        </div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TaskCenter; 