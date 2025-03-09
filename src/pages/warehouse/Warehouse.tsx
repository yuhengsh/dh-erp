import React, { useState } from 'react';
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
  DownloadOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

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

// 模拟数据 - 库存物料
const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    materialCode: 'CP-001',
    materialName: '船板Q235B',
    specification: '10mm×1500mm×6000mm',
    category: '原料',
    warehouse: '主仓库',
    location: 'A-01-01',
    batch: 'B230915-01',
    quantity: 62,
    unit: '吨',
    safetyStock: 50,
    statusCode: 'normal',
    lastUpdated: '2023-09-15',
    costPrice: 5600,
    totalValue: 347200,
  },
  {
    id: '2',
    materialCode: 'XG-002',
    materialName: '型钢H型钢',
    specification: 'HW 200×200×8×12',
    category: '原料',
    warehouse: '主仓库',
    location: 'A-02-01',
    batch: 'B230910-02',
    quantity: 25,
    unit: '吨',
    safetyStock: 30,
    statusCode: 'warning',
    lastUpdated: '2023-09-10',
    costPrice: 6200,
    totalValue: 155000,
  },
  {
    id: '3',
    materialCode: 'HD-001',
    materialName: '焊条E4303',
    specification: 'Φ3.2mm',
    category: '辅料',
    warehouse: '辅料仓库',
    location: 'B-01-03',
    batch: 'B230901-01',
    quantity: 180,
    unit: '箱',
    safetyStock: 100,
    statusCode: 'normal',
    lastUpdated: '2023-09-01',
    costPrice: 560,
    totalValue: 100800,
  },
  {
    id: '4',
    materialCode: 'YY-001',
    materialName: '液压油',
    specification: '46#',
    category: '辅料',
    warehouse: '辅料仓库',
    location: 'B-02-05',
    batch: 'B230905-03',
    quantity: 18,
    unit: '桶',
    safetyStock: 20,
    statusCode: 'warning',
    lastUpdated: '2023-09-05',
    costPrice: 1100,
    totalValue: 19800,
  },
  {
    id: '5',
    materialCode: 'DJ-001',
    materialName: '电机220kW',
    specification: 'YE3-315M-4',
    category: '成品',
    warehouse: '成品仓库',
    location: 'C-01-02',
    batch: 'B230908-01',
    quantity: 7,
    unit: '台',
    safetyStock: 5,
    statusCode: 'normal',
    lastUpdated: '2023-09-08',
    costPrice: 45000,
    totalValue: 315000,
  },
  {
    id: '6',
    materialCode: 'BT-001',
    materialName: '钢板支架',
    specification: '标准规格',
    category: '半成品',
    warehouse: '主仓库',
    location: 'A-03-04',
    batch: 'B230912-02',
    quantity: 15,
    unit: '件',
    safetyStock: 10,
    statusCode: 'normal',
    lastUpdated: '2023-09-12',
    costPrice: 2800,
    totalValue: 42000,
  },
  {
    id: '7',
    materialCode: 'LZ-001',
    materialName: '螺栓M12',
    specification: 'M12×50mm',
    category: '辅料',
    warehouse: '辅料仓库',
    location: 'B-01-08',
    batch: 'B230830-05',
    quantity: 2500,
    unit: '个',
    safetyStock: 1000,
    statusCode: 'normal',
    lastUpdated: '2023-08-30',
    costPrice: 2.5,
    totalValue: 6250,
  },
];

// 模拟数据 - 入库单
const mockInboundOrders: InboundOrder[] = [
  {
    id: '1',
    orderNo: 'RK-2023-001',
    orderType: '采购入库',
    sourceOrderNo: 'CG-2023-045',
    sourceType: '采购订单',
    status: '已完成',
    createdBy: '李仓管',
    createdAt: '2023-09-15 10:30',
    approvedBy: '王经理',
    approvedAt: '2023-09-15 14:20',
    warehouse: '主仓库',
    totalItems: 2,
    remarks: '按时到货，质检合格',
  },
  {
    id: '2',
    orderNo: 'RK-2023-002',
    orderType: '采购入库',
    sourceOrderNo: 'CG-2023-046',
    sourceType: '采购订单',
    status: '待审核',
    createdBy: '张仓管',
    createdAt: '2023-09-16 09:15',
    approvedBy: '',
    approvedAt: '',
    warehouse: '辅料仓库',
    totalItems: 3,
    remarks: '部分物料需要质检',
  },
  {
    id: '3',
    orderNo: 'RK-2023-003',
    orderType: '生产入库',
    sourceOrderNo: 'SC-2023-089',
    sourceType: '生产订单',
    status: '已完成',
    createdBy: '李仓管',
    createdAt: '2023-09-14 16:40',
    approvedBy: '王经理',
    approvedAt: '2023-09-14 17:30',
    warehouse: '成品仓库',
    totalItems: 1,
    remarks: '质检合格',
  },
  {
    id: '4',
    orderNo: 'RK-2023-004',
    orderType: '委外入库',
    sourceOrderNo: 'WW-2023-012',
    sourceType: '委外加工单',
    status: '待审核',
    createdBy: '张仓管',
    createdAt: '2023-09-17 11:20',
    approvedBy: '',
    approvedAt: '',
    warehouse: '主仓库',
    totalItems: 1,
    remarks: '待质检',
  },
];

// 模拟数据 - 出库单
const mockOutboundOrders: OutboundOrder[] = [
  {
    id: '1',
    orderNo: 'CK-2023-001',
    orderType: '生产领料',
    destinationOrderNo: 'SC-2023-092',
    destinationType: '生产订单',
    status: '已完成',
    createdBy: '李仓管',
    createdAt: '2023-09-15 08:30',
    approvedBy: '王经理',
    approvedAt: '2023-09-15 09:20',
    warehouse: '主仓库',
    totalItems: 3,
    remarks: '正常领料',
  },
  {
    id: '2',
    orderNo: 'CK-2023-002',
    orderType: '销售出库',
    destinationOrderNo: 'XS-2023-032',
    destinationType: '销售订单',
    status: '待审核',
    createdBy: '张仓管',
    createdAt: '2023-09-16 14:15',
    approvedBy: '',
    approvedAt: '',
    warehouse: '成品仓库',
    totalItems: 1,
    remarks: '客户急需',
  },
  {
    id: '3',
    orderNo: 'CK-2023-003',
    orderType: '生产领料',
    destinationOrderNo: 'SC-2023-093',
    destinationType: '生产订单',
    status: '已完成',
    createdBy: '李仓管',
    createdAt: '2023-09-16 09:10',
    approvedBy: '王经理',
    approvedAt: '2023-09-16 10:00',
    warehouse: '辅料仓库',
    totalItems: 2,
    remarks: '',
  },
  {
    id: '4',
    orderNo: 'CK-2023-004',
    orderType: '委外发料',
    destinationOrderNo: 'WW-2023-013',
    destinationType: '委外加工单',
    status: '待审核',
    createdBy: '张仓管',
    createdAt: '2023-09-17 13:45',
    approvedBy: '',
    approvedAt: '',
    warehouse: '主仓库',
    totalItems: 2,
    remarks: '提前安排',
  },
];

// 模拟数据 - 库存流水
const mockInventoryTransactions: InventoryTransaction[] = [
  {
    id: '1',
    transactionNo: 'LS-2023-001',
    transactionType: '采购入库',
    materialCode: 'CP-001',
    materialName: '船板Q235B',
    warehouse: '主仓库',
    location: 'A-01-01',
    quantity: 20,
    unit: '吨',
    direction: '入库',
    beforeQuantity: 42,
    afterQuantity: 62,
    relatedOrderNo: 'RK-2023-001',
    operator: '李仓管',
    createdAt: '2023-09-15 14:30',
    batch: 'B230915-01',
  },
  {
    id: '2',
    transactionNo: 'LS-2023-002',
    transactionType: '生产领料',
    materialCode: 'XG-002',
    materialName: '型钢H型钢',
    warehouse: '主仓库',
    location: 'A-02-01',
    quantity: 5,
    unit: '吨',
    direction: '出库',
    beforeQuantity: 30,
    afterQuantity: 25,
    relatedOrderNo: 'CK-2023-001',
    operator: '李仓管',
    createdAt: '2023-09-15 09:30',
    batch: 'B230910-02',
  },
  {
    id: '3',
    transactionNo: 'LS-2023-003',
    transactionType: '生产入库',
    materialCode: 'DJ-001',
    materialName: '电机220kW',
    warehouse: '成品仓库',
    location: 'C-01-02',
    quantity: 2,
    unit: '台',
    direction: '入库',
    beforeQuantity: 5,
    afterQuantity: 7,
    relatedOrderNo: 'RK-2023-003',
    operator: '李仓管',
    createdAt: '2023-09-14 17:00',
    batch: 'B230908-01',
  },
  {
    id: '4',
    transactionNo: 'LS-2023-004',
    transactionType: '生产领料',
    materialCode: 'YY-001',
    materialName: '液压油',
    warehouse: '辅料仓库',
    location: 'B-02-05',
    quantity: 2,
    unit: '桶',
    direction: '出库',
    beforeQuantity: 20,
    afterQuantity: 18,
    relatedOrderNo: 'CK-2023-003',
    operator: '李仓管',
    createdAt: '2023-09-16 09:45',
    batch: 'B230905-03',
  },
  {
    id: '5',
    transactionNo: 'LS-2023-005',
    transactionType: '采购入库',
    materialCode: 'HD-001',
    materialName: '焊条E4303',
    warehouse: '辅料仓库',
    location: 'B-01-03',
    quantity: 50,
    unit: '箱',
    direction: '入库',
    beforeQuantity: 130,
    afterQuantity: 180,
    relatedOrderNo: 'RK-2023-001',
    operator: '李仓管',
    createdAt: '2023-09-15 14:35',
    batch: 'B230901-01',
  },
];

// 仓库管理主组件
const Warehouse: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [searchText, setSearchText] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  
  // 抽屉状态
  const [inboundDrawerVisible, setInboundDrawerVisible] = useState(false);
  const [outboundDrawerVisible, setOutboundDrawerVisible] = useState(false);
  const [inboundForm] = Form.useForm();
  const [outboundForm] = Form.useForm();
  
  // 详情模态框状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);
  const [detailModalTitle, setDetailModalTitle] = useState('');

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
        <Space size="small">
          <Button type="link" size="small">
            详情
          </Button>
          <Button type="link" size="small">
            调整
          </Button>
          <Button type="link" size="small">
            记录
          </Button>
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
      sorter: (a, b) => a.orderNo.localeCompare(b.orderNo),
    },
    {
      title: '入库类型',
      dataIndex: 'orderType',
      key: 'orderType',
      filters: [
        { text: '采购入库', value: '采购入库' },
        { text: '生产入库', value: '生产入库' },
        { text: '委外入库', value: '委外入库' },
        { text: '其他入库', value: '其他入库' },
      ],
      onFilter: (value, record) => record.orderType === value,
      render: (text) => {
        let color = '';
        if (text === '采购入库') color = 'blue';
        if (text === '生产入库') color = 'green';
        if (text === '委外入库') color = 'purple';
        if (text === '其他入库') color = 'orange';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '来源单据',
      dataIndex: 'sourceOrderNo',
      key: 'sourceOrderNo',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <small style={{ color: '#888' }}>{record.sourceType}</small>
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
      title: '入库仓库',
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
          <Button type="link" size="small" onClick={() => showOrderDetails(record, '入库单详情')}>
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

  // 流水账表格列定义
  const transactionColumns: ColumnsType<InventoryTransaction> = [
    {
      title: '流水号',
      dataIndex: 'transactionNo',
      key: 'transactionNo',
    },
    {
      title: '业务类型',
      dataIndex: 'transactionType',
      key: 'transactionType',
      filters: [
        { text: '采购入库', value: '采购入库' },
        { text: '销售出库', value: '销售出库' },
        { text: '生产入库', value: '生产入库' },
        { text: '生产领料', value: '生产领料' },
        { text: '委外入库', value: '委外入库' },
        { text: '委外发料', value: '委外发料' },
        { text: '库存调整', value: '库存调整' },
      ],
      onFilter: (value, record) => record.transactionType === value,
      render: (text) => {
        let color = '';
        if (text.includes('入库')) color = 'blue';
        if (text.includes('出库') || text.includes('领料') || text.includes('发料')) color = 'green';
        if (text === '库存调整') color = 'purple';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      key: 'materialName',
    },
    {
      title: '仓库/库位',
      key: 'warehouse',
      render: (_, record) => (
        <div>
          <div>{record.warehouse}</div>
          <small>{record.location}</small>
        </div>
      ),
    },
    {
      title: '批次',
      dataIndex: 'batch',
      key: 'batch',
    },
    {
      title: '出入库',
      key: 'direction',
      render: (_, record) => {
        if (record.direction === '入库') {
          return <Tag color="blue">入库 +{record.quantity}{record.unit}</Tag>;
        } else {
          return <Tag color="green">出库 -{record.quantity}{record.unit}</Tag>;
        }
      },
    },
    {
      title: '库存变化',
      key: 'change',
      render: (_, record) => (
        <div>
          <div>变动前: {record.beforeQuantity}{record.unit}</div>
          <div>变动后: {record.afterQuantity}{record.unit}</div>
        </div>
      ),
    },
    {
      title: '关联单据',
      dataIndex: 'relatedOrderNo',
      key: 'relatedOrderNo',
    },
    {
      title: '操作人员',
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
        <Space size="small">
          <Button type="link" size="small">
            详情
          </Button>
          <Button type="link" size="small">
            单据
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
  const lowStockCount = mockInventoryItems.filter(item => item.quantity < item.safetyStock).length;
  const pendingInboundCount = mockInboundOrders.filter(order => order.status === '待审核').length;
  const pendingOutboundCount = mockOutboundOrders.filter(order => order.status === '待审核').length;

  return (
    <div>
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
              valueStyle={{ color: lowStockCount > 0 ? '#faad14' : '#52c41a' }}
              prefix={<WarningOutlined />}
              suffix={
                lowStockCount > 0 ? (
                  <Button type="link" size="small" style={{ marginLeft: 8 }}>
                    查看明细
                  </Button>
                ) : null
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待审核单据"
              value={pendingInboundCount + pendingOutboundCount}
              valueStyle={{ color: pendingInboundCount + pendingOutboundCount > 0 ? '#1890ff' : '#52c41a' }}
              prefix={<SyncOutlined />}
              suffix={
                pendingInboundCount + pendingOutboundCount > 0 ? (
                  <Button type="link" size="small" style={{ marginLeft: 8 }}>
                    立即处理
                  </Button>
                ) : null
              }
            />
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
                    <Button icon={<BarChartOutlined />}>库存分析</Button>
                    <Button icon={<ImportOutlined />}>库存盘点</Button>
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
                <Button size="small" type="primary">
                  生成采购申请
                </Button>
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
    </div>
  );
};

export default Warehouse; 