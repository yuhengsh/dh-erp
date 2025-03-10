import React, { useState, useEffect, useContext } from 'react';
import {
  Tabs,
  Card,
  Typography,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Select,
  Badge,
  Tooltip,
  Statistic,
  Row,
  Col,
  DatePicker,
  Form,
  Drawer,
  InputNumber,
  Divider,
  message,
  Modal,
  Descriptions,
  Checkbox,
  List
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  ExportOutlined,
  PrinterOutlined,
  ReloadOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  SwapOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { AppContext } from '../../App';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 采购申请接口
interface PurchaseRequest {
  id: string;
  requestCode: string;
  requestType: string;
  requestDate: string;
  requester: string;
  department: string;
  status: string;
  priority: string;
  totalItems: number;
  totalAmount: number;
  approver: string;
  approveDate: string;
  remarks: string;
}

// 采购订单接口
interface PurchaseOrder {
  id: string;
  orderCode: string;
  orderDate: string;
  supplier: string;
  totalAmount: number;
  currency: string;
  status: string;
  paymentTerms: string;
  deliveryDate: string;
  buyer: string;
  totalItems: number;
  approver: string;
  approveDate: string;
  remarks: string;
}

// 供应商接口
interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  contactPhone: string;
  email: string;
  address: string;
  category: string;
  level: string;
  status: string;
  cooperationStartDate: string;
  lastOrderDate: string;
  totalOrders: number;
  remarks: string;
}

// 添加采购申请物料项接口
interface PurchaseRequestItem {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  specification: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  expectedDeliveryDate: string;
  remarks: string;
}

const Procurement: React.FC = () => {
  // 获取导航和位置信息
  const navigate = useNavigate();
  const location = useLocation();
  
  // 标签状态
  const [activeTab, setActiveTab] = useState('1');
  
  // 搜索状态
  const [purchaseRequestSearchText, setPurchaseRequestSearchText] = useState('');
  const [purchaseOrderSearchText, setPurchaseOrderSearchText] = useState('');
  const [supplierSearchText, setSupplierSearchText] = useState('');
  
  // 在状态变量部分添加
  const [createPurchaseRequestDrawerVisible, setCreatePurchaseRequestDrawerVisible] = useState(false);
  const [createPurchaseRequestForm] = Form.useForm();
  const [purchaseRequestItems, setPurchaseRequestItems] = useState<PurchaseRequestItem[]>([]);
  
  // 模拟数据 - 采购申请
  const [mockPurchaseRequests] = useState<PurchaseRequest[]>([
    {
      id: '1',
      requestCode: 'PR-2023-001',
      requestType: '常规采购',
      requestDate: '2023-03-15',
      requester: '张工',
      department: '生产部',
      status: '已审批',
      priority: '普通',
      totalItems: 5,
      totalAmount: 12500.00,
      approver: '李经理',
      approveDate: '2023-03-16',
      remarks: '生产所需原料'
    },
    {
      id: '2',
      requestCode: 'PR-2023-002',
      requestType: '紧急采购',
      requestDate: '2023-03-18',
      requester: '王工',
      department: '工程部',
      status: '待审批',
      priority: '紧急',
      totalItems: 2,
      totalAmount: 8000.00,
      approver: '',
      approveDate: '',
      remarks: '工程急需材料'
    },
    {
      id: '3',
      requestCode: 'PR-2023-003',
      requestType: '常规采购',
      requestDate: '2023-03-20',
      requester: '刘工',
      department: '维修部',
      status: '已转单',
      priority: '普通',
      totalItems: 8,
      totalAmount: 15600.00,
      approver: '李经理',
      approveDate: '2023-03-21',
      remarks: '设备维修用料'
    }
  ]);
  
  // 添加状态筛选状态和应用筛选函数
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  // 应用筛选函数
  const applyFilters = () => {
    // 清空搜索文本，使用筛选条件
    setPurchaseRequestSearchText('');
  };

  // 修改过滤后的采购申请数据计算逻辑
  const filteredPurchaseRequests = mockPurchaseRequests.filter(item => {
    // 先检查文本匹配
    const textMatch = purchaseRequestSearchText ? (
      item.requestCode.toLowerCase().includes(purchaseRequestSearchText.toLowerCase()) ||
      item.requester.toLowerCase().includes(purchaseRequestSearchText.toLowerCase()) ||
      item.department.toLowerCase().includes(purchaseRequestSearchText.toLowerCase())
    ) : true;
    
    // 再检查状态筛选
    const statusMatch = statusFilter ? item.status === statusFilter : true;
    
    // 再检查优先级筛选
    const priorityMatch = priorityFilter ? item.priority === priorityFilter : true;
    
    // 所有条件都要匹配
    return textMatch && statusMatch && priorityMatch;
  });

  // 采购申请列定义
  const purchaseRequestColumns: ColumnsType<PurchaseRequest> = [
    {
      title: '申请单号',
      dataIndex: 'requestCode',
      key: 'requestCode',
      sorter: (a, b) => a.requestCode.localeCompare(b.requestCode),
    },
    {
      title: '申请类型',
      dataIndex: 'requestType',
      key: 'requestType',
    },
    {
      title: '申请日期',
      dataIndex: 'requestDate',
      key: 'requestDate',
      sorter: (a, b) => a.requestDate.localeCompare(b.requestDate),
    },
    {
      title: '申请人',
      dataIndex: 'requester',
      key: 'requester',
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let color = 'default';
        if (text === '已审批') color = 'green';
        if (text === '待审批') color = 'orange';
        if (text === '已转单') color = 'blue';
        if (text === '已驳回') color = 'red';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (text) => {
        let color = 'default';
        if (text === '紧急') color = 'red';
        if (text === '高') color = 'orange';
        if (text === '普通') color = 'blue';
        if (text === '低') color = 'default';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '物料数',
      dataIndex: 'totalItems',
      key: 'totalItems',
    },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value) => `¥${value.toFixed(2)}`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewRequestDetail(record)}
          >
            查看
          </Button>
          {record.status === '待审批' && (
            <>
              <Button 
                type="link" 
                size="small" 
                icon={<CheckCircleOutlined />} 
                style={{ color: 'green' }}
                onClick={() => handleOpenApproval(record, true)}
              >
                审批
              </Button>
              <Button 
                type="link" 
                size="small" 
                icon={<CloseCircleOutlined />} 
                danger
                onClick={() => handleOpenApproval(record, false)}
              >
                驳回
              </Button>
            </>
          )}
          {record.status === '已审批' && (
            <Button 
              type="link" 
              size="small" 
              icon={<ShoppingOutlined />} 
              style={{ color: 'blue' }}
              onClick={() => handleOpenConvertToPO(record)}
            >
              转采购
            </Button>
          )}
          {(record.status === '待审批') && (
            <Button 
              type="link" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedRequest(record);
                // 实际项目中应该加载此记录的数据到编辑表单
                message.info('编辑功能开发中...');
              }}
            >
              编辑
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 获取App上下文
  const appContext = useContext(AppContext);
  
  // 当从仓库管理模块传递物料数据时自动打开采购申请创建
  useEffect(() => {
    if (appContext.purchaseRequestItems && appContext.purchaseRequestItems.length > 0) {
      // 设置默认表单值
      createPurchaseRequestForm.setFieldsValue({
        requestType: '常规采购',
        requestDate: dayjs(),
        priority: '普通',
        requester: '当前用户',
        department: '仓库部',
        status: '草稿',
      });
      
      // 设置物料
      setPurchaseRequestItems(appContext.purchaseRequestItems);
      
      // 打开抽屉
      setCreatePurchaseRequestDrawerVisible(true);
    }
  }, [appContext.purchaseRequestItems]);

  // 添加处理新建采购申请的函数
  const handleCreatePurchaseRequest = () => {
    // 重置表单
    createPurchaseRequestForm.resetFields();
    
    // 设置默认值
    createPurchaseRequestForm.setFieldsValue({
      requestType: '常规采购',
      requestDate: dayjs(),
      priority: '普通',
      requester: '当前用户',
      department: '仓库部',
      status: '草稿',
    });
    
    // 清空物料列表
    setPurchaseRequestItems([]);
    
    // 打开抽屉
    setCreatePurchaseRequestDrawerVisible(true);
  };

  // 添加处理提交采购申请的函数
  const handleSubmitPurchaseRequest = () => {
    createPurchaseRequestForm.validateFields().then(values => {
      // 验证物料列表不能为空
      if (purchaseRequestItems.length === 0) {
        message.error('请至少添加一项物料');
        return;
      }
      
      // 计算总金额
      const totalAmount = purchaseRequestItems.reduce((sum, item) => sum + item.totalAmount, 0);
      
      // 构建新的采购申请
      const newRequest: PurchaseRequest = {
        id: `${Date.now()}`, // 使用时间戳作为临时ID
        requestCode: `PR-${dayjs().format('YYYYMMDD')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        requestType: values.requestType,
        requestDate: dayjs(values.requestDate).format('YYYY-MM-DD'),
        requester: values.requester,
        department: values.department,
        status: '待审批',
        priority: values.priority,
        totalItems: purchaseRequestItems.length,
        totalAmount: totalAmount,
        approver: '',
        approveDate: '',
        remarks: values.remarks || '',
      };
      
      // 在实际应用中，这里应该调用API保存数据
      console.log('新创建的采购申请:', newRequest);
      console.log('申请物料明细:', purchaseRequestItems);
      
      // 模拟保存成功
      message.success('采购申请创建成功！');
      
      // 关闭抽屉
      setCreatePurchaseRequestDrawerVisible(false);
      
      // 刷新列表（这里简单模拟，实际应用应该重新获取数据）
      // setMockPurchaseRequests(prev => [newRequest, ...prev]);
    });
  };

  // 添加处理添加物料的函数
  const handleAddRequestItem = () => {
    const newItem: PurchaseRequestItem = {
      id: `item_${Date.now()}`,
      materialId: '',
      materialCode: '',
      materialName: '',
      specification: '',
      quantity: 0,
      unit: '',
      unitPrice: 0,
      totalAmount: 0,
      expectedDeliveryDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
      remarks: '',
    };
    
    setPurchaseRequestItems(prev => [...prev, newItem]);
  };

  // 添加处理删除物料的函数
  const handleRemoveRequestItem = (itemId: string) => {
    setPurchaseRequestItems(prev => prev.filter(item => item.id !== itemId));
  };

  // 添加处理更新物料的函数
  const handleUpdateRequestItem = (itemId: string, field: string, value: any) => {
    setPurchaseRequestItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        
        // 如果更新的是数量或单价，重新计算总金额
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalAmount = updated.quantity * updated.unitPrice;
        }
        
        return updated;
      }
      return item;
    }));
  };

  // 添加处理待审批申请的函数
  const handlePendingRequests = () => {
    // 切换到采购申请选项卡
    setActiveTab('1');
    
    // 设置状态筛选为"待审批"
    setStatusFilter('待审批');
    
    // 应用筛选
    applyFilters();
  };

  // 添加采购申请详情的状态变量
  const [purchaseRequestDetailVisible, setPurchaseRequestDetailVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
  const [selectedRequestItems, setSelectedRequestItems] = useState<PurchaseRequestItem[]>([]);

  // 添加采购申请审批的状态变量
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [approvalRemark, setApprovalRemark] = useState('');

  // 添加转采购订单的状态变量
  const [convertToPOModalVisible, setConvertToPOModalVisible] = useState(false);
  const [purchaseOrderForm] = Form.useForm();

  // 查看采购申请详情
  const handleViewRequestDetail = (record: PurchaseRequest) => {
    setSelectedRequest(record);
    
    // 模拟获取申请明细
    const mockItems: PurchaseRequestItem[] = [
      {
        id: '1',
        materialId: '101',
        materialCode: 'M001',
        materialName: '钢板',
        specification: '1.5mm*1220mm*2440mm',
        quantity: 10,
        unit: '张',
        unitPrice: 125.00,
        totalAmount: 1250.00,
        expectedDeliveryDate: '2023-04-10',
        remarks: '常规采购'
      },
      {
        id: '2',
        materialId: '102',
        materialCode: 'M002',
        materialName: '铜板',
        specification: '1.0mm*1000mm*2000mm',
        quantity: 5,
        unit: '张',
        unitPrice: 230.00,
        totalAmount: 1150.00,
        expectedDeliveryDate: '2023-04-10',
        remarks: '常规采购'
      }
    ];
    
    setSelectedRequestItems(mockItems);
    setPurchaseRequestDetailVisible(true);
  };

  // 打开审批模态框
  const handleOpenApproval = (record: PurchaseRequest, isApprove: boolean) => {
    setSelectedRequest(record);
    setApprovalRemark('');
    
    // 设置默认操作类型
    setApproveAction(isApprove);
    
    setApprovalModalVisible(true);
  };

  // 审批状态
  const [approveAction, setApproveAction] = useState(true);

  // 提交审批或驳回
  const handleSubmitApproval = () => {
    if (!selectedRequest) return;
    
    // 执行审批或驳回操作
    const newStatus = approveAction ? '已审批' : '已驳回';
    
    // 模拟API调用，更新采购申请状态
    mockPurchaseRequests.forEach(item => {
      if (item.id === selectedRequest.id) {
        item.status = newStatus;
        item.approver = '当前用户';
        item.approveDate = dayjs().format('YYYY-MM-DD');
      }
    });
    
    message.success(`采购申请${approveAction ? '审批通过' : '已驳回'}`);
    setApprovalModalVisible(false);
  };

  // 打开转采购订单模态框
  const handleOpenConvertToPO = (record: PurchaseRequest) => {
    setSelectedRequest(record);
    
    // 模拟获取申请明细
    const mockItems: PurchaseRequestItem[] = [
      {
        id: '1',
        materialId: '101',
        materialCode: 'M001',
        materialName: '钢板',
        specification: '1.5mm*1220mm*2440mm',
        quantity: 10,
        unit: '张',
        unitPrice: 125.00,
        totalAmount: 1250.00,
        expectedDeliveryDate: '2023-04-10',
        remarks: '常规采购'
      },
      {
        id: '2',
        materialId: '102',
        materialCode: 'M002',
        materialName: '铜板',
        specification: '1.0mm*1000mm*2000mm',
        quantity: 5,
        unit: '张',
        unitPrice: 230.00,
        totalAmount: 1150.00,
        expectedDeliveryDate: '2023-04-10',
        remarks: '常规采购'
      }
    ];
    
    setSelectedRequestItems(mockItems);
    
    // 设置默认值
    purchaseOrderForm.setFieldsValue({
      supplier: '',
      orderDate: dayjs(),
      deliveryDate: dayjs().add(7, 'day'),
      paymentTerms: '月结30天',
      currency: 'CNY',
      items: mockItems.map(item => ({
        ...item,
        checked: true
      }))
    });
    
    setConvertToPOModalVisible(true);
  };

  // 提交转采购订单
  const handleSubmitConvertToPO = () => {
    purchaseOrderForm.validateFields().then(values => {
      // 验证至少选择了一个物料
      const selectedItems = values.items.filter((item: any) => item.checked);
      if (selectedItems.length === 0) {
        message.error('请至少选择一个物料');
        return;
      }
      
      // 创建采购订单的逻辑
      const newPO = {
        id: `PO${Date.now()}`,
        orderCode: `PO-${dayjs().format('YYYYMMDD')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        orderDate: dayjs(values.orderDate).format('YYYY-MM-DD'),
        supplier: values.supplier,
        totalAmount: selectedItems.reduce((sum: number, item: any) => sum + item.totalAmount, 0),
        currency: values.currency,
        status: '待审批',
        paymentTerms: values.paymentTerms,
        deliveryDate: dayjs(values.deliveryDate).format('YYYY-MM-DD'),
        buyer: '当前用户',
        totalItems: selectedItems.length,
        approver: '',
        approveDate: '',
        remarks: values.remarks || ''
      };
      
      console.log('新创建的采购订单:', newPO);
      console.log('订单物料:', selectedItems);
      
      // 更新原采购申请状态
      if (selectedRequest) {
        mockPurchaseRequests.forEach(item => {
          if (item.id === selectedRequest.id) {
            item.status = '已转单';
          }
        });
      }
      
      message.success('采购订单创建成功！');
      setConvertToPOModalVisible(false);
      
      // 切换到采购订单选项卡
      setActiveTab('2');
    });
  };

  // 处理来自任务中心的参数
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get('action');
    const id = queryParams.get('id');
    const tab = queryParams.get('tab');
    const mode = queryParams.get('mode');
    
    // 如果是从任务中心跳转来的处理请求
    if (action === 'process' && id) {
      // 设置活动标签页
      if (tab === 'requests') {
        setActiveTab('1'); // 采购申请选项卡
      } else if (tab === 'orders') {
        setActiveTab('2'); // 采购订单选项卡
      } else if (tab === 'suppliers') {
        setActiveTab('3'); // 供应商选项卡
      }
      
      // 延迟执行，确保数据已加载
      setTimeout(() => {
        // 查找对应的记录
        if (tab === 'requests') {
          const targetRequest = mockPurchaseRequests.find(req => 
            req.requestCode === id || req.id === id
          );
          
          if (targetRequest) {
            if (mode === 'approval') {
              // 打开审批界面
              handleOpenApproval(targetRequest, true);
            } else {
              // 打开详情界面
              handleViewRequestDetail(targetRequest);
            }
          }
        } else if (tab === 'orders') {
          // 使用mockPurchaseOrders变量之前，确保它已经定义
          // 查找相关采购订单
          const foundOrder = mockPurchaseRequests.find((req: PurchaseRequest) => 
            req.requestCode === id || req.id === id
          );
          
          if (foundOrder) {
            message.info(`正在查看采购单据: ${foundOrder.requestCode}`);
            // 如果实现了查看订单详情功能，可以调用相应的处理函数
            // 例如: handleViewOrderDetail(foundOrder);
          } else {
            message.error('未找到指定的采购单据');
          }
        }
      }, 300);
    }
  }, [location.search]); // 当URL参数变化时执行

  return (
    <div className="procurement-page">
      <Title level={2}>采购管理</Title>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="待审批申请"
              value={mockPurchaseRequests.filter(item => item.status === '待审批').length}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Button 
                type="primary" 
                size="small"
                onClick={handlePendingRequests}
              >
                立即处理
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="进行中采购"
              value={12} // 模拟数据
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="本月采购额"
              value={125800}
              valueStyle={{ color: '#52c41a' }}
              prefix="¥"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="待到货订单"
              value={5} // 模拟数据
              valueStyle={{ color: '#722ed1' }}
              suffix="个"
            />
          </Card>
        </Col>
      </Row>
      
      {/* 主内容区 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="采购申请" key="1">
            <div style={{ marginBottom: 16 }}>
              <Row gutter={16} align="middle">
                <Col xs={24} sm={14} md={16}>
                  <Space>
                    <Input
                      placeholder="搜索申请单号/申请人/部门"
                      value={purchaseRequestSearchText}
                      onChange={(e) => setPurchaseRequestSearchText(e.target.value)}
                      style={{ width: 250 }}
                      prefix={<SearchOutlined />}
                      allowClear
                    />
                    <Select
                      placeholder="状态"
                      style={{ width: 140 }}
                      allowClear
                      value={statusFilter}
                      onChange={setStatusFilter}
                    >
                      <Option value="待审批">待审批</Option>
                      <Option value="已审批">已审批</Option>
                      <Option value="已转单">已转单</Option>
                      <Option value="已驳回">已驳回</Option>
                    </Select>
                    <Select
                      placeholder="优先级"
                      style={{ width: 140 }}
                      allowClear
                      value={priorityFilter}
                      onChange={setPriorityFilter}
                    >
                      <Option value="紧急">紧急</Option>
                      <Option value="高">高</Option>
                      <Option value="普通">普通</Option>
                      <Option value="低">低</Option>
                    </Select>
                    <Tooltip title="重置筛选条件">
                      <Button 
                        icon={<ReloadOutlined />} 
                        onClick={() => setPurchaseRequestSearchText('')}
                      />
                    </Tooltip>
                  </Space>
                </Col>
                <Col xs={24} sm={10} md={8} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button icon={<PlusOutlined />} type="primary" onClick={handleCreatePurchaseRequest}>
                      新建申请
                    </Button>
                    <Button icon={<ExportOutlined />}>导出</Button>
                    <Button icon={<PrinterOutlined />}>打印</Button>
                  </Space>
                </Col>
              </Row>
            </div>

            <Table
              columns={purchaseRequestColumns}
              dataSource={filteredPurchaseRequests}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="middle"
            />
          </TabPane>
          
          <TabPane tab="采购订单" key="2">
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Title level={4}>采购订单功能开发中...</Title>
              <p>这里将显示采购订单列表，支持创建、审批、跟踪和管理采购订单。</p>
              <Button type="primary" icon={<PlusOutlined />} style={{ marginTop: 16 }}>
                创建采购订单
              </Button>
            </div>
          </TabPane>
          
          <TabPane tab="供应商管理" key="3">
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Title level={4}>供应商管理功能开发中...</Title>
              <p>这里将显示供应商列表，支持添加、编辑和管理供应商信息。</p>
              <Button type="primary" icon={<PlusOutlined />} style={{ marginTop: 16 }}>
                添加供应商
              </Button>
            </div>
          </TabPane>
          
          <TabPane tab="采购报表" key="4">
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Title level={4}>采购报表功能开发中...</Title>
              <p>这里将提供各类采购统计报表，包括采购趋势、供应商分析和采购成本分析等。</p>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 采购申请创建抽屉 */}
      <Drawer
        title="创建采购申请"
        width={1000}
        placement="right"
        onClose={() => setCreatePurchaseRequestDrawerVisible(false)}
        visible={createPurchaseRequestDrawerVisible}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 8 }} onClick={() => setCreatePurchaseRequestDrawerVisible(false)}>
              取消
            </Button>
            <Button type="primary" onClick={handleSubmitPurchaseRequest}>
              提交
            </Button>
          </div>
        }
      >
        <Form
          form={createPurchaseRequestForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="requestType"
                label="申请类型"
                rules={[{ required: true, message: '请选择申请类型' }]}
              >
                <Select>
                  <Option value="常规采购">常规采购</Option>
                  <Option value="紧急采购">紧急采购</Option>
                  <Option value="战略采购">战略采购</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="requestDate"
                label="申请日期"
                rules={[{ required: true, message: '请选择申请日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select>
                  <Option value="紧急">紧急</Option>
                  <Option value="高">高</Option>
                  <Option value="普通">普通</Option>
                  <Option value="低">低</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="requester"
                label="申请人"
                rules={[{ required: true, message: '请输入申请人' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="department"
                label="申请部门"
                rules={[{ required: true, message: '请选择申请部门' }]}
              >
                <Select>
                  <Option value="仓库部">仓库部</Option>
                  <Option value="生产部">生产部</Option>
                  <Option value="工程部">工程部</Option>
                  <Option value="维修部">维修部</Option>
                  <Option value="质检部">质检部</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="remarks"
                label="备注"
              >
                <Input.TextArea rows={1} />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">物料明细</Divider>
          
          <div style={{ marginBottom: 16 }}>
            <Button 
              type="dashed" 
              onClick={handleAddRequestItem} 
              style={{ width: '100%' }}
              icon={<PlusOutlined />}
            >
              添加物料
            </Button>
          </div>
          
          <Table
            dataSource={purchaseRequestItems}
            columns={[
              {
                title: '物料编码',
                dataIndex: 'materialCode',
                width: 120,
                render: (text, record) => (
                  <Input
                    value={text}
                    onChange={(e) => handleUpdateRequestItem(record.id, 'materialCode', e.target.value)}
                    placeholder="输入编码"
                  />
                )
              },
              {
                title: '物料名称',
                dataIndex: 'materialName',
                width: 120,
                render: (text, record) => (
                  <Input
                    value={text}
                    onChange={(e) => handleUpdateRequestItem(record.id, 'materialName', e.target.value)}
                    placeholder="输入名称"
                  />
                )
              },
              {
                title: '规格型号',
                dataIndex: 'specification',
                width: 120,
                render: (text, record) => (
                  <Input
                    value={text}
                    onChange={(e) => handleUpdateRequestItem(record.id, 'specification', e.target.value)}
                    placeholder="输入规格"
                  />
                )
              },
              {
                title: '数量',
                dataIndex: 'quantity',
                width: 100,
                render: (text, record) => (
                  <InputNumber
                    value={text}
                    onChange={(value) => handleUpdateRequestItem(record.id, 'quantity', value)}
                    min={1}
                    style={{ width: '100%' }}
                  />
                )
              },
              {
                title: '单位',
                dataIndex: 'unit',
                width: 80,
                render: (text, record) => (
                  <Input
                    value={text}
                    onChange={(e) => handleUpdateRequestItem(record.id, 'unit', e.target.value)}
                    placeholder="单位"
                  />
                )
              },
              {
                title: '单价',
                dataIndex: 'unitPrice',
                width: 100,
                render: (text, record) => (
                  <InputNumber
                    value={text}
                    onChange={(value) => handleUpdateRequestItem(record.id, 'unitPrice', value)}
                    min={0}
                    precision={2}
                    style={{ width: '100%' }}
                  />
                )
              },
              {
                title: '金额',
                dataIndex: 'totalAmount',
                width: 100,
                render: (text) => text.toFixed(2)
              },
              {
                title: '预计到货日期',
                dataIndex: 'expectedDeliveryDate',
                width: 140,
                render: (text, record) => (
                  <DatePicker
                    value={text ? dayjs(text) : null}
                    onChange={(date) => handleUpdateRequestItem(
                      record.id, 
                      'expectedDeliveryDate', 
                      date ? date.format('YYYY-MM-DD') : null
                    )}
                    style={{ width: '100%' }}
                  />
                )
              },
              {
                title: '备注',
                dataIndex: 'remarks',
                render: (text, record) => (
                  <Input
                    value={text}
                    onChange={(e) => handleUpdateRequestItem(record.id, 'remarks', e.target.value)}
                    placeholder="备注"
                  />
                )
              },
              {
                title: '操作',
                width: 80,
                render: (_, record) => (
                  <Button 
                    type="link" 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveRequestItem(record.id)}
                  />
                )
              }
            ]}
            pagination={false}
            rowKey="id"
            size="small"
          />
        </Form>
      </Drawer>

      {/* 采购申请详情模态框 */}
      <Modal
        title="采购申请详情"
        open={purchaseRequestDetailVisible}
        width={1000}
        onCancel={() => setPurchaseRequestDetailVisible(false)}
        footer={[
          <Button key="back" onClick={() => setPurchaseRequestDetailVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedRequest && (
          <>
            <Descriptions title="基本信息" bordered column={3}>
              <Descriptions.Item label="申请单号">{selectedRequest.requestCode}</Descriptions.Item>
              <Descriptions.Item label="申请类型">{selectedRequest.requestType}</Descriptions.Item>
              <Descriptions.Item label="申请日期">{selectedRequest.requestDate}</Descriptions.Item>
              <Descriptions.Item label="申请人">{selectedRequest.requester}</Descriptions.Item>
              <Descriptions.Item label="申请部门">{selectedRequest.department}</Descriptions.Item>
              <Descriptions.Item label="优先级">
                <Tag color={
                  selectedRequest.priority === '紧急' ? 'red' :
                  selectedRequest.priority === '高' ? 'orange' :
                  selectedRequest.priority === '普通' ? 'blue' : 'default'
                }>
                  {selectedRequest.priority}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  selectedRequest.status === '已审批' ? 'green' :
                  selectedRequest.status === '待审批' ? 'orange' :
                  selectedRequest.status === '已转单' ? 'blue' :
                  selectedRequest.status === '已驳回' ? 'red' : 'default'
                }>
                  {selectedRequest.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="审批人">{selectedRequest.approver || '未审批'}</Descriptions.Item>
              <Descriptions.Item label="审批日期">{selectedRequest.approveDate || '未审批'}</Descriptions.Item>
              <Descriptions.Item label="备注" span={3}>{selectedRequest.remarks}</Descriptions.Item>
            </Descriptions>
            
            <Divider orientation="left">申请明细</Divider>
            
            <Table
              dataSource={selectedRequestItems}
              columns={[
                { title: '物料编码', dataIndex: 'materialCode' },
                { title: '物料名称', dataIndex: 'materialName' },
                { title: '规格型号', dataIndex: 'specification' },
                { title: '申请数量', dataIndex: 'quantity' },
                { title: '单位', dataIndex: 'unit' },
                { 
                  title: '单价', 
                  dataIndex: 'unitPrice',
                  render: (value) => `¥${value.toFixed(2)}` 
                },
                { 
                  title: '总金额', 
                  dataIndex: 'totalAmount',
                  render: (value) => `¥${value.toFixed(2)}` 
                },
                { title: '预计到货日期', dataIndex: 'expectedDeliveryDate' },
                { title: '备注', dataIndex: 'remarks' }
              ]}
              pagination={false}
              rowKey="id"
              size="small"
            />
          </>
        )}
      </Modal>

      {/* 审批模态框 */}
      <Modal
        title={approveAction ? "审批采购申请" : "驳回采购申请"}
        open={approvalModalVisible}
        onCancel={() => setApprovalModalVisible(false)}
        onOk={handleSubmitApproval}
        okText={approveAction ? "通过" : "驳回"}
        cancelText="取消"
      >
        {selectedRequest && (
          <>
            <p>{approveAction ? "确定通过此采购申请？" : "确定驳回此采购申请？"}</p>
            <p>申请编号: {selectedRequest.requestCode}</p>
            <p>申请人: {selectedRequest.requester}</p>
            <p>部门: {selectedRequest.department}</p>
            
            <Form layout="vertical">
              <Form.Item label="备注" name="remark">
                <Input.TextArea 
                  rows={4} 
                  placeholder="请输入审批意见（可选）" 
                  value={approvalRemark}
                  onChange={(e) => setApprovalRemark(e.target.value)}
                />
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
      
      {/* 转采购订单模态框 */}
      <Modal
        title="创建采购订单"
        open={convertToPOModalVisible}
        width={1000}
        onCancel={() => setConvertToPOModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setConvertToPOModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmitConvertToPO}>
            提交
          </Button>
        ]}
      >
        <Form
          form={purchaseOrderForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="supplier"
                label="供应商"
                rules={[{ required: true, message: '请选择供应商' }]}
              >
                <Select placeholder="选择供应商">
                  <Option value="S001">上海钢铁有限公司</Option>
                  <Option value="S002">广州金属加工厂</Option>
                  <Option value="S003">深圳五金器材有限公司</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="orderDate"
                label="订单日期"
                rules={[{ required: true, message: '请选择订单日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="deliveryDate"
                label="预计交货日期"
                rules={[{ required: true, message: '请选择预计交货日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="paymentTerms"
                label="付款条件"
                rules={[{ required: true, message: '请选择付款条件' }]}
              >
                <Select placeholder="选择付款条件">
                  <Option value="月结30天">月结30天</Option>
                  <Option value="月结60天">月结60天</Option>
                  <Option value="预付款">预付款</Option>
                  <Option value="货到付款">货到付款</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="currency"
                label="币种"
                rules={[{ required: true, message: '请选择币种' }]}
              >
                <Select placeholder="选择币种">
                  <Option value="CNY">人民币</Option>
                  <Option value="USD">美元</Option>
                  <Option value="EUR">欧元</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="remarks"
                label="备注"
              >
                <Input.TextArea rows={1} />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">订单明细</Divider>
          
          <Form.List name="items">
            {(fields) => (
              <Table
                dataSource={fields.map(field => purchaseOrderForm.getFieldValue(['items', field.name]))}
                columns={[
                  {
                    title: '选择',
                    dataIndex: 'checked',
                    width: 60,
                    render: (checked, record, index) => (
                      <Form.Item
                        name={[index, 'checked']}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox />
                      </Form.Item>
                    )
                  },
                  { title: '物料编码', dataIndex: 'materialCode' },
                  { title: '物料名称', dataIndex: 'materialName' },
                  { title: '规格型号', dataIndex: 'specification' },
                  { 
                    title: '数量',
                    dataIndex: 'quantity',
                    render: (quantity, record, index) => (
                      <Form.Item
                        name={[index, 'quantity']}
                        noStyle
                      >
                        <InputNumber
                          min={1}
                          style={{ width: 100 }}
                          onChange={(value) => {
                            // 更新总金额
                            const price = purchaseOrderForm.getFieldValue(['items', index, 'unitPrice']);
                            purchaseOrderForm.setFieldsValue({
                              items: {
                                [index]: {
                                  totalAmount: (value || 0) * price
                                }
                              }
                            });
                          }}
                        />
                      </Form.Item>
                    )
                  },
                  { title: '单位', dataIndex: 'unit' },
                  { 
                    title: '单价',
                    dataIndex: 'unitPrice',
                    render: (price, record, index) => (
                      <Form.Item
                        name={[index, 'unitPrice']}
                        noStyle
                      >
                        <InputNumber
                          min={0}
                          precision={2}
                          style={{ width: 100 }}
                          onChange={(value) => {
                            // 更新总金额
                            const quantity = purchaseOrderForm.getFieldValue(['items', index, 'quantity']);
                            purchaseOrderForm.setFieldsValue({
                              items: {
                                [index]: {
                                  totalAmount: quantity * (value || 0)
                                }
                              }
                            });
                          }}
                        />
                      </Form.Item>
                    )
                  },
                  { 
                    title: '总金额',
                    dataIndex: 'totalAmount',
                    render: (amount, record, index) => (
                      <Form.Item
                        name={[index, 'totalAmount']}
                        noStyle
                      >
                        <InputNumber
                          disabled
                          precision={2}
                          style={{ width: 100 }}
                        />
                      </Form.Item>
                    )
                  },
                  { 
                    title: '预计到货日期',
                    dataIndex: 'expectedDeliveryDate',
                    render: (date, record, index) => (
                      <Form.Item
                        name={[index, 'expectedDeliveryDate']}
                        noStyle
                      >
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    )
                  }
                ]}
                pagination={false}
                rowKey="id"
                size="small"
              />
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default Procurement; 