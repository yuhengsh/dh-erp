import React, { useState, useEffect, useContext } from 'react';
import {
  Tabs,
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Typography,
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
  Alert,
  Modal,
  List,
  Descriptions,
  Spin,
  Radio,
  Checkbox,
  Progress,
  Tabs as AntTabs,
  Empty,
  Timeline
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  ExportOutlined,
  PrinterOutlined,
  BarChartOutlined,
  ReloadOutlined,
  ImportOutlined,
  SyncOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  UploadOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  ToolOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { AppContext } from '../../App';
import { useTaskContext } from '../../context/TaskContext';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 库存物料类型
interface InventoryItem {
  id: string;
  materialCode: string;
  materialName: string;
  specification: string;
  category: string;
  warehouse: string;
  location: string;
  batch: string;
  quantity: number;
  unit: string;
  safetyStock: number;
  statusCode: string;
  lastUpdated: string;
  costPrice: number;
  totalValue: number;
}

// 入库单类型
interface InboundOrder {
  id: string;
  orderNo: string;
  orderType: string;
  sourceOrderNo: string;
  sourceType: string;
  status: string;
  createdBy: string;
  createdAt: string;
  approvedBy: string;
  approvedAt: string;
  warehouse: string;
  totalItems: number;
  remarks: string;
}

// 出库单类型
interface OutboundOrder {
  id: string;
  orderNo: string;
  orderType: string;
  destinationOrderNo: string;
  destinationType: string;
  status: string;
  createdBy: string;
  createdAt: string;
  approvedBy: string;
  approvedAt: string;
  warehouse: string;
  totalItems: number;
  remarks: string;
}

// 库存流水类型
interface InventoryTransaction {
  id: string;
  transactionNo: string;
  transactionType: string;
  materialCode: string;
  materialName: string;
  warehouse: string;
  location: string;
  quantity: number;
  unit: string;
  direction: string;
  beforeQuantity: number;
  afterQuantity: number;
  relatedOrderNo: string;
  operator: string;
  createdAt: string;
  batch: string;
}

// 添加库存盘点记录接口
interface InventoryCheckRecord {
  id: string;
  checkCode: string;
  warehouseName: string;
  checkDate: string;
  checkType: string;
  status: string;
  checkManager: string;
}

// 添加盘点明细接口
interface InventoryCheckItem {
  id: string;
  materialCode: string;
  materialName: string;
  systemQuantity: number;
  actualQuantity: number | null;
  differenceQuantity: number | null;
  status: string;
}

// 入库检验界面状态接口
interface InspectionState {
  visible: boolean;
  inboundOrderId: string;
  items: InspectionItem[];
}

// 检验项目接口
interface InspectionItem {
  id: string;
  materialCode: string;
  materialName: string;
  specification: string;
  quantity: number;
  unit: string;
  status: string;
  qualifiedQuantity?: number;
  unqualifiedQuantity?: number;
  remarks?: string;
}

// 仓库管理主组件
const Warehouse: React.FC = () => {
  // 应用上下文
  const appContext = useContext(AppContext);
  
  // 任务上下文
  const taskContext = useTaskContext();
  
  // 导航和路由
  const navigate = useNavigate();
  const location = useLocation();
  
  // 标签状态
  const [activeTab, setActiveTab] = useState('1');
  const [searchText, setSearchText] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  
  // 添加入库检验状态
  const [inspectionState, setInspectionState] = useState<InspectionState>({
    visible: false,
    inboundOrderId: '',
    items: []
  });
  
  // 抽屉状态
  const [inboundDrawerVisible, setInboundDrawerVisible] = useState(false);
  const [outboundDrawerVisible, setOutboundDrawerVisible] = useState(false);
  const [inboundForm] = Form.useForm();
  const [outboundForm] = Form.useForm();
  
  // 详情模态框状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);
  const [detailModalTitle, setDetailModalTitle] = useState('');

  // 库存分析与盘点状态
  const [inventoryAnalysisModalVisible, setInventoryAnalysisModalVisible] = useState(false);
  const [inventoryCheckModalVisible, setInventoryCheckModalVisible] = useState(false);
  const [analysisType, setAnalysisType] = useState<string>('overview');
  const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [inventoryCheckData, setInventoryCheckData] = useState<InventoryCheckRecord[]>([]);
  const [inventoryCheckLoading, setInventoryCheckLoading] = useState<boolean>(false);
  const [selectedCheckId, setSelectedCheckId] = useState<string | null>(null);
  const [checkItemsModalVisible, setCheckItemsModalVisible] = useState<boolean>(false);
  const [checkItems, setCheckItems] = useState<InventoryCheckItem[]>([]);
  const [checkItemsLoading, setCheckItemsLoading] = useState<boolean>(false);

  // 在现有状态变量定义区域添加明细模态框状态
  const [inventoryDetailModalVisible, setInventoryDetailModalVisible] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);

  // 在现有状态变量定义区域添加采购申请相关状态
  const [purchaseRequestModalVisible, setPurchaseRequestModalVisible] = useState(false);
  const [purchaseRequestItems, setPurchaseRequestItems] = useState<InventoryItem[]>([]);
  const [purchaseRequestForm] = Form.useForm();

  // 在现有状态变量定义区域添加待审核单据相关状态
  const [pendingOrdersModalVisible, setPendingOrdersModalVisible] = useState(false);
  const [pendingOrdersActiveTab, setPendingOrdersActiveTab] = useState('1');

  // 在现有状态变量定义区域添加模拟数据的状态变量
  const [mockInventoryItems, setMockInventoryItems] = useState<InventoryItem[]>([
    {
      id: '1',
      materialCode: 'M001',
      materialName: '钢板',
      specification: '1.5mm*1220mm*2440mm',
      category: '原料',
      warehouse: '主仓库',
      location: 'A-01-01',
      batch: 'B20230301001',
      quantity: 15,
      unit: '张',
      safetyStock: 20,
      statusCode: 'normal',
      lastUpdated: '2023-03-10 15:30:45',
      costPrice: 125.00,
      totalValue: 1875.00
    },
    {
      id: '2',
      materialCode: 'M002',
      materialName: '铜板',
      specification: '1.0mm*1000mm*2000mm',
      category: '原料',
      warehouse: '主仓库',
      location: 'A-01-02',
      batch: 'B20230305002',
      quantity: 8,
      unit: '张',
      safetyStock: 15,
      statusCode: 'warning',
      lastUpdated: '2023-03-12 09:15:20',
      costPrice: 230.00,
      totalValue: 1840.00
    },
    {
      id: '3',
      materialCode: 'M003',
      materialName: '不锈钢管',
      specification: 'Φ20mm*2mm*6000mm',
      category: '原料',
      warehouse: '主仓库',
      location: 'A-02-01',
      batch: 'B20230310003',
      quantity: 0,
      unit: '根',
      safetyStock: 10,
      statusCode: 'error',
      lastUpdated: '2023-03-15 11:40:15',
      costPrice: 85.00,
      totalValue: 0.00
    }
  ]);

  // 计算低库存数量
  const lowStockCount = mockInventoryItems.filter(item => item.quantity < item.safetyStock).length;

  // 模拟数据 - 入库单
  const [mockInboundOrders, setMockInboundOrders] = useState<InboundOrder[]>([
    {
      id: '1',
      orderNo: 'IN-2023-001',
      orderType: '采购入库',
      sourceOrderNo: 'PO-2023-001',
      sourceType: '采购订单',
      status: '已完成',
      createdBy: '李四',
      createdAt: '2023-03-10 09:00',
      approvedBy: '张三',
      approvedAt: '2023-03-10 10:30',
      warehouse: '原材料仓',
      totalItems: 5,
      remarks: '常规采购入库'
    },
    {
      id: '2',
      orderNo: 'IN-2023-002',
      orderType: '生产入库',
      sourceOrderNo: 'PRD-2023-005',
      sourceType: '生产单',
      status: '待审批',
      createdBy: '王五',
      createdAt: '2023-03-12 14:20',
      approvedBy: '',
      approvedAt: '',
      warehouse: '成品仓',
      totalItems: 2,
      remarks: '生产完工入库'
    },
    {
      id: '3',
      orderNo: 'IN-2023-078',
      orderType: '采购入库',
      sourceOrderNo: 'PO-2023-045',
      sourceType: '采购订单',
      status: '待检验',
      createdBy: '李四',
      createdAt: '2023-03-14 11:30',
      approvedBy: '张三',
      approvedAt: '2023-03-14 14:00',
      warehouse: '原材料仓',
      totalItems: 3,
      remarks: '钢材采购入库，需要检验'
    },
  ]);

  const [mockOutboundOrders, setMockOutboundOrders] = useState<OutboundOrder[]>([
    {
      id: '1',
      orderNo: 'OUT20230322001',
      orderType: '销售出库',
      destinationOrderNo: 'SO20230320001',
      destinationType: '销售订单',
      status: '待审核',
      createdBy: '张三',
      createdAt: '2023-03-22 09:30:15',
      approvedBy: '',
      approvedAt: '',
      warehouse: '成品仓库',
      totalItems: 2,
      remarks: '客户订单发货'
    },
    {
      id: '2',
      orderNo: 'OUT20230323002',
      orderType: '生产领料',
      destinationOrderNo: 'MO20230321003',
      destinationType: '生产订单',
      status: '已审核',
      createdBy: '李四',
      createdAt: '2023-03-23 10:45:20',
      approvedBy: '王五',
      approvedAt: '2023-03-23 11:30:40',
      warehouse: '主仓库',
      totalItems: 5,
      remarks: '生产所需原料'
    }
  ]);

  const [mockInventoryTransactions, setMockInventoryTransactions] = useState<InventoryTransaction[]>([
    {
      id: '1',
      transactionNo: 'TR20230320001',
      transactionType: '采购入库',
      materialCode: 'M001',
      materialName: '钢板',
      warehouse: '主仓库',
      location: 'A-01-01',
      quantity: 5,
      unit: '张',
      direction: '入库',
      beforeQuantity: 10,
      afterQuantity: 15,
      relatedOrderNo: 'IN20230320001',
      operator: '张三',
      createdAt: '2023-03-20 11:30:45',
      batch: 'B20230301001'
    },
    {
      id: '2',
      transactionNo: 'TR20230322001',
      transactionType: '销售出库',
      materialCode: 'M002',
      materialName: '铜板',
      warehouse: '主仓库',
      location: 'A-01-02',
      quantity: 2,
      unit: '张',
      direction: '出库',
      beforeQuantity: 10,
      afterQuantity: 8,
      relatedOrderNo: 'OUT20230322001',
      operator: '李四',
      createdAt: '2023-03-22 10:15:30',
      batch: 'B20230305002'
    }
  ]);

  // 计算待审核单据数量
  const pendingInboundCount = mockInboundOrders.filter(order => order.status === '待审核').length;
  const pendingOutboundCount = mockOutboundOrders.filter(order => order.status === '待审核').length;

  // 库存查询表格列定义
  const inventoryColumns: ColumnsType<InventoryItem> = [
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      sorter: (a, b) => a.materialCode.localeCompare(b.materialCode),
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      sorter: (a, b) => a.materialName.localeCompare(b.materialName),
    },
    {
      title: '规格型号',
      dataIndex: 'specification',
      key: 'specification',
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      render: (text) => {
        let color = 'blue';
        if (text === '辅料') color = 'green';
        if (text === '成品') color = 'purple';
        if (text === '半成品') color = 'orange';
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: '原料', value: '原料' },
        { text: '辅料', value: '辅料' },
        { text: '成品', value: '成品' },
        { text: '半成品', value: '半成品' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: '仓库',
      dataIndex: 'warehouse',
      key: 'warehouse',
      filters: [
        { text: '主仓库', value: '主仓库' },
        { text: '辅料仓库', value: '辅料仓库' },
        { text: '成品仓库', value: '成品仓库' },
      ],
      onFilter: (value, record) => record.warehouse === value,
    },
    {
      title: '库位',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '批次',
      dataIndex: 'batch',
      key: 'batch',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
      render: (text, record) => (
        <span>
          {text} {record.unit}
        </span>
      ),
    },
    {
      title: '库存状态',
      dataIndex: 'statusCode',
      key: 'statusCode',
      render: (status, record) => {
        if (record.quantity < record.safetyStock) {
          return <Badge status="warning" text="库存不足" />;
        }
        return <Badge status="success" text="正常" />;
      },
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      sorter: (a, b) => a.lastUpdated.localeCompare(b.lastUpdated),
    },
    {
      title: '金额(元)',
      dataIndex: 'totalValue',
      key: 'totalValue',
      sorter: (a, b) => a.totalValue - b.totalValue,
      render: (value) => `¥${value.toLocaleString('zh-CN')}`
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            type="link" 
            onClick={() => handleViewInventoryDetail(record)}
          >
            查看明细
          </Button>
          {record.quantity < record.safetyStock && (
            <Button 
              size="small" 
              type="primary" 
              danger
              onClick={() => handleGeneratePurchaseRequest([record])}
            >
              补货申请
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 入库单表格列定义
  const inboundColumns: ColumnsType<InboundOrder> = [
    {
      title: '入库单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '入库类型',
      dataIndex: 'orderType',
      key: 'orderType',
    },
    {
      title: '来源单号',
      dataIndex: 'sourceOrderNo',
      key: 'sourceOrderNo',
    },
    {
      title: '仓库',
      dataIndex: 'warehouse',
      key: 'warehouse',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === '已完成') color = 'success';
        else if (status === '待审批') color = 'warning';
        else if (status === '待检验') color = 'processing';
        else if (status === '已取消') color = 'error';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => showOrderDetails(record, '入库单详情')}>
            查看
          </Button>
          {record.status === '待审批' && (
            <Space size="small">
              <Button 
                type="link" 
                size="small" 
                onClick={() => handleApproveOrder('inbound', record.id, true)}
                style={{ color: '#52c41a' }}
              >
                审批
              </Button>
              <Button 
                type="link" 
                size="small" 
                onClick={() => handleApproveOrder('inbound', record.id, false)}
                danger
              >
                拒绝
              </Button>
            </Space>
          )}
          {record.status === '待检验' && (
            <Button 
              type="link" 
              size="small" 
              onClick={() => handleInspectInbound(record)}
              style={{ color: '#1890ff' }}
            >
              检验
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 出库单表格列定义
  const outboundColumns: ColumnsType<OutboundOrder> = [
    {
      title: '出库单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      sorter: (a, b) => a.orderNo.localeCompare(b.orderNo),
    },
    {
      title: '出库类型',
      dataIndex: 'orderType',
      key: 'orderType',
      filters: [
        { text: '销售出库', value: '销售出库' },
        { text: '生产领料', value: '生产领料' },
        { text: '委外发料', value: '委外发料' },
        { text: '其他出库', value: '其他出库' },
      ],
      onFilter: (value, record) => record.orderType === value,
      render: (text) => {
        let color = '';
        if (text === '销售出库') color = 'blue';
        if (text === '生产领料') color = 'green';
        if (text === '委外发料') color = 'purple';
        if (text === '其他出库') color = 'orange';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '目标单据',
      dataIndex: 'destinationOrderNo',
      key: 'destinationOrderNo',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <small style={{ color: '#888' }}>{record.destinationType}</small>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: '待审核', value: '待审核' },
        { text: '已完成', value: '已完成' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (text) => {
        const color = text === '已完成' ? 'success' : 'warning';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '出库仓库',
      dataIndex: 'warehouse',
      key: 'warehouse',
    },
    {
      title: '物料数',
      dataIndex: 'totalItems',
      key: 'totalItems',
    },
    {
      title: '创建信息',
      key: 'createdInfo',
      render: (_, record) => (
        <div>
          <div>{record.createdBy}</div>
          <small style={{ color: '#888' }}>{record.createdAt}</small>
        </div>
      ),
    },
    {
      title: '审核信息',
      key: 'approvedInfo',
      render: (_, record) => {
        if (record.status === '已完成') {
          return (
            <div>
              <div>{record.approvedBy}</div>
              <small style={{ color: '#888' }}>{record.approvedAt}</small>
            </div>
          );
        }
        return <span style={{ color: '#888' }}>-</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => showOrderDetails(record, '出库单详情')}>
            详情
          </Button>
          {record.status === '待审核' && (
            <>
              <Button type="link" size="small">
                审核
              </Button>
              <Button type="link" danger size="small">
                作废
              </Button>
            </>
          )}
          <Button type="link" size="small">
            打印
          </Button>
        </Space>
      ),
    },
  ];

  // 库存流水表格列定义
  const transactionColumns: ColumnsType<InventoryTransaction> = [
    {
      title: '流水编号',
      dataIndex: 'transactionNo',
      key: 'transactionNo',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '操作类型',
      dataIndex: 'transactionType',
      key: 'transactionType',
    },
    {
      title: '物料信息',
      key: 'material',
      render: (_, record) => (
        <div>
          <div>{record.materialName}</div>
          <small style={{ color: '#999' }}>{record.materialCode}</small>
        </div>
      ),
    },
    {
      title: '仓库/库位',
      key: 'location',
      render: (_, record) => (
        <div>
          <div>{record.warehouse}</div>
          <small style={{ color: '#999' }}>{record.location}</small>
        </div>
      ),
    },
    {
      title: '批次',
      dataIndex: 'batch',
      key: 'batch',
    },
    {
      title: '数量变化',
      key: 'quantity',
      render: (_, record) => {
        const isIn = record.direction === '入库';
        const changeText = isIn 
          ? `+${record.quantity} ${record.unit}`
          : `-${record.quantity} ${record.unit}`;
        return (
          <div style={{ color: isIn ? '#52c41a' : '#f5222d' }}>
            {changeText}
          </div>
        );
      },
    },
    {
      title: '操作前/后',
      key: 'beforeAfter',
      render: (_, record) => (
        <div>
          <div>{record.beforeQuantity} → {record.afterQuantity} {record.unit}</div>
        </div>
      ),
    },
    {
      title: '关联单据',
      dataIndex: 'relatedOrderNo',
      key: 'relatedOrderNo',
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '操作时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => handleViewTransaction(record)}>
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  // 处理库存查询的过滤
  const filteredInventory = mockInventoryItems.filter((item) => {
    const isMatchText =
      searchText === '' ||
      item.materialCode.toLowerCase().includes(searchText.toLowerCase()) ||
      item.materialName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.specification.toLowerCase().includes(searchText.toLowerCase());

    const isMatchWarehouse = 
      selectedWarehouse === '' || item.warehouse === selectedWarehouse;

    const isMatchCategory = 
      selectedCategory === '' || item.category === selectedCategory;

    return isMatchText && isMatchWarehouse && isMatchCategory;
  });

  // 处理入库单的过滤
  const filteredInboundOrders = mockInboundOrders.filter((order) => {
    if (searchText && 
        !order.orderNo.toLowerCase().includes(searchText.toLowerCase()) && 
        !order.sourceOrderNo.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      const orderDate = dayjs(order.createdAt.split(' ')[0]);
      if (orderDate.isBefore(dateRange[0]) || orderDate.isAfter(dateRange[1])) {
        return false;
      }
    }
    
    return true;
  });

  // 处理出库单的过滤
  const filteredOutboundOrders = mockOutboundOrders.filter((order) => {
    if (searchText && 
        !order.orderNo.toLowerCase().includes(searchText.toLowerCase()) && 
        !order.destinationOrderNo.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      const orderDate = dayjs(order.createdAt.split(' ')[0]);
      if (orderDate.isBefore(dateRange[0]) || orderDate.isAfter(dateRange[1])) {
        return false;
      }
    }
    
    return true;
  });

  // 处理流水账的过滤
  const filteredTransactions = mockInventoryTransactions.filter((transaction) => {
    if (searchText && 
        !transaction.transactionNo.toLowerCase().includes(searchText.toLowerCase()) && 
        !transaction.materialCode.toLowerCase().includes(searchText.toLowerCase()) && 
        !transaction.materialName.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      const txDate = dayjs(transaction.createdAt.split(' ')[0]);
      if (txDate.isBefore(dateRange[0]) || txDate.isAfter(dateRange[1])) {
        return false;
      }
    }
    
    return true;
  });

  // 显示单据详情
  const showOrderDetails = (record: any, title: string) => {
    setSelectedOrderDetails(record);
    setDetailModalTitle(title);
    setDetailModalVisible(true);
  };

  // 处理新建入库单
  const handleCreateInbound = () => {
    setInboundDrawerVisible(true);
    inboundForm.resetFields();
  };

  // 处理新建出库单
  const handleCreateOutbound = () => {
    setOutboundDrawerVisible(true);
    outboundForm.resetFields();
  };

  // 处理入库单提交
  const handleInboundSubmit = (values: any) => {
    console.log('提交入库单:', values);
    message.success('入库单创建成功');
    setInboundDrawerVisible(false);
  };

  // 处理出库单提交
  const handleOutboundSubmit = (values: any) => {
    console.log('提交出库单:', values);
    message.success('出库单创建成功');
    setOutboundDrawerVisible(false);
  };

  // 统计数据
  const totalInventoryValue = mockInventoryItems.reduce((sum, item) => sum + item.totalValue, 0);

  // 处理库存分析按钮点击
  const handleInventoryAnalysis = () => {
    setInventoryAnalysisModalVisible(true);
    loadAnalysisData('overview');
  };

  // 处理库存盘点按钮点击
  const handleInventoryCheck = () => {
    setInventoryCheckModalVisible(true);
    setInventoryCheckData(mockInventoryCheckRecords);
  };

  // 加载分析数据
  const loadAnalysisData = (type: string) => {
    setAnalysisLoading(true);
    setAnalysisType(type);
    
    // 模拟API调用，实际项目中应该调用后端API
    setTimeout(() => {
      // 生成模拟数据
      let mockData: any = {};
      
      if (type === 'overview') {
        mockData = {
          totalMaterialCount: 324,
          totalWarehouseCount: 3,
          totalCategoryCount: 5,
          totalInventoryValue: 1256789.45,
          lowStockItemCount: 12,
          zeroStockItemCount: 5
        };
      } else if (type === 'value') {
        mockData = {
          totalInventoryValue: 1256789.45,
          warehouseValues: {
            1: { warehouseId: 1, warehouseCode: 'WH001', warehouseName: '主仓库', inventoryValue: 756432.12, percentageOfTotal: 60.19 },
            2: { warehouseId: 2, warehouseCode: 'WH002', warehouseName: '辅料仓库', inventoryValue: 324561.33, percentageOfTotal: 25.82 },
            3: { warehouseId: 3, warehouseCode: 'WH003', warehouseName: '成品仓库', inventoryValue: 175796.00, percentageOfTotal: 13.99 }
          },
          categoryValues: {
            '原料': 543210.45,
            '辅料': 321456.78,
            '半成品': 198765.22,
            '成品': 193357.00
          },
          topMaterialsByValue: [
            { materialId: 1, materialCode: 'M001', materialName: '钢板', inventoryValue: 125000.00, percentageOfTotal: 9.95 },
            { materialId: 2, materialCode: 'M002', materialName: '铜板', inventoryValue: 98000.00, percentageOfTotal: 7.80 },
            { materialId: 3, materialCode: 'M003', materialName: '铝材', inventoryValue: 76000.00, percentageOfTotal: 6.05 },
            // ... 更多数据
          ]
        };
      } else if (type === 'abc') {
        mockData = {
          totalItemCount: 324,
          totalInventoryValue: 1256789.45,
          categoryStats: [
            { category: 'A', itemCount: 32, totalValue: 879752.62, valuePercentage: 70.00 },
            { category: 'B', itemCount: 65, totalValue: 250113.78, valuePercentage: 19.90 },
            { category: 'C', itemCount: 227, totalValue: 126923.05, valuePercentage: 10.10 }
          ],
          aItems: [
            { materialId: 1, materialCode: 'M001', materialName: '钢板', inventoryValue: 125000.00, abcCategory: 'A', valuePercentage: 9.95 },
            // ... 更多数据
          ]
        };
      } else if (type === 'warnings') {
        mockData = [
          { materialId: 1, materialCode: 'M001', materialName: '钢板', currentQuantity: 10, minimumStockLevel: 20, stockLevel: '低库存', suggestedOrderQuantity: 30 },
          { materialId: 2, materialCode: 'M002', materialName: '铜板', currentQuantity: 0, minimumStockLevel: 15, stockLevel: '缺货', suggestedOrderQuantity: 30 },
          // ... 更多数据
        ];
      }
      
      setAnalysisData(mockData);
      setAnalysisLoading(false);
    }, 1000);
  };

  // 加载库存盘点数据
  const loadInventoryCheckData = () => {
    setInventoryCheckLoading(true);
    
    // 模拟API调用，实际项目中应该调用后端API
    setTimeout(() => {
      const mockData: InventoryCheckRecord[] = [
        { id: 'SC001', checkCode: 'SC-20230501-001', warehouseName: '原材料仓', checkDate: '2023-05-01', checkType: '全面盘点', status: '已完成', checkManager: '张三' },
        { id: 'SC002', checkCode: 'SC-20230520-002', warehouseName: '辅料仓', checkDate: '2023-05-20', checkType: '抽样盘点', status: '盘点中', checkManager: '李四' },
        { id: 'SC003', checkCode: 'SC-20230610-003', warehouseName: '原材料仓', checkDate: '2023-06-10', checkType: '临时盘点', status: '待盘点', checkManager: '王五' },
        { id: 'SC004', checkCode: 'SC-20230715-004', warehouseName: '成品仓', checkDate: '2023-07-15', checkType: '月末盘点', status: '已完成', checkManager: '张三' },
        { id: 'SC005', checkCode: 'SC-20230805-005', warehouseName: '半成品仓', checkDate: '2023-08-05', checkType: '全面盘点', status: '待盘点', checkManager: '李四' },
      ];
      
      setInventoryCheckData(mockData);
      setInventoryCheckLoading(false);
    }, 1000);
  };

  // 加载盘点明细数据
  const loadCheckItems = (checkId: string) => {
    setSelectedCheckId(checkId);
    setCheckItemsLoading(true);
    setCheckItemsModalVisible(true);
    
    // 模拟API调用，实际项目中应该调用后端API
    setTimeout(() => {
      const mockItems: InventoryCheckItem[] = [
        { id: 'I001', materialCode: 'M001', materialName: '钢板', systemQuantity: 100, actualQuantity: 98, differenceQuantity: -2, status: '已盘点' },
        { id: 'I002', materialCode: 'M002', materialName: '铜板', systemQuantity: 50, actualQuantity: 50, differenceQuantity: 0, status: '已盘点' },
        { id: 'I003', materialCode: 'M003', materialName: '铝材', systemQuantity: 75, actualQuantity: null, differenceQuantity: null, status: '待盘点' },
        // ... 更多数据
      ];
      
      setCheckItems(mockItems);
      setCheckItemsLoading(false);
    }, 1000);
  };

  // 创建新盘点单
  const createNewStockCheck = () => {
    message.success('已创建新的库存盘点单');
    loadInventoryCheckData();
  };

  // 渲染库存分析内容
  const renderAnalysisContent = () => {
    if (analysisLoading) {
      return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }
    
    if (!analysisData) {
      return <Empty description="暂无数据" />;
    }
    
    switch (analysisType) {
      case 'overview':
        return (
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card>
                <Statistic title="物料总数" value={analysisData.totalMaterialCount} suffix="种" />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="仓库数量" value={analysisData.totalWarehouseCount} suffix="个" />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="物料类别数" value={analysisData.totalCategoryCount} suffix="个" />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic 
                  title="库存总价值" 
                  value={analysisData.totalInventoryValue} 
                  precision={2} 
                  prefix="¥" 
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic 
                  title="低库存物料" 
                  value={analysisData.lowStockItemCount} 
                  suffix="种"
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic 
                  title="零库存物料" 
                  value={analysisData.zeroStockItemCount} 
                  suffix="种"
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
          </Row>
        );
      
      case 'value':
        return (
          <div>
            <Card title="库存价值分布 (按仓库)" style={{ marginBottom: 16 }}>
              <Table 
                dataSource={Object.values(analysisData.warehouseValues)}
                columns={[
                  { title: '仓库编码', dataIndex: 'warehouseCode' },
                  { title: '仓库名称', dataIndex: 'warehouseName' },
                  { 
                    title: '库存价值', 
                    dataIndex: 'inventoryValue',
                    render: (value) => `¥${value.toFixed(2)}`
                  },
                  { 
                    title: '占比', 
                    dataIndex: 'percentageOfTotal',
                    render: (value) => `${value.toFixed(2)}%`
                  },
                  {
                    title: '价值分布',
                    dataIndex: 'percentageOfTotal',
                    render: (value) => <Progress percent={value} size="small" />
                  }
                ]}
                pagination={false}
                rowKey="warehouseId"
              />
            </Card>
            
            <Card title="TOP 10高价值物料" style={{ marginBottom: 16 }}>
              <Table 
                dataSource={analysisData.topMaterialsByValue.slice(0, 10)}
                columns={[
                  { title: '物料编码', dataIndex: 'materialCode' },
                  { title: '物料名称', dataIndex: 'materialName' },
                  { 
                    title: '库存价值', 
                    dataIndex: 'inventoryValue',
                    render: (value) => `¥${value.toFixed(2)}`
                  },
                  { 
                    title: '占比', 
                    dataIndex: 'percentageOfTotal',
                    render: (value) => `${value.toFixed(2)}%`
                  }
                ]}
                pagination={false}
                rowKey="materialId"
              />
            </Card>
          </div>
        );
      
      case 'abc':
        return (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              {analysisData.categoryStats.map((stat: any) => (
                <Col span={8} key={stat.category}>
                  <Card>
                    <Statistic 
                      title={`${stat.category}类物料 (${stat.itemCount}种)`}
                      value={stat.valuePercentage}
                      precision={2}
                      suffix="%"
                      valueStyle={{ 
                        color: stat.category === 'A' ? '#52c41a' : 
                               stat.category === 'B' ? '#1890ff' : '#faad14' 
                      }}
                    />
                    <div>价值总计: ¥{stat.totalValue.toFixed(2)}</div>
                  </Card>
                </Col>
              ))}
            </Row>
            
            <Card title="ABC分类明细">
              <AntTabs defaultActiveKey="a">
                <TabPane tab="A类物料" key="a">
                  <Table 
                    dataSource={analysisData.aItems}
                    columns={[
                      { title: '物料编码', dataIndex: 'materialCode' },
                      { title: '物料名称', dataIndex: 'materialName' },
                      { 
                        title: '库存价值', 
                        dataIndex: 'inventoryValue',
                        render: (value) => `¥${value.toFixed(2)}`
                      },
                      { 
                        title: '占比', 
                        dataIndex: 'valuePercentage',
                        render: (value) => `${value.toFixed(2)}%`
                      },
                      {
                        title: '分类',
                        dataIndex: 'abcCategory',
                        render: (value) => <Tag color="green">{value}</Tag>
                      }
                    ]}
                    pagination={{ pageSize: 5 }}
                    rowKey="materialId"
                  />
                </TabPane>
                <TabPane tab="B类物料" key="b">
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Button type="primary" onClick={() => loadAnalysisData('abc')}>
                      加载B类物料数据
                    </Button>
                  </div>
                </TabPane>
                <TabPane tab="C类物料" key="c">
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Button type="primary" onClick={() => loadAnalysisData('abc')}>
                      加载C类物料数据
                    </Button>
                  </div>
                </TabPane>
              </AntTabs>
            </Card>
          </div>
        );
      
      case 'warnings':
        return (
          <Table 
            dataSource={analysisData}
            columns={[
              { title: '物料编码', dataIndex: 'materialCode' },
              { title: '物料名称', dataIndex: 'materialName' },
              { title: '当前库存', dataIndex: 'currentQuantity' },
              { title: '最小库存', dataIndex: 'minimumStockLevel' },
              { 
                title: '库存状态', 
                dataIndex: 'stockLevel',
                render: (value) => (
                  <Tag color={value === '缺货' ? 'red' : value === '低库存' ? 'orange' : 'blue'}>
                    {value}
                  </Tag>
                )
              },
              { title: '建议采购量', dataIndex: 'suggestedOrderQuantity' },
              {
                title: '操作',
                key: 'action',
                render: () => (
                  <Button size="small" type="primary">
                    生成采购单
                  </Button>
                )
              }
            ]}
            pagination={{ pageSize: 5 }}
            rowKey="materialId"
          />
        );
      
      default:
        return <Empty description="暂无数据" />;
    }
  };

  // 在其他函数之后添加处理查看库存明细的函数
  const handleViewInventoryDetail = (record: InventoryItem) => {
    setSelectedInventoryItem(record);
    setInventoryDetailModalVisible(true);
  };

  // 添加处理生成采购申请的函数
  const handleGeneratePurchaseRequest = (items: InventoryItem[]) => {
    // 将数据格式转换为采购申请所需格式
    const purchaseItems = items.map(item => ({
      materialId: item.id,
      materialCode: item.materialCode,
      materialName: item.materialName,
      specification: item.specification,
      quantity: Math.max(item.safetyStock - item.quantity, 0), // 补充至安全库存
      unit: item.unit,
      unitPrice: item.costPrice,
      totalAmount: Math.max(item.safetyStock - item.quantity, 0) * item.costPrice,
      expectedDeliveryDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
      remarks: `补充库存至安全库存(${item.safetyStock}${item.unit})以上`
    }));
    
    // 使用Context中的方法创建采购申请
    appContext.createPurchaseRequestFromInventory(purchaseItems);
  };

  // 处理库存预警的生成采购申请
  const handleLowStockWarningAction = () => {
    // 筛选所有低于安全库存的物料
    const lowStockItems = mockInventoryItems.filter(item => item.quantity < item.safetyStock);
    
    // 将数据格式转换为采购申请所需格式
    const purchaseItems = lowStockItems.map(item => ({
      materialId: item.id,
      materialCode: item.materialCode,
      materialName: item.materialName,
      specification: item.specification,
      quantity: Math.max(item.safetyStock - item.quantity, 0), // 补充至安全库存
      unit: item.unit,
      unitPrice: item.costPrice,
      totalAmount: Math.max(item.safetyStock - item.quantity, 0) * item.costPrice,
      expectedDeliveryDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
      remarks: `补充库存至安全库存(${item.safetyStock}${item.unit})以上`
    }));
    
    // 使用Context中的方法创建采购申请
    appContext.createPurchaseRequestFromInventory(purchaseItems);
  };

  // 处理提交采购申请
  const handleSubmitPurchaseRequest = () => {
    purchaseRequestForm.validateFields().then(values => {
      // 这里应该是调用API保存采购申请
      console.log('提交采购申请:', values);
      
      // 模拟API调用成功
      message.success('采购申请已成功提交！');
      setPurchaseRequestModalVisible(false);
      
      // 实际项目中应该刷新数据
    }).catch(errorInfo => {
      console.log('表单校验失败:', errorInfo);
    });
  };

  // 添加处理审核单据的函数
  const handleApproveOrder = (type: 'inbound' | 'outbound', id: string, approved: boolean) => {
    // 这里应该是调用API审核单据
    
    // 模拟API调用成功
    message.success(`${type === 'inbound' ? '入库单' : '出库单'} ${approved ? '审核通过' : '已驳回'}`);
    
    // 实际项目中应该刷新数据
    if (type === 'inbound') {
      setMockInboundOrders((prevOrders: InboundOrder[]) => 
        prevOrders.map((order: InboundOrder) => 
          order.id === id 
            ? { ...order, status: approved ? '已审核' : '已驳回', approvedBy: '当前用户', approvedAt: dayjs().format('YYYY-MM-DD HH:mm:ss') } 
            : order
        )
      );
    } else {
      setMockOutboundOrders((prevOrders: OutboundOrder[]) => 
        prevOrders.map((order: OutboundOrder) => 
          order.id === id 
            ? { ...order, status: approved ? '已审核' : '已驳回', approvedBy: '当前用户', approvedAt: dayjs().format('YYYY-MM-DD HH:mm:ss') } 
            : order
        )
      );
    }
  };

  // 添加低库存预警模态框状态
  const [lowStockModalVisible, setLowStockModalVisible] = useState(false);

  // 添加查看低库存预警明细的函数
  const handleViewLowStockDetails = () => {
    setLowStockModalVisible(true);
  };

  // 处理来自任务中心的参数
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get('action');
    const id = queryParams.get('id');
    const tab = queryParams.get('tab');
    
    // 如果是从任务中心跳转来的处理请求
    if (action === 'process' && id) {
      // 设置活动标签页
      if (tab === 'stockIn') {
        setActiveTab('2'); // 入库管理选项卡
        
        // 延迟执行，确保数据已加载
        setTimeout(() => {
          // 查找对应的入库单
          const targetInbound = mockInboundOrders.find(order => 
            order.orderNo === id || order.id === id
          );
          
          if (targetInbound) {
            // 如果是待检验状态，打开检验界面
            if (targetInbound.status === '待检验') {
              handleInspectInbound(targetInbound);
            } else {
              // 否则只显示详情
              message.info(`正在查看入库单: ${targetInbound.orderNo}`);
              showOrderDetails(targetInbound, '入库单详情');
            }
          } else {
            message.error('未找到指定的入库单');
          }
        }, 300);
      } else if (tab === 'stockOut') {
        setActiveTab('3'); // 出库管理选项卡
        
        // 同样的逻辑处理出库单
        setTimeout(() => {
          const targetOutbound = mockOutboundOrders.find(order => 
            order.orderNo === id || order.id === id
          );
          
          if (targetOutbound) {
            message.info(`正在查看出库单: ${targetOutbound.orderNo}`);
            showOrderDetails(targetOutbound, '出库单详情');
          } else {
            message.error('未找到指定的出库单');
          }
        }, 300);
      } else if (id === 'low-stock') {
        // 特殊处理低库存预警
        setActiveTab('1'); // 库存管理选项卡
        
        // 延迟执行查看低库存详情
        setTimeout(() => {
          handleViewLowStockDetails();
        }, 300);
      }
    }
  }, [location.search]); // 当URL参数变化时执行

  // 处理入库检验
  const handleInspectInbound = (record: InboundOrder) => {
    // 通过ID查找是否有相关任务
    const relatedTask = taskContext.getTaskByRelatedId(record.orderNo);
    
    // 查找模拟的入库检验项目
    const mockInspectionItems: InspectionItem[] = [
      {
        id: '1',
        materialCode: 'M001',
        materialName: '钢板',
        specification: '1.5mm*1220mm*2440mm',
        quantity: 20,
        unit: '张',
        status: '待检',
      },
      {
        id: '2',
        materialCode: 'M002',
        materialName: '角钢',
        specification: '50*50*5mm',
        quantity: 50,
        unit: '根',
        status: '待检',
      },
      {
        id: '3',
        materialCode: 'M003',
        materialName: '圆钢',
        specification: 'Φ20mm',
        quantity: 30,
        unit: '根',
        status: '待检',
      }
    ];
    
    // 设置检验状态
    setInspectionState({
      visible: true,
      inboundOrderId: record.id,
      items: mockInspectionItems
    });
  };

  // 更新检验项目
  const handleUpdateInspectionItem = (itemId: string, field: string, value: any) => {
    setInspectionState(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId 
          ? { ...item, [field]: value } 
          : item
      )
    }));
  };

  // 提交检验结果
  const handleSubmitInspection = () => {
    // 更新入库单状态
    const updatedInboundOrders = mockInboundOrders.map(order => 
      order.id === inspectionState.inboundOrderId
        ? { ...order, status: '已检验' }
        : order
    );
    
    // 更新检验项目状态
    const updatedItems = inspectionState.items.map(item => ({
      ...item,
      status: '已检验'
    }));
    
    // 更新状态
    setMockInboundOrders(updatedInboundOrders);
    setInspectionState(prev => ({
      ...prev,
      visible: false,
      items: updatedItems
    }));
    
    // 如果有相关任务，标记为完成
    const relatedTask = taskContext.getTaskByRelatedId(
      mockInboundOrders.find(o => o.id === inspectionState.inboundOrderId)?.orderNo || ''
    );
    
    if (relatedTask) {
      taskContext.completeTask(
        relatedTask.id, 
        '已完成',
        `入库检验完成，订单号: ${mockInboundOrders.find(o => o.id === inspectionState.inboundOrderId)?.orderNo}`
      );
      message.success('入库检验已完成，相关任务已更新');
    } else {
      message.success('入库检验已完成');
    }
  };

  // 渲染入库检验模态框
  const renderInspectionModal = () => {
    return (
      <Modal
        title="入库检验"
        open={inspectionState.visible}
        onCancel={() => setInspectionState(prev => ({ ...prev, visible: false }))}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setInspectionState(prev => ({ ...prev, visible: false }))}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmitInspection}>
            提交检验结果
          </Button>
        ]}
      >
        <Descriptions bordered column={3} size="small" style={{ marginBottom: 20 }}>
          <Descriptions.Item label="入库单号">
            {mockInboundOrders.find(o => o.id === inspectionState.inboundOrderId)?.orderNo}
          </Descriptions.Item>
          <Descriptions.Item label="入库类型">
            {mockInboundOrders.find(o => o.id === inspectionState.inboundOrderId)?.orderType}
          </Descriptions.Item>
          <Descriptions.Item label="仓库">
            {mockInboundOrders.find(o => o.id === inspectionState.inboundOrderId)?.warehouse}
          </Descriptions.Item>
          <Descriptions.Item label="创建人">
            {mockInboundOrders.find(o => o.id === inspectionState.inboundOrderId)?.createdBy}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={2}>
            {mockInboundOrders.find(o => o.id === inspectionState.inboundOrderId)?.createdAt}
          </Descriptions.Item>
        </Descriptions>
        
        <Table
          dataSource={inspectionState.items}
          rowKey="id"
          pagination={false}
          size="small"
          bordered
        >
          <Table.Column title="物料编码" dataIndex="materialCode" width={120} />
          <Table.Column title="物料名称" dataIndex="materialName" width={150} />
          <Table.Column title="规格" dataIndex="specification" width={180} />
          <Table.Column title="送检数量" dataIndex="quantity" width={100} />
          <Table.Column title="单位" dataIndex="unit" width={80} />
          <Table.Column
            title="合格数量"
            width={120}
            render={(_, record: InspectionItem) => (
              <InputNumber
                min={0}
                max={record.quantity}
                style={{ width: '100%' }}
                value={record.qualifiedQuantity}
                onChange={(value) => handleUpdateInspectionItem(record.id, 'qualifiedQuantity', value)}
              />
            )}
          />
          <Table.Column
            title="不合格数量"
            width={120}
            render={(_, record: InspectionItem) => (
              <InputNumber
                min={0}
                max={record.quantity}
                style={{ width: '100%' }}
                value={record.unqualifiedQuantity}
                onChange={(value) => handleUpdateInspectionItem(record.id, 'unqualifiedQuantity', value)}
              />
            )}
          />
          <Table.Column
            title="备注"
            render={(_, record: InspectionItem) => (
              <Input
                value={record.remarks}
                onChange={(e) => handleUpdateInspectionItem(record.id, 'remarks', e.target.value)}
                placeholder="请输入检验备注"
              />
            )}
          />
        </Table>
      </Modal>
    );
  };

  // 添加库存流水详情状态和功能
  const [transactionDetailVisible, setTransactionDetailVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<InventoryTransaction | null>(null);

  // 显示流水详情
  const handleViewTransaction = (record: InventoryTransaction) => {
    setSelectedTransaction(record);
    setTransactionDetailVisible(true);
  };

  // 流水详情模态框
  const renderTransactionDetailModal = () => {
    return (
      <Modal
        title="库存流水详情"
        open={transactionDetailVisible}
        onCancel={() => setTransactionDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setTransactionDetailVisible(false)}>关闭</Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />}>打印</Button>
        ]}
        width={700}
      >
        {selectedTransaction && (
          <>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="流水编号" span={2}>{selectedTransaction.transactionNo}</Descriptions.Item>
              <Descriptions.Item label="操作类型">{selectedTransaction.transactionType}</Descriptions.Item>
              <Descriptions.Item label="操作方向">
                <Tag color={selectedTransaction.direction === '入库' ? 'green' : 'red'}>
                  {selectedTransaction.direction}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="物料编码">{selectedTransaction.materialCode}</Descriptions.Item>
              <Descriptions.Item label="物料名称">{selectedTransaction.materialName}</Descriptions.Item>
              <Descriptions.Item label="仓库">{selectedTransaction.warehouse}</Descriptions.Item>
              <Descriptions.Item label="库位">{selectedTransaction.location}</Descriptions.Item>
              <Descriptions.Item label="批次号">{selectedTransaction.batch}</Descriptions.Item>
              <Descriptions.Item label="操作数量">
                {selectedTransaction.quantity} {selectedTransaction.unit}
              </Descriptions.Item>
              <Descriptions.Item label="操作前数量">{selectedTransaction.beforeQuantity} {selectedTransaction.unit}</Descriptions.Item>
              <Descriptions.Item label="操作后数量">{selectedTransaction.afterQuantity} {selectedTransaction.unit}</Descriptions.Item>
              <Descriptions.Item label="关联单号">{selectedTransaction.relatedOrderNo}</Descriptions.Item>
              <Descriptions.Item label="操作人">{selectedTransaction.operator}</Descriptions.Item>
              <Descriptions.Item label="操作时间">{selectedTransaction.createdAt}</Descriptions.Item>
            </Descriptions>
            
            <Divider orientation="left">流水轨迹</Divider>
            
            <Timeline mode="left">
              <Timeline.Item color="green" label={selectedTransaction.createdAt}>
                物料 {selectedTransaction.materialName} 
                {selectedTransaction.direction === '入库' ? '入库' : '出库'}
                {selectedTransaction.quantity} {selectedTransaction.unit}
              </Timeline.Item>
              {selectedTransaction.direction === '入库' ? (
                <Timeline.Item color="blue" label={dayjs(selectedTransaction.createdAt).add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')}>
                  系统自动完成库存更新
                </Timeline.Item>
              ) : (
                <Timeline.Item color="blue" label={dayjs(selectedTransaction.createdAt).add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')}>
                  系统自动完成库存扣减
                </Timeline.Item>
              )}
              <Timeline.Item color="red" label={dayjs(selectedTransaction.createdAt).add(2, 'hour').format('YYYY-MM-DD HH:mm:ss')}>
                财务系统自动生成{selectedTransaction.direction === '入库' ? '入库' : '出库'}凭证
              </Timeline.Item>
            </Timeline>
          </>
        )}
      </Modal>
    );
  };

  // 添加库存盘点相关状态
  const [stockCheckFormVisible, setStockCheckFormVisible] = useState(false);
  const [stockCheckForm] = Form.useForm();
  const [stockCheckDetailVisible, setStockCheckDetailVisible] = useState(false);
  const [selectedStockCheck, setSelectedStockCheck] = useState<InventoryCheckRecord | null>(null);
  const [stockCheckItems, setStockCheckItems] = useState<InventoryCheckItem[]>([]);
  const [stockCheckItemsLoading, setStockCheckItemsLoading] = useState(false);
  const [stockCheckResultModalVisible, setStockCheckResultModalVisible] = useState(false);
  const [selectedStockCheckItem, setSelectedStockCheckItem] = useState<InventoryCheckItem | null>(null);

  // 创建新盘点单
  const handleCreateStockCheck = () => {
    stockCheckForm.resetFields();
    stockCheckForm.setFieldsValue({
      checkDate: dayjs(),
      checkType: '全面盘点',
      warehouseName: '原材料仓',
      checkManager: '张三'
    });
    setStockCheckFormVisible(true);
  };

  // 提交新盘点单
  const handleSubmitStockCheck = () => {
    stockCheckForm.validateFields().then(values => {
      const newStockCheck: InventoryCheckRecord = {
        id: `SC${Date.now()}`,
        checkCode: `SC-${dayjs().format('YYYYMMDD')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        warehouseName: values.warehouseName,
        checkDate: values.checkDate.format('YYYY-MM-DD'),
        checkType: values.checkType,
        status: '待盘点',
        checkManager: values.checkManager
      };
      
      setMockInventoryCheckRecords([newStockCheck, ...mockInventoryCheckRecords]);
      setStockCheckFormVisible(false);
      message.success('盘点单创建成功');
    });
  };

  // 查看盘点单详情
  const handleViewStockCheck = (record: InventoryCheckRecord) => {
    setSelectedStockCheck(record);
    setStockCheckItemsLoading(true);
    
    // 模拟加载盘点项目
    setTimeout(() => {
      const items: InventoryCheckItem[] = [
        {
          id: '1',
          materialCode: 'M001',
          materialName: '钢板',
          systemQuantity: 200,
          actualQuantity: record.status === '已完成' ? 198 : null,
          differenceQuantity: record.status === '已完成' ? -2 : null,
          status: record.status === '已完成' ? '已盘点' : '待盘点'
        },
        {
          id: '2',
          materialCode: 'M002',
          materialName: '角钢',
          systemQuantity: 150,
          actualQuantity: record.status === '已完成' ? 150 : null,
          differenceQuantity: record.status === '已完成' ? 0 : null,
          status: record.status === '已完成' ? '已盘点' : '待盘点'
        },
        {
          id: '3',
          materialCode: 'M003',
          materialName: '圆钢',
          systemQuantity: 120,
          actualQuantity: record.status === '已完成' ? 118 : null,
          differenceQuantity: record.status === '已完成' ? -2 : null,
          status: record.status === '已完成' ? '已盘点' : '待盘点'
        },
        {
          id: '4',
          materialCode: 'M004',
          materialName: '焊条',
          systemQuantity: 500,
          actualQuantity: record.status === '已完成' ? 495 : null,
          differenceQuantity: record.status === '已完成' ? -5 : null,
          status: record.status === '已完成' ? '已盘点' : '待盘点'
        },
        {
          id: '5',
          materialCode: 'M005',
          materialName: '铝板',
          systemQuantity: 80,
          actualQuantity: record.status === '已完成' ? 82 : null,
          differenceQuantity: record.status === '已完成' ? 2 : null,
          status: record.status === '已完成' ? '已盘点' : '待盘点'
        }
      ];
      
      setStockCheckItems(items);
      setStockCheckItemsLoading(false);
      setStockCheckDetailVisible(true);
    }, 500);
  };

  // 开始盘点
  const handleStartStockCheck = (record: InventoryCheckRecord) => {
    // 更新盘点单状态
    const updatedRecords = mockInventoryCheckRecords.map((item: InventoryCheckRecord) => 
      item.id === record.id ? { ...item, status: '盘点中' } : item
    );
    setMockInventoryCheckRecords(updatedRecords);
    
    // 如果详情页面打开，更新选中的盘点单
    if (selectedStockCheck && selectedStockCheck.id === record.id) {
      setSelectedStockCheck({ ...record, status: '盘点中' });
    }
    
    message.success('盘点已开始，请按计划进行盘点工作');
  };

  // 录入盘点结果
  const handleEnterStockCheckResult = (item: InventoryCheckItem) => {
    setSelectedStockCheckItem(item);
    setStockCheckResultModalVisible(true);
  };

  // 提交盘点结果
  const handleSubmitStockCheckResult = (values: any) => {
    if (!selectedStockCheckItem) return;
    
    // 更新盘点项数据
    const actualQuantity = parseFloat(values.actualQuantity);
    const differenceQuantity = actualQuantity - selectedStockCheckItem.systemQuantity;
    
    const updatedItems = stockCheckItems.map(item => 
      item.id === selectedStockCheckItem.id 
        ? { 
            ...item, 
            actualQuantity, 
            differenceQuantity,
            status: '已盘点' 
          } 
        : item
    );
    
    setStockCheckItems(updatedItems);
    setStockCheckResultModalVisible(false);
    
    // 检查是否所有项目都已盘点
    const allChecked = updatedItems.every(item => item.status === '已盘点');
    
    if (allChecked && selectedStockCheck) {
      // 更新盘点单状态
      const updatedRecords = mockInventoryCheckRecords.map((record: InventoryCheckRecord) => 
        record.id === selectedStockCheck.id ? { ...record, status: '已完成' } : record
      );
      setMockInventoryCheckRecords(updatedRecords);
      setSelectedStockCheck({ ...selectedStockCheck, status: '已完成' });
      
      message.success('所有物料已盘点完成，盘点单已更新为已完成状态');
    } else {
      message.success('盘点结果已录入');
    }
  };

  // 完成盘点
  const handleCompleteStockCheck = (record: InventoryCheckRecord) => {
    // 更新盘点单状态
    const updatedRecords = mockInventoryCheckRecords.map((item: InventoryCheckRecord) => 
      item.id === record.id ? { ...item, status: '已完成' } : item
    );
    setMockInventoryCheckRecords(updatedRecords);
    
    // 如果详情页面打开，更新选中的盘点单和盘点项
    if (selectedStockCheck && selectedStockCheck.id === record.id) {
      setSelectedStockCheck({ ...record, status: '已完成' });
      
      // 自动设置所有项目为已盘点
      const updatedItems = stockCheckItems.map(item => {
        if (item.status !== '已盘点') {
          const actualQuantity = item.systemQuantity; // 假设实际数量等于系统数量
          return {
            ...item,
            actualQuantity,
            differenceQuantity: 0,
            status: '已盘点'
          };
        }
        return item;
      });
      
      setStockCheckItems(updatedItems);
    }
    
    message.success('盘点已完成');
  };

  // 渲染新建盘点表单
  const renderStockCheckFormDrawer = () => {
    return (
      <Drawer
        title="新建库存盘点单"
        open={stockCheckFormVisible}
        onClose={() => setStockCheckFormVisible(false)}
        width={500}
        extra={
          <Space>
            <Button onClick={() => setStockCheckFormVisible(false)}>取消</Button>
            <Button type="primary" onClick={handleSubmitStockCheck}>
              创建
            </Button>
          </Space>
        }
      >
        <Form
          form={stockCheckForm}
          layout="vertical"
        >
          <Form.Item
            name="checkType"
            label="盘点类型"
            rules={[{ required: true, message: '请选择盘点类型' }]}
          >
            <Select>
              <Select.Option value="全面盘点">全面盘点</Select.Option>
              <Select.Option value="抽样盘点">抽样盘点</Select.Option>
              <Select.Option value="月末盘点">月末盘点</Select.Option>
              <Select.Option value="临时盘点">临时盘点</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="warehouseName"
            label="盘点仓库"
            rules={[{ required: true, message: '请选择盘点仓库' }]}
          >
            <Select>
              <Select.Option value="原材料仓">原材料仓</Select.Option>
              <Select.Option value="成品仓">成品仓</Select.Option>
              <Select.Option value="半成品仓">半成品仓</Select.Option>
              <Select.Option value="辅料仓">辅料仓</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="checkDate"
            label="盘点日期"
            rules={[{ required: true, message: '请选择盘点日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="checkManager"
            label="盘点负责人"
            rules={[{ required: true, message: '请输入盘点负责人' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="remarks"
            label="备注"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Drawer>
    );
  };

  // 渲染盘点单详情
  const renderStockCheckDetailModal = () => {
    return (
      <Modal
        title={`盘点单详情：${selectedStockCheck?.checkCode}`}
        open={stockCheckDetailVisible}
        onCancel={() => setStockCheckDetailVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setStockCheckDetailVisible(false)}>
            关闭
          </Button>,
          selectedStockCheck?.status === '待盘点' && (
            <Button key="start" type="primary" onClick={() => handleStartStockCheck(selectedStockCheck)}>
              开始盘点
            </Button>
          ),
          selectedStockCheck?.status === '盘点中' && (
            <Button 
              key="complete" 
              type="primary" 
              onClick={() => handleCompleteStockCheck(selectedStockCheck)}
            >
              完成盘点
            </Button>
          )
        ]}
      >
        {selectedStockCheck && (
          <>
            <Descriptions bordered column={3} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="盘点单号">{selectedStockCheck.checkCode}</Descriptions.Item>
              <Descriptions.Item label="盘点类型">{selectedStockCheck.checkType}</Descriptions.Item>
              <Descriptions.Item label="仓库">{selectedStockCheck.warehouseName}</Descriptions.Item>
              <Descriptions.Item label="盘点日期">{selectedStockCheck.checkDate}</Descriptions.Item>
              <Descriptions.Item label="盘点负责人">{selectedStockCheck.checkManager}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  selectedStockCheck.status === '待盘点' ? 'default' :
                  selectedStockCheck.status === '盘点中' ? 'processing' :
                  selectedStockCheck.status === '已完成' ? 'success' : 'default'
                }>
                  {selectedStockCheck.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            
            <Spin spinning={stockCheckItemsLoading}>
              <Table
                dataSource={stockCheckItems}
                rowKey="id"
                pagination={false}
                bordered
                size="small"
              >
                <Table.Column title="物料编码" dataIndex="materialCode" />
                <Table.Column title="物料名称" dataIndex="materialName" />
                <Table.Column title="系统数量" dataIndex="systemQuantity" />
                <Table.Column 
                  title="实际数量" 
                  dataIndex="actualQuantity" 
                  render={(text, record: InventoryCheckItem) => {
                    if (record.actualQuantity !== null) {
                      return record.actualQuantity;
                    }
                    return '-';
                  }}
                />
                <Table.Column 
                  title="差异数量" 
                  dataIndex="differenceQuantity"
                  render={(text, record: InventoryCheckItem) => {
                    if (record.differenceQuantity !== null) {
                      const isNegative = record.differenceQuantity < 0;
                      const style = { color: isNegative ? '#f5222d' : (record.differenceQuantity > 0 ? '#52c41a' : '') };
                      return <span style={style}>{record.differenceQuantity}</span>;
                    }
                    return '-';
                  }}  
                />
                <Table.Column 
                  title="状态" 
                  dataIndex="status"
                  render={(text) => (
                    <Tag color={text === '已盘点' ? 'success' : 'default'}>{text}</Tag>
                  )}  
                />
                <Table.Column 
                  title="操作" 
                  key="action"
                  render={(_, record: InventoryCheckItem) => (
                    <Space size="small">
                      {(selectedStockCheck?.status === '盘点中' && record.status !== '已盘点') && (
                        <Button 
                          type="link" 
                          size="small"
                          onClick={() => handleEnterStockCheckResult(record)}
                        >
                          录入结果
                        </Button>
                      )}
                    </Space>
                  )}  
                />
              </Table>
            </Spin>
          </>
        )}
      </Modal>
    );
  };

  // 渲染盘点结果录入模态框
  const renderStockCheckResultModal = () => {
    return (
      <Modal
        title="录入盘点结果"
        open={stockCheckResultModalVisible}
        onCancel={() => setStockCheckResultModalVisible(false)}
        onOk={() => {
          const form = document.getElementById('stockCheckResultForm') as HTMLFormElement;
          if (form) form.submit();
        }}
      >
        {selectedStockCheckItem && (
          <Form
            id="stockCheckResultForm"
            onFinish={handleSubmitStockCheckResult}
            layout="vertical"
            initialValues={{
              actualQuantity: selectedStockCheckItem.systemQuantity
            }}
          >
            <Descriptions bordered column={1} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="物料编码">{selectedStockCheckItem.materialCode}</Descriptions.Item>
              <Descriptions.Item label="物料名称">{selectedStockCheckItem.materialName}</Descriptions.Item>
              <Descriptions.Item label="系统数量">{selectedStockCheckItem.systemQuantity}</Descriptions.Item>
            </Descriptions>
            
            <Form.Item
              name="actualQuantity"
              label="实际盘点数量"
              rules={[
                { required: true, message: '请输入实际盘点数量' },
                { type: 'number', min: 0, message: '数量不能小于0' }
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="remarks"
              label="备注"
            >
              <Input.TextArea rows={3} placeholder="请输入盘点备注，如有差异请说明原因" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    );
  };

  // 库存盘点表格列定义
  const stockCheckColumns: ColumnsType<InventoryCheckRecord> = [
    {
      title: '盘点单号',
      dataIndex: 'checkCode',
      key: 'checkCode',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '盘点仓库',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
    },
    {
      title: '盘点类型',
      dataIndex: 'checkType',
      key: 'checkType',
    },
    {
      title: '盘点日期',
      dataIndex: 'checkDate',
      key: 'checkDate',
    },
    {
      title: '盘点人员',
      dataIndex: 'checkManager',
      key: 'checkManager',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === '已完成') color = 'success';
        else if (status === '盘点中') color = 'processing';
        else if (status === '待盘点') color = 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => handleViewStockCheck(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  // 处理库存盘点页面工具栏按钮
  const handleInventoryCheckTools = () => {
    return (
      <>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateStockCheck}>
          新建盘点单
        </Button>
        <Button icon={<ExportOutlined />}>导出</Button>
        <Button icon={<PrinterOutlined />}>打印</Button>
      </>
    );
  };

  // 添加库存盘点记录状态
  const [mockInventoryCheckRecords, setMockInventoryCheckRecords] = useState<InventoryCheckRecord[]>([
    { id: 'SC001', checkCode: 'SC-20230501-001', warehouseName: '原材料仓', checkDate: '2023-05-01', checkType: '全面盘点', status: '已完成', checkManager: '张三' },
    { id: 'SC002', checkCode: 'SC-20230520-002', warehouseName: '辅料仓', checkDate: '2023-05-20', checkType: '抽样盘点', status: '盘点中', checkManager: '李四' },
    { id: 'SC003', checkCode: 'SC-20230610-003', warehouseName: '原材料仓', checkDate: '2023-06-10', checkType: '临时盘点', status: '待盘点', checkManager: '王五' },
    { id: 'SC004', checkCode: 'SC-20230715-004', warehouseName: '成品仓', checkDate: '2023-07-15', checkType: '月末盘点', status: '已完成', checkManager: '张三' },
    { id: 'SC005', checkCode: 'SC-20230805-005', warehouseName: '半成品仓', checkDate: '2023-08-05', checkType: '全面盘点', status: '待盘点', checkManager: '李四' },
  ]);

  return (
    <div className="warehouse-page">
      <Title level={2}>仓库管理</Title>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="库存总价值"
              value={totalInventoryValue}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="¥"
              suffix={<Tooltip title="库存物料总价值"><InfoCircleOutlined /></Tooltip>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="物料SKU数量"
              value={mockInventoryItems.length}
              valueStyle={{ color: '#1890ff' }}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="库存不足预警"
              value={lowStockCount}
              valueStyle={{ color: lowStockCount > 0 ? '#ff4d4f' : '#52c41a' }}
              prefix={<WarningOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Button 
                type="primary" 
                size="small" 
                danger
                onClick={handleViewLowStockDetails}
                disabled={lowStockCount === 0}
              >
                查看明细
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待审核单据"
              value={pendingInboundCount + pendingOutboundCount}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Button 
                type="primary" 
                size="small" 
                onClick={() => setPendingOrdersModalVisible(true)}
              >
                立即处理
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 主内容区 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="库存查询" key="1">
            <div style={{ marginBottom: 16 }}>
              <Row gutter={16} align="middle">
                <Col xs={24} sm={14} md={16}>
                  <Space>
                    <Input
                      placeholder="搜索物料编码/名称/规格"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 250 }}
                      prefix={<SearchOutlined />}
                      allowClear
                    />
                    <Select
                      placeholder="选择仓库"
                      style={{ width: 140 }}
                      value={selectedWarehouse}
                      onChange={setSelectedWarehouse}
                      allowClear
                    >
                      <Option value="主仓库">主仓库</Option>
                      <Option value="辅料仓库">辅料仓库</Option>
                      <Option value="成品仓库">成品仓库</Option>
                    </Select>
                    <Select
                      placeholder="物料类别"
                      style={{ width: 140 }}
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      allowClear
                    >
                      <Option value="原料">原料</Option>
                      <Option value="辅料">辅料</Option>
                      <Option value="成品">成品</Option>
                      <Option value="半成品">半成品</Option>
                    </Select>
                    <Tooltip title="重置筛选条件">
                      <Button 
                        icon={<ReloadOutlined />} 
                        onClick={() => {
                          setSearchText('');
                          setSelectedWarehouse('');
                          setSelectedCategory('');
                        }}
                      />
                    </Tooltip>
                  </Space>
                </Col>
                <Col xs={24} sm={10} md={8} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button icon={<ExportOutlined />}>导出</Button>
                    <Button icon={<PrinterOutlined />}>打印</Button>
                    <Button icon={<BarChartOutlined />} onClick={handleInventoryAnalysis}>库存分析</Button>
                    <Button icon={<ImportOutlined />} onClick={handleInventoryCheck}>库存盘点</Button>
                  </Space>
                </Col>
              </Row>
            </div>

            <Alert
              message="库存预警通知"
              description={`系统检测到${lowStockCount}种物料低于安全库存，请及时处理。`}
              type="warning"
              showIcon
              style={{ marginBottom: 16, display: lowStockCount > 0 ? 'block' : 'none' }}
              action={
                <Space>
                  <Button size="small" onClick={handleViewLowStockDetails}>
                    查看明细
                  </Button>
                  <Button size="small" type="primary" onClick={handleLowStockWarningAction}>
                    生成采购申请
                  </Button>
                </Space>
              }
            />

            <Table
              columns={inventoryColumns}
              dataSource={filteredInventory}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="middle"
              scroll={{ x: 1300 }}
            />
          </TabPane>

          <TabPane tab="入库管理" key="2">
            <div style={{ marginBottom: 16 }}>
              <Row gutter={16} align="middle">
                <Col xs={24} sm={14} md={16}>
                  <Space>
                    <Input
                      placeholder="搜索入库单号/来源单号"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 250 }}
                      prefix={<SearchOutlined />}
                      allowClear
                    />
                    <RangePicker 
                      onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])} 
                      style={{ width: 240 }}
                    />
                    <Tooltip title="重置筛选条件">
                      <Button 
                        icon={<ReloadOutlined />} 
                        onClick={() => {
                          setSearchText('');
                          setDateRange(null);
                        }}
                      />
                    </Tooltip>
                  </Space>
                </Col>
                <Col xs={24} sm={10} md={8} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateInbound}>
                      新建入库单
                    </Button>
                    <Button icon={<ExportOutlined />}>导出</Button>
                    <Button icon={<PrinterOutlined />}>打印</Button>
                  </Space>
                </Col>
              </Row>
            </div>

            <Table
              columns={inboundColumns}
              dataSource={filteredInboundOrders}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="middle"
              scroll={{ x: 1300 }}
            />
          </TabPane>

          <TabPane tab="出库管理" key="3">
            <div style={{ marginBottom: 16 }}>
              <Row gutter={16} align="middle">
                <Col xs={24} sm={14} md={16}>
                  <Space>
                    <Input
                      placeholder="搜索出库单号/目标单号"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 250 }}
                      prefix={<SearchOutlined />}
                      allowClear
                    />
                    <RangePicker 
                      onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])} 
                      style={{ width: 240 }}
                    />
                    <Tooltip title="重置筛选条件">
                      <Button 
                        icon={<ReloadOutlined />} 
                        onClick={() => {
                          setSearchText('');
                          setDateRange(null);
                        }}
                      />
                    </Tooltip>
                  </Space>
                </Col>
                <Col xs={24} sm={10} md={8} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateOutbound}>
                      新建出库单
                    </Button>
                    <Button icon={<ExportOutlined />}>导出</Button>
                    <Button icon={<PrinterOutlined />}>打印</Button>
                  </Space>
                </Col>
              </Row>
            </div>

            <Table
              columns={outboundColumns}
              dataSource={filteredOutboundOrders}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="middle"
              scroll={{ x: 1300 }}
            />
          </TabPane>

          <TabPane tab="库存流水" key="4">
            <div style={{ marginBottom: 16 }}>
              <Row gutter={16} align="middle">
                <Col xs={24} sm={14} md={16}>
                  <Space>
                    <Input
                      placeholder="搜索流水号/物料编码/名称"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 250 }}
                      prefix={<SearchOutlined />}
                      allowClear
                    />
                    <RangePicker 
                      onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])} 
                      style={{ width: 240 }}
                    />
                    <Select
                      placeholder="业务类型"
                      style={{ width: 140 }}
                      allowClear
                    >
                      <Option value="采购入库">采购入库</Option>
                      <Option value="销售出库">销售出库</Option>
                      <Option value="生产入库">生产入库</Option>
                      <Option value="生产领料">生产领料</Option>
                      <Option value="委外入库">委外入库</Option>
                      <Option value="委外发料">委外发料</Option>
                      <Option value="库存调整">库存调整</Option>
                    </Select>
                    <Tooltip title="重置筛选条件">
                      <Button 
                        icon={<ReloadOutlined />} 
                        onClick={() => {
                          setSearchText('');
                          setDateRange(null);
                        }}
                      />
                    </Tooltip>
                  </Space>
                </Col>
                <Col xs={24} sm={10} md={8} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button icon={<ExportOutlined />}>导出</Button>
                    <Button icon={<PrinterOutlined />}>打印</Button>
                    <Button icon={<DownloadOutlined />}>导出报表</Button>
                  </Space>
                </Col>
              </Row>
            </div>

            <Table
              columns={transactionColumns}
              dataSource={filteredTransactions}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="middle"
              scroll={{ x: 1300 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 入库单抽屉 */}
      <Drawer
        title="新建入库单"
        width={720}
        onClose={() => setInboundDrawerVisible(false)}
        open={inboundDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button onClick={() => setInboundDrawerVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => inboundForm.submit()}>
              提交
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={inboundForm} onFinish={handleInboundSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="orderType"
                label="入库类型"
                rules={[{ required: true, message: '请选择入库类型' }]}
              >
                <Select placeholder="请选择入库类型">
                  <Option value="采购入库">采购入库</Option>
                  <Option value="生产入库">生产入库</Option>
                  <Option value="委外入库">委外入库</Option>
                  <Option value="其他入库">其他入库</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="warehouse"
                label="入库仓库"
                rules={[{ required: true, message: '请选择入库仓库' }]}
              >
                <Select placeholder="请选择入库仓库">
                  <Option value="主仓库">主仓库</Option>
                  <Option value="辅料仓库">辅料仓库</Option>
                  <Option value="成品仓库">成品仓库</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sourceType"
                label="来源类型"
                rules={[{ required: true, message: '请选择来源类型' }]}
              >
                <Select placeholder="请选择来源类型">
                  <Option value="采购订单">采购订单</Option>
                  <Option value="生产订单">生产订单</Option>
                  <Option value="委外加工单">委外加工单</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sourceOrderNo"
                label="来源单号"
                rules={[{ required: true, message: '请输入来源单号' }]}
              >
                <Input placeholder="请输入来源单号" />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">物料明细</Divider>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={16} key={key} style={{ marginBottom: 16 }}>
                    <Col span={7}>
                      <Form.Item
                        {...restField}
                        name={[name, 'materialCode']}
                        rules={[{ required: true, message: '请选择物料' }]}
                      >
                        <Select placeholder="选择物料">
                          {mockInventoryItems.map(item => (
                            <Option key={item.id} value={item.materialCode}>
                              {item.materialCode} - {item.materialName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        name={[name, 'batch']}
                        rules={[{ required: true, message: '请输入批次号' }]}
                      >
                        <Input placeholder="批次号" />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        rules={[{ required: true, message: '请输入数量' }]}
                      >
                        <InputNumber placeholder="数量" style={{ width: '100%' }} min={1} />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        name={[name, 'location']}
                        rules={[{ required: true, message: '请输入库位' }]}
                      >
                        <Input placeholder="库位" />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button danger onClick={() => remove(name)} icon={<DeleteOutlined />} />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加物料
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item name="remarks" label="备注">
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Drawer>

      {/* 出库单抽屉 */}
      <Drawer
        title="新建出库单"
        width={720}
        onClose={() => setOutboundDrawerVisible(false)}
        open={outboundDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button onClick={() => setOutboundDrawerVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => outboundForm.submit()}>
              提交
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={outboundForm} onFinish={handleOutboundSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="orderType"
                label="出库类型"
                rules={[{ required: true, message: '请选择出库类型' }]}
              >
                <Select placeholder="请选择出库类型">
                  <Option value="销售出库">销售出库</Option>
                  <Option value="生产领料">生产领料</Option>
                  <Option value="委外发料">委外发料</Option>
                  <Option value="其他出库">其他出库</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="warehouse"
                label="出库仓库"
                rules={[{ required: true, message: '请选择出库仓库' }]}
              >
                <Select placeholder="请选择出库仓库">
                  <Option value="主仓库">主仓库</Option>
                  <Option value="辅料仓库">辅料仓库</Option>
                  <Option value="成品仓库">成品仓库</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="destinationType"
                label="目标类型"
                rules={[{ required: true, message: '请选择目标类型' }]}
              >
                <Select placeholder="请选择目标类型">
                  <Option value="销售订单">销售订单</Option>
                  <Option value="生产订单">生产订单</Option>
                  <Option value="委外加工单">委外加工单</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="destinationOrderNo"
                label="目标单号"
                rules={[{ required: true, message: '请输入目标单号' }]}
              >
                <Input placeholder="请输入目标单号" />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">物料明细</Divider>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={16} key={key} style={{ marginBottom: 16 }}>
                    <Col span={7}>
                      <Form.Item
                        {...restField}
                        name={[name, 'materialCode']}
                        rules={[{ required: true, message: '请选择物料' }]}
                      >
                        <Select placeholder="选择物料">
                          {mockInventoryItems.map(item => (
                            <Option key={item.id} value={item.materialCode}>
                              {item.materialCode} - {item.materialName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        name={[name, 'batch']}
                        rules={[{ required: true, message: '请选择批次' }]}
                      >
                        <Select placeholder="选择批次">
                          <Option value="B230915-01">B230915-01</Option>
                          <Option value="B230910-02">B230910-02</Option>
                          <Option value="B230901-01">B230901-01</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        rules={[{ required: true, message: '请输入数量' }]}
                      >
                        <InputNumber placeholder="数量" style={{ width: '100%' }} min={1} />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        name={[name, 'location']}
                        rules={[{ required: true, message: '请输入库位' }]}
                      >
                        <Input placeholder="库位" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button danger onClick={() => remove(name)} icon={<DeleteOutlined />} />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加物料
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item name="remarks" label="备注">
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Drawer>

      {/* 详情模态框 */}
      <Modal
        title={detailModalTitle}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />}>
            打印
          </Button>,
        ]}
        width={800}
      >
        {selectedOrderDetails && (
          <div>
            <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
              <Descriptions.Item label="单据编号">{selectedOrderDetails.orderNo}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedOrderDetails.status === '已完成' ? 'success' : 'warning'}>
                  {selectedOrderDetails.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="单据类型">{selectedOrderDetails.orderType}</Descriptions.Item>
              <Descriptions.Item label="创建人">{selectedOrderDetails.createdBy}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedOrderDetails.createdAt}</Descriptions.Item>
              <Descriptions.Item label="仓库">{selectedOrderDetails.warehouse}</Descriptions.Item>
              {selectedOrderDetails.sourceOrderNo && (
                <Descriptions.Item label="来源单据">{selectedOrderDetails.sourceOrderNo}</Descriptions.Item>
              )}
              {selectedOrderDetails.destinationOrderNo && (
                <Descriptions.Item label="目标单据">{selectedOrderDetails.destinationOrderNo}</Descriptions.Item>
              )}
              {selectedOrderDetails.approvedBy && (
                <Descriptions.Item label="审核人">{selectedOrderDetails.approvedBy}</Descriptions.Item>
              )}
              {selectedOrderDetails.approvedAt && (
                <Descriptions.Item label="审核时间">{selectedOrderDetails.approvedAt}</Descriptions.Item>
              )}
              <Descriptions.Item label="备注" span={3}>{selectedOrderDetails.remarks || '-'}</Descriptions.Item>
            </Descriptions>

            <Divider>物料明细</Divider>

            <List
              bordered
              dataSource={[
                { materialCode: 'CP-001', materialName: '船板Q235B', specification: '10mm×1500mm×6000mm', batch: 'B230915-01', quantity: 20, unit: '吨', location: 'A-01-01' },
                { materialCode: 'HD-001', materialName: '焊条E4303', specification: 'Φ3.2mm', batch: 'B230901-01', quantity: 50, unit: '箱', location: 'B-01-03' },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${item.materialCode} - ${item.materialName}`}
                    description={`规格: ${item.specification} | 批次: ${item.batch} | 库位: ${item.location}`}
                  />
                  <div>
                    <Tag color="blue">{`${item.quantity} ${item.unit}`}</Tag>
                  </div>
                </List.Item>
              )}
            />

            <Divider>操作记录</Divider>

            <List
              size="small"
              bordered
              dataSource={[
                { action: '创建单据', operator: selectedOrderDetails.createdBy, time: selectedOrderDetails.createdAt },
                { action: '审核通过', operator: selectedOrderDetails.approvedBy, time: selectedOrderDetails.approvedAt },
              ].filter(item => item.operator)}
              renderItem={(item) => (
                <List.Item>
                  <div>{item.action}</div>
                  <div>
                    <small>{`${item.operator} - ${item.time}`}</small>
                  </div>
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>

      {/* 库存分析模态框 */}
      <Modal
        title="库存分析"
        visible={inventoryAnalysisModalVisible}
        width={1000}
        onCancel={() => setInventoryAnalysisModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setInventoryAnalysisModalVisible(false)}>
            关闭
          </Button>,
          <Button
            key="export"
            type="primary"
            icon={<DownloadOutlined />}
          >
            导出分析报告
          </Button>
        ]}
      >
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Radio.Group 
              value={analysisType} 
              onChange={e => loadAnalysisData(e.target.value)}
              optionType="button" 
              buttonStyle="solid"
            >
              <Radio.Button value="overview">库存概览</Radio.Button>
              <Radio.Button value="value">库存价值分析</Radio.Button>
              <Radio.Button value="abc">ABC分类分析</Radio.Button>
              <Radio.Button value="warnings">库存预警</Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={24}>
            <Card>
              {renderAnalysisContent()}
            </Card>
          </Col>
        </Row>
      </Modal>
      
      {/* 库存盘点模态框 */}
      <Modal
        title="库存盘点管理"
        open={inventoryCheckModalVisible}
        width={1000}
        onCancel={() => setInventoryCheckModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setInventoryCheckModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {inventoryCheckLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <Row justify="space-between">
                <Col>
                  <Space>
                    {handleInventoryCheckTools()}
                  </Space>
                </Col>
                <Col>
                  <Input.Search
                    placeholder="搜索盘点单号/仓库/类型"
                    style={{ width: 250 }}
                    onSearch={value => console.log(value)}
                  />
                </Col>
              </Row>
            </div>
            <Table 
              dataSource={inventoryCheckData}
              columns={stockCheckColumns}
              pagination={{ pageSize: 5 }}
              rowKey="id"
            />
          </>
        )}
      </Modal>
      
      {/* 盘点明细模态框 */}
      <Modal
        title="盘点明细"
        visible={checkItemsModalVisible}
        width={1000}
        onCancel={() => setCheckItemsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCheckItemsModalVisible(false)}>
            关闭
          </Button>,
          <Button key="export" icon={<DownloadOutlined />}>
            导出明细
          </Button>,
          <Button key="print" icon={<PrinterOutlined />}>
            打印
          </Button>
        ]}
      >
        {checkItemsLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <div>
            <Alert
              message="盘点状态"
              description={`共 ${checkItems.length} 个物料，已盘点 ${checkItems.filter(item => item.status === '已盘点').length} 个，完成率 ${Math.round(checkItems.filter(item => item.status === '已盘点').length / checkItems.length * 100)}%`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Table 
              dataSource={checkItems}
              columns={[
                { title: '物料编码', dataIndex: 'materialCode' },
                { title: '物料名称', dataIndex: 'materialName' },
                { title: '系统库存', dataIndex: 'systemQuantity' },
                { 
                  title: '实际库存', 
                  dataIndex: 'actualQuantity',
                  render: (value) => value !== null ? value : '未盘点'
                },
                { 
                  title: '差异数量', 
                  dataIndex: 'differenceQuantity',
                  render: (value, record) => {
                    if (value === null) return '-';
                    return (
                      <span style={{ color: value < 0 ? 'red' : value > 0 ? 'green' : 'inherit' }}>
                        {value > 0 ? `+${value}` : value}
                      </span>
                    );
                  }
                },
                { 
                  title: '状态', 
                  dataIndex: 'status',
                  render: (value) => (
                    <Tag color={value === '已盘点' ? 'green' : 'default'}>
                      {value}
                    </Tag>
                  )
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (_, record) => (
                    <Space>
                      {record.status === '待盘点' ? (
                        <Button size="small" type="primary">
                          录入结果
                        </Button>
                      ) : (
                        <Button size="small">
                          查看详情
                        </Button>
                      )}
                    </Space>
                  )
                }
              ]}
              pagination={{ pageSize: 5 }}
              rowKey="id"
            />
          </div>
        )}
      </Modal>

      {/* 库存明细模态框 */}
      <Modal
        title="库存明细"
        visible={inventoryDetailModalVisible}
        width={700}
        onCancel={() => setInventoryDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setInventoryDetailModalVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="history" 
            type="primary"
            onClick={() => {
              setInventoryDetailModalVisible(false);
              // 这里可以添加查看历史记录的逻辑
              message.info('正在加载历史记录...');
            }}
          >
            查看历史记录
          </Button>
        ]}
      >
        {selectedInventoryItem && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="物料编码">{selectedInventoryItem.materialCode}</Descriptions.Item>
            <Descriptions.Item label="物料名称">{selectedInventoryItem.materialName}</Descriptions.Item>
            <Descriptions.Item label="规格型号">{selectedInventoryItem.specification}</Descriptions.Item>
            <Descriptions.Item label="物料类别">{selectedInventoryItem.category}</Descriptions.Item>
            <Descriptions.Item label="仓库">{selectedInventoryItem.warehouse}</Descriptions.Item>
            <Descriptions.Item label="库位">{selectedInventoryItem.location}</Descriptions.Item>
            <Descriptions.Item label="批次">{selectedInventoryItem.batch}</Descriptions.Item>
            <Descriptions.Item label="当前库存">
              <span style={{ 
                color: selectedInventoryItem.quantity < selectedInventoryItem.safetyStock ? 'red' : 'green',
                fontWeight: 'bold'
              }}>
                {selectedInventoryItem.quantity} {selectedInventoryItem.unit}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="安全库存">{selectedInventoryItem.safetyStock} {selectedInventoryItem.unit}</Descriptions.Item>
            <Descriptions.Item label="成本单价">¥{selectedInventoryItem.costPrice.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="库存金额">¥{selectedInventoryItem.totalValue.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="最后更新时间">{selectedInventoryItem.lastUpdated}</Descriptions.Item>
            <Descriptions.Item label="库存状态" span={2}>
              <Tag color={selectedInventoryItem.quantity < selectedInventoryItem.safetyStock ? 'red' : 'green'}>
                {selectedInventoryItem.quantity < selectedInventoryItem.safetyStock ? '低于安全库存' : '库存正常'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 采购申请模态框 */}
      <Modal
        title="生成采购申请"
        visible={purchaseRequestModalVisible}
        width={1000}
        onCancel={() => setPurchaseRequestModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setPurchaseRequestModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleSubmitPurchaseRequest}
          >
            提交采购申请
          </Button>
        ]}
      >
        <Form
          form={purchaseRequestForm}
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
            <Col span={16}>
              <Form.Item
                name="remarks"
                label="备注"
              >
                <Input.TextArea rows={1} />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">申请物料明细</Divider>
          
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                <Table
                  dataSource={fields.map(field => {
                    return {
                      ...purchaseRequestForm.getFieldValue(['items', field.name]),
                      fieldKey: field.key,
                      key: field.key
                    };
                  })}
                  columns={[
                    {
                      title: '物料编码',
                      dataIndex: 'materialCode',
                      key: 'materialCode',
                      width: 120
                    },
                    {
                      title: '物料名称',
                      dataIndex: 'materialName',
                      key: 'materialName',
                      width: 120
                    },
                    {
                      title: '规格型号',
                      dataIndex: 'specification',
                      key: 'specification',
                      width: 120
                    },
                    {
                      title: '申请数量',
                      dataIndex: 'quantity',
                      key: 'quantity',
                      width: 120,
                      render: (text, record, index) => (
                        <Form.Item
                          name={[index, 'quantity']}
                          rules={[{ required: true, message: '请输入数量' }]}
                          noStyle
                        >
                          <InputNumber 
                            min={1} 
                            style={{ width: 100 }} 
                            onChange={(value) => {
                              // 当数量变化时，更新总金额
                              const price = purchaseRequestForm.getFieldValue(['items', index, 'expectedPrice']) || 0;
                              purchaseRequestForm.setFieldsValue({
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
                    {
                      title: '单位',
                      dataIndex: 'unit',
                      key: 'unit',
                      width: 80
                    },
                    {
                      title: '预计单价',
                      dataIndex: 'expectedPrice',
                      key: 'expectedPrice',
                      width: 120,
                      render: (text, record, index) => (
                        <Form.Item
                          name={[index, 'expectedPrice']}
                          rules={[{ required: true, message: '请输入单价' }]}
                          noStyle
                        >
                          <InputNumber 
                            min={0} 
                            precision={2} 
                            style={{ width: 100 }} 
                            onChange={(value) => {
                              // 当单价变化时，更新总金额
                              const quantity = purchaseRequestForm.getFieldValue(['items', index, 'quantity']) || 0;
                              purchaseRequestForm.setFieldsValue({
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
                      title: '预计金额',
                      dataIndex: 'totalAmount',
                      key: 'totalAmount',
                      width: 120,
                      render: (text, record, index) => (
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
                      title: '备注',
                      dataIndex: 'remarks',
                      key: 'remarks',
                      render: (text, record, index) => (
                        <Form.Item
                          name={[index, 'remarks']}
                          noStyle
                        >
                          <Input style={{ width: 150 }} />
                        </Form.Item>
                      )
                    },
                    {
                      title: '操作',
                      key: 'action',
                      render: (_, record, index) => (
                        <Button 
                          type="link" 
                          danger 
                          onClick={() => remove(index)}
                        >
                          删除
                        </Button>
                      )
                    }
                  ]}
                  pagination={false}
                />
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '100%', marginTop: 16 }}
                  icon={<PlusOutlined />}
                >
                  添加物料
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* 待审核单据模态框 */}
      <Modal
        title="待审核单据"
        visible={pendingOrdersModalVisible}
        width={1000}
        onCancel={() => setPendingOrdersModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPendingOrdersModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        <Tabs 
          activeKey={pendingOrdersActiveTab} 
          onChange={setPendingOrdersActiveTab}
        >
          <TabPane tab={`待审核入库单 (${pendingInboundCount})`} key="1">
            <Table
              dataSource={mockInboundOrders.filter(order => order.status === '待审核')}
              columns={[
                { title: '单号', dataIndex: 'orderNo' },
                { title: '类型', dataIndex: 'orderType' },
                { title: '来源单号', dataIndex: 'sourceOrderNo' },
                { title: '创建人', dataIndex: 'createdBy' },
                { title: '创建时间', dataIndex: 'createdAt' },
                { title: '仓库', dataIndex: 'warehouse' },
                { title: '物料数', dataIndex: 'totalItems' },
                {
                  title: '操作',
                  key: 'action',
                  render: (_, record) => (
                    <Space>
                      <Button 
                        size="small" 
                        type="primary"
                        onClick={() => handleApproveOrder('inbound', record.id, true)}
                      >
                        通过
                      </Button>
                      <Button 
                        size="small" 
                        danger
                        onClick={() => handleApproveOrder('inbound', record.id, false)}
                      >
                        驳回
                      </Button>
                      <Button 
                        size="small"
                        onClick={() => {
                          setSelectedOrderDetails(record);
                          setDetailModalTitle('入库单详情');
                          setDetailModalVisible(true);
                        }}
                      >
                        查看详情
                      </Button>
                    </Space>
                  )
                }
              ]}
              pagination={{ pageSize: 5 }}
              rowKey="id"
            />
          </TabPane>
          <TabPane tab={`待审核出库单 (${pendingOutboundCount})`} key="2">
            <Table
              dataSource={mockOutboundOrders.filter(order => order.status === '待审核')}
              columns={[
                { title: '单号', dataIndex: 'orderNo' },
                { title: '类型', dataIndex: 'orderType' },
                { title: '目标单号', dataIndex: 'destinationOrderNo' },
                { title: '创建人', dataIndex: 'createdBy' },
                { title: '创建时间', dataIndex: 'createdAt' },
                { title: '仓库', dataIndex: 'warehouse' },
                { title: '物料数', dataIndex: 'totalItems' },
                {
                  title: '操作',
                  key: 'action',
                  render: (_, record) => (
                    <Space>
                      <Button 
                        size="small" 
                        type="primary"
                        onClick={() => handleApproveOrder('outbound', record.id, true)}
                      >
                        通过
                      </Button>
                      <Button 
                        size="small" 
                        danger
                        onClick={() => handleApproveOrder('outbound', record.id, false)}
                      >
                        驳回
                      </Button>
                      <Button 
                        size="small"
                        onClick={() => {
                          setSelectedOrderDetails(record);
                          setDetailModalTitle('出库单详情');
                          setDetailModalVisible(true);
                        }}
                      >
                        查看详情
                      </Button>
                    </Space>
                  )
                }
              ]}
              pagination={{ pageSize: 5 }}
              rowKey="id"
            />
          </TabPane>
        </Tabs>
      </Modal>

      {/* 低库存预警模态框 */}
      <Modal
        title="低库存预警明细"
        visible={lowStockModalVisible}
        width={1000}
        onCancel={() => setLowStockModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setLowStockModalVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="request" 
            type="primary" 
            onClick={() => {
              setLowStockModalVisible(false);
              handleLowStockWarningAction();
            }}
          >
            生成采购申请
          </Button>
        ]}
      >
        <Table
          dataSource={mockInventoryItems.filter(item => item.quantity < item.safetyStock)}
          columns={[
            { title: '物料编码', dataIndex: 'materialCode' },
            { title: '物料名称', dataIndex: 'materialName' },
            { title: '规格型号', dataIndex: 'specification' },
            { 
              title: '当前库存', 
              dataIndex: 'quantity',
              render: (text, record) => (
                <span style={{ color: 'red' }}>
                  {text} {record.unit}
                </span>
              )
            },
            { 
              title: '安全库存', 
              dataIndex: 'safetyStock',
              render: (text, record) => (
                <span>
                  {text} {record.unit}
                </span>
              )
            },
            { 
              title: '差异数量', 
              render: (_, record) => (
                <span style={{ color: 'red' }}>
                  {record.quantity - record.safetyStock} {record.unit}
                </span>
              )
            },
            { title: '仓库', dataIndex: 'warehouse' },
            { title: '库位', dataIndex: 'location' },
            {
              title: '操作',
              key: 'action',
              render: (_, record) => (
                <Space>
                  <Button 
                    size="small" 
                    type="primary" 
                    danger
                    onClick={() => handleGeneratePurchaseRequest([record])}
                  >
                    补货申请
                  </Button>
                  <Button 
                    size="small"
                    onClick={() => handleViewInventoryDetail(record)}
                  >
                    查看详情
                  </Button>
                </Space>
              )
            }
          ]}
          pagination={false}
          rowKey="id"
        />
      </Modal>

      {/* 添加入库检验模态框 */}
      {renderInspectionModal()}

      {/* 库存流水详情模态框 */}
      {renderTransactionDetailModal()}

      {/* 新建盘点表单 */}
      {renderStockCheckFormDrawer()}

      {/* 盘点单详情 */}
      {renderStockCheckDetailModal()}

      {/* 盘点结果录入 */}
      {renderStockCheckResultModal()}
    </div>
  );
};

export default Warehouse;