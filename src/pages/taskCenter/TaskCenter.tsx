import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Tabs, 
  List, 
  Badge, 
  Avatar, 
  Tag, 
  Space, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Descriptions, 
  message,
  Divider,
  Empty
} from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  BellOutlined,
  UserOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTaskContext, Task, Notification } from '../../context/TaskContext';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const TaskCenter: React.FC = () => {
  // 导航
  const navigate = useNavigate();
  const location = useLocation();
  
  // 使用全局任务上下文
  const { 
    pendingTasks, 
    completedTasks, 
    notifications,
    completeTask,
    transferTask,
    markNotificationAsRead
  } = useTaskContext();
  
  // 任务详情模态框状态
  const [taskDetailVisible, setTaskDetailVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // 任务处理模态框状态
  const [processTaskVisible, setProcessTaskVisible] = useState(false);
  const [processForm] = Form.useForm();
  
  // 任务转交模态框状态
  const [transferTaskVisible, setTransferTaskVisible] = useState(false);
  const [transferForm] = Form.useForm();
  
  // 查看任务详情
  const handleViewTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailVisible(true);
  };
  
  // 处理任务
  const handleProcessTask = (task: Task) => {
    setSelectedTask(task);
    
    processForm.resetFields();
    processForm.setFieldsValue({
      taskId: task.id,
      taskTitle: task.title,
      result: '',
      remarks: ''
    });
    
    setProcessTaskVisible(true);
  };
  
  // 提交任务处理
  const handleSubmitProcess = () => {
    processForm.validateFields().then(values => {
      // 实际项目中应该调用API处理任务
      console.log('处理任务:', values);
      
      // 使用全局上下文标记任务为已完成
      if (selectedTask) {
        completeTask(selectedTask.id, values.result, values.remarks);
        
        message.success('任务处理成功！');
        setProcessTaskVisible(false);
        
        // 根据任务类型导航到相应模块
        handleNavigateByTaskType(selectedTask);
      }
    });
  };
  
  // 转交任务
  const handleTransferTask = (task: Task) => {
    setSelectedTask(task);
    
    transferForm.resetFields();
    transferForm.setFieldsValue({
      taskId: task.id,
      taskTitle: task.title,
      transferTo: '',
      reason: ''
    });
    
    setTransferTaskVisible(true);
  };
  
  // 提交任务转交
  const handleSubmitTransfer = () => {
    transferForm.validateFields().then(values => {
      // 实际项目中应该调用API转交任务
      console.log('转交任务:', values);
      
      // 使用全局上下文转交任务
      if (selectedTask) {
        transferTask(selectedTask.id, values.transferTo, values.reason);
        
        message.success(`任务已成功转交给 ${values.transferTo}！`);
        setTransferTaskVisible(false);
      }
    });
  };
  
  // 标记通知为已读
  const handleMarkAsRead = (notification: Notification) => {
    // 使用全局上下文标记通知为已读
    markNotificationAsRead(notification.id);
    message.success('已标记为已读');
  };
  
  // 通过任务类型导航到相应模块并处理特定任务
  const handleNavigateByTaskType = (task: Task) => {
    // 构建导航参数
    const queryParams = new URLSearchParams();
    
    // 添加操作类型参数
    queryParams.append('action', 'process');
    
    // 添加关联ID
    if (task.relatedId) {
      queryParams.append('id', task.relatedId);
    }
    
    // 根据任务类型决定导航路径和附加参数
    switch (task.type) {
      case 'purchase_request':
        // 采购申请处理
        queryParams.append('tab', 'requests');
        if (task.title.includes('审核')) {
          // 如果是审核任务，添加审核参数
          queryParams.append('mode', 'approval');
        }
        navigate(`/procurement?${queryParams.toString()}`);
        break;
        
      case 'purchase_order':
        // 采购订单处理
        queryParams.append('tab', 'orders');
        navigate(`/procurement?${queryParams.toString()}`);
        break;
        
      case 'sales_order':
        // 销售订单处理
        queryParams.append('tab', 'orders');
        navigate(`/sales?${queryParams.toString()}`);
        break;
        
      case 'sales_quotation':
        // 销售报价处理
        queryParams.append('tab', 'quotations');
        navigate(`/sales?${queryParams.toString()}`);
        break;
        
      case 'stock_in':
        // 入库处理
        queryParams.append('tab', 'stockIn');
        navigate(`/warehouse?${queryParams.toString()}`);
        break;
        
      case 'production_plan':
        // 生产计划处理
        queryParams.append('tab', 'plans');
        navigate(`/production?${queryParams.toString()}`);
        break;
        
      default:
        // 默认只导航到模块首页
        const path = task.type.split('_')[0];
        navigate(`/${path}`);
    }
  };
  
  // 获取未读通知数量
  const getUnreadNotificationCount = () => {
    return notifications.filter(item => !item.read).length;
  };
  
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
            {pendingTasks.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={pendingTasks}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button 
                        type="link" 
                        key="process" 
                        onClick={() => handleProcessTask(item)}
                        icon={<CheckOutlined />}
                      >
                        处理
                      </Button>,
                      <Button 
                        type="link" 
                        key="transfer" 
                        onClick={() => handleTransferTask(item)}
                        icon={<ArrowRightOutlined />}
                      >
                        转交
                      </Button>,
                      <Button 
                        type="link" 
                        key="view" 
                        onClick={() => handleViewTaskDetail(item)}
                        icon={<FileTextOutlined />}
                      >
                        详情
                      </Button>,
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
                            来源: {item.department} · 创建时间: {item.createdAt} · 单号: {item.relatedId}
                          </div>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="没有待办任务" />
            )}
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
            {completedTasks.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={completedTasks}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button 
                        type="link" 
                        key="view" 
                        onClick={() => handleViewTaskDetail(item)}
                        icon={<FileTextOutlined />}
                      >
                        查看详情
                      </Button>,
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
                            来源: {item.department} · 完成时间: {item.completedAt} · 单号: {item.relatedId}
                          </div>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="没有已完成任务" />
            )}
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <BellOutlined />
              通知
              <Badge count={getUnreadNotificationCount()} style={{ marginLeft: 8 }} />
            </span>
          } 
          key="3"
        >
          <Card>
            {notifications.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={notifications}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      !item.read && (
                        <Button 
                          type="link" 
                          key="read" 
                          onClick={() => handleMarkAsRead(item)}
                        >
                          标记为已读
                        </Button>
                      ),
                      <Button 
                        type="link" 
                        key="viewDetail" 
                        onClick={() => {
                          // 根据通知类型导航到相关页面
                          switch (item.relatedType) {
                            case 'inventory':
                              navigate('/warehouse');
                              break;
                            case 'production':
                              navigate('/production');
                              break;
                            // 其他情况
                          }
                        }}
                      >
                        查看详情
                      </Button>
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
                      title={
                        <Space>
                          {item.title}
                          {item.read && <Tag color="default">已读</Tag>}
                        </Space>
                      }
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
            ) : (
              <Empty description="没有通知" />
            )}
          </Card>
        </TabPane>
      </Tabs>
      
      {/* 任务详情模态框 */}
      <Modal
        title="任务详情"
        open={taskDetailVisible}
        onCancel={() => setTaskDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setTaskDetailVisible(false)}>关闭</Button>,
          <Button 
            key="goto" 
            type="primary" 
            onClick={() => {
              setTaskDetailVisible(false);
              if (selectedTask) {
                handleNavigateByTaskType(selectedTask);
              }
            }}
          >
            直接处理
          </Button>
        ]}
      >
        {selectedTask && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="任务标题" span={2}>{selectedTask.title}</Descriptions.Item>
            <Descriptions.Item label="任务描述" span={2}>{selectedTask.description}</Descriptions.Item>
            <Descriptions.Item label="来源部门">{selectedTask.department}</Descriptions.Item>
            <Descriptions.Item label="相关单号">{selectedTask.relatedId}</Descriptions.Item>
            {selectedTask.priority && (
              <Descriptions.Item label="优先级">
                <Tag 
                  color={
                    selectedTask.priority === '高' ? 'error' : 
                    selectedTask.priority === '中' ? 'warning' : 'success'
                  }
                >
                  {selectedTask.priority}
                </Tag>
              </Descriptions.Item>
            )}
            {selectedTask.createdAt && (
              <Descriptions.Item label="创建时间">{selectedTask.createdAt}</Descriptions.Item>
            )}
            {selectedTask.completedAt && (
              <Descriptions.Item label="完成时间">{selectedTask.completedAt}</Descriptions.Item>
            )}
            {selectedTask.result && (
              <Descriptions.Item label="处理结果" span={2}>{selectedTask.result}</Descriptions.Item>
            )}
            {selectedTask.remarks && (
              <Descriptions.Item label="备注" span={2}>{selectedTask.remarks}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
      
      {/* 处理任务模态框 */}
      <Modal
        title="处理任务"
        open={processTaskVisible}
        onCancel={() => setProcessTaskVisible(false)}
        onOk={handleSubmitProcess}
        okText="提交"
        cancelText="取消"
      >
        <Form
          form={processForm}
          layout="vertical"
        >
          <Form.Item name="taskId" hidden>
            <Input />
          </Form.Item>
          
          <Form.Item label="任务" name="taskTitle">
            <Input disabled />
          </Form.Item>
          
          <Form.Item 
            label="处理结果" 
            name="result"
            rules={[{ required: true, message: '请选择处理结果' }]}
          >
            <Select placeholder="请选择处理结果">
              <Option value="approved">通过</Option>
              <Option value="rejected">驳回</Option>
              <Option value="completed">已完成</Option>
              <Option value="needModification">需要修改</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="备注" name="remarks">
            <TextArea rows={4} placeholder="请输入处理意见或备注..." />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 转交任务模态框 */}
      <Modal
        title="转交任务"
        open={transferTaskVisible}
        onCancel={() => setTransferTaskVisible(false)}
        onOk={handleSubmitTransfer}
        okText="确认转交"
        cancelText="取消"
      >
        <Form
          form={transferForm}
          layout="vertical"
        >
          <Form.Item name="taskId" hidden>
            <Input />
          </Form.Item>
          
          <Form.Item label="任务" name="taskTitle">
            <Input disabled />
          </Form.Item>
          
          <Form.Item 
            label="转交给" 
            name="transferTo"
            rules={[{ required: true, message: '请选择转交人员' }]}
          >
            <Select placeholder="请选择转交人员">
              <Option value="zhangsan">张三 (采购部)</Option>
              <Option value="lisi">李四 (销售部)</Option>
              <Option value="wangwu">王五 (生产部)</Option>
              <Option value="zhaoliu">赵六 (财务部)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="转交原因" name="reason">
            <TextArea rows={3} placeholder="请输入转交原因..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskCenter; 