import React, { useState } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Row,
  Col,
  Select,
  Badge,
  Tag,
  Tooltip,
  Card,
  Divider,
  Progress
} from 'antd';
import type { ColumnsType, Key } from 'antd/es/table';
import {
  SearchOutlined,
  ReloadOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  FilterOutlined,
  EyeOutlined,
  BarChartOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import type { InventoryItem } from '../types';

const { Option } = Select;

interface InventoryTableProps {
  loading: boolean;
  dataSource: InventoryItem[];
  warehouseOptions: string[];
  categoryOptions: string[];
  statusOptions: { value: string; label: string }[];
  onSearch: (value: string) => void;
  onFilterChange: (filters: any) => void;
  onViewDetail: (record: InventoryItem) => void;
  onRefresh: () => void;
  onReset: () => void;
}

/**
 * 库存表格组件
 */
const InventoryTable: React.FC<InventoryTableProps> = ({
  loading,
  dataSource,
  warehouseOptions,
  categoryOptions,
  statusOptions,
  onSearch,
  onFilterChange,
  onViewDetail,
  onRefresh,
  onReset
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [warehouse, setWarehouse] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  
  // 应用筛选条件
  const applyFilters = () => {
    onFilterChange({
      warehouse,
      category,
      status
    });
  };
  
  // 重置筛选条件
  const resetFilters = () => {
    setWarehouse(undefined);
    setCategory(undefined);
    setStatus(undefined);
    onReset();
  };
  
  // 获取库存状态显示内容
  const getStockStatusDisplay = (record: InventoryItem) => {
    const { quantity, safetyStock } = record;
    const percentage = (quantity / safetyStock) * 100;
    
    if (quantity <= safetyStock * 0.5) {
      return {
        text: '紧急',
        color: 'red',
        status: 'exception',
        percentage
      };
    } else if (quantity <= safetyStock) {
      return {
        text: '偏低',
        color: 'orange',
        status: 'warning',
        percentage
      };
    } else if (quantity >= safetyStock * 2) {
      return {
        text: '过高',
        color: 'blue',
        status: 'success',
        percentage
      };
    } else {
      return {
        text: '正常',
        color: 'green',
        status: 'success',
        percentage
      };
    }
  };
  
  // 表格列定义
  const columns: ColumnsType<InventoryItem> = [
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120,
      fixed: 'left' as const,
      render: (text: string) => <a>{text}</a>
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 150
    },
    {
      title: '规格型号',
      dataIndex: 'specification',
      key: 'specification',
      width: 180
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      filters: categoryOptions.map(category => ({ text: category, value: category })),
      onFilter: (value: string | number | boolean | Key, record: InventoryItem) => 
        record.category === value
    },
    {
      title: '仓库/库位',
      key: 'location',
      width: 160,
      render: (_: any, record: InventoryItem) => (
        <span>
          <div>{record.warehouse}</div>
          <small style={{ color: '#999' }}>{record.location}</small>
        </span>
      )
    },
    {
      title: '批次',
      dataIndex: 'batch',
      key: 'batch',
      width: 120
    },
    {
      title: '库存数量',
      key: 'quantity',
      width: 150,
      sorter: (a: InventoryItem, b: InventoryItem) => a.quantity - b.quantity,
      render: (_: any, record: InventoryItem) => (
        <span>
          <div style={{ fontWeight: 'bold' }}>
            {record.quantity} {record.unit}
          </div>
          <small style={{ color: '#999' }}>
            安全库存: {record.safetyStock} {record.unit}
          </small>
        </span>
      )
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      render: (_: any, record: InventoryItem) => {
        const status = getStockStatusDisplay(record);
        return (
          <div>
            <Tag color={status.color}>{status.text}</Tag>
            <Progress 
              percent={Math.min(200, status.percentage)} 
              size="small" 
              status={status.status as "success" | "exception" | "normal" | "active" | undefined}
              showInfo={false}
              style={{ marginTop: 5 }}
            />
          </div>
        );
      }
    },
    {
      title: '单价/金额',
      key: 'value',
      width: 120,
      sorter: (a: InventoryItem, b: InventoryItem) => a.totalValue - b.totalValue,
      render: (_: any, record: InventoryItem) => (
        <span>
          <div>¥{record.costPrice.toFixed(2)}</div>
          <small style={{ color: '#999' }}>
            总值: ¥{record.totalValue.toFixed(2)}
          </small>
        </span>
      )
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: InventoryItem) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => onViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="查看分析">
            <Button 
              type="link" 
              icon={<BarChartOutlined />} 
            />
          </Tooltip>
          <Tooltip title="查看二维码">
            <Button 
              type="link" 
              icon={<QrcodeOutlined />} 
            />
          </Tooltip>
        </Space>
      )
    }
  ];
  
  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    }
  };
  
  // 库存统计展示
  const InventoryStats = () => {
    const totalItems = dataSource.length;
    const totalValue = dataSource.reduce((sum, item) => sum + item.totalValue, 0);
    const lowStockItems = dataSource.filter(item => item.quantity <= item.safetyStock).length;
    
    return (
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <div className="stat-item">
              <div className="stat-title">总物料数</div>
              <div className="stat-value">{totalItems}</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="stat-item">
              <div className="stat-title">库存总价值</div>
              <div className="stat-value">¥{totalValue.toFixed(2)}</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="stat-item">
              <div className="stat-title">低库存物料</div>
              <div className="stat-value">
                <Badge status="warning" text={`${lowStockItems} 项`} />
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    );
  };
  
  return (
    <div className="inventory-table">
      {/* 库存统计 */}
      <InventoryStats />
      
      {/* 工具栏 */}
      <div className="table-toolbar" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="搜索编码/名称/规格/批次"
              prefix={<SearchOutlined />}
              allowClear
              onChange={e => onSearch(e.target.value)}
            />
          </Col>
          
          <Col xs={24} sm={24} md={16} lg={18}>
            <Space wrap>
              <Button 
                icon={<FilterOutlined />} 
                onClick={() => setShowFilter(!showFilter)}
                type={showFilter ? "primary" : "default"}
              >
                高级筛选
              </Button>
              
              <Tooltip title="刷新数据">
                <Button icon={<ReloadOutlined />} onClick={onRefresh} />
              </Tooltip>
              
              <Tooltip title="导出Excel">
                <Button icon={<FileExcelOutlined />} disabled={selectedRowKeys.length === 0} />
              </Tooltip>
              
              <Tooltip title="打印库存清单">
                <Button icon={<PrinterOutlined />} disabled={selectedRowKeys.length === 0} />
              </Tooltip>
            </Space>
          </Col>
        </Row>
        
        {/* 展开筛选区域 */}
        {showFilter && (
          <div className="filter-area" style={{ marginTop: 16, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 4 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <div style={{ marginBottom: 8 }}>仓库</div>
                <Select
                  style={{ width: '100%' }}
                  placeholder="选择仓库"
                  allowClear
                  value={warehouse}
                  onChange={value => setWarehouse(value)}
                >
                  {warehouseOptions.map(option => (
                    <Option key={option} value={option}>{option}</Option>
                  ))}
                </Select>
              </Col>
              
              <Col xs={24} sm={8}>
                <div style={{ marginBottom: 8 }}>物料类别</div>
                <Select
                  style={{ width: '100%' }}
                  placeholder="选择物料类别"
                  allowClear
                  value={category}
                  onChange={value => setCategory(value)}
                >
                  {categoryOptions.map(option => (
                    <Option key={option} value={option}>{option}</Option>
                  ))}
                </Select>
              </Col>
              
              <Col xs={24} sm={8}>
                <div style={{ marginBottom: 8 }}>库存状态</div>
                <Select
                  style={{ width: '100%' }}
                  placeholder="选择库存状态"
                  allowClear
                  value={status}
                  onChange={value => setStatus(value)}
                >
                  {statusOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Col>
            </Row>
            
            <Divider style={{ margin: '16px 0' }} />
            
            <Row justify="end">
              <Space>
                <Button onClick={resetFilters}>重置</Button>
                <Button type="primary" onClick={applyFilters}>应用筛选</Button>
              </Space>
            </Row>
          </div>
        )}
      </div>
      
      {/* 表格 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowSelection={rowSelection}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条记录`
        }}
        scroll={{ x: 1500 }}
        size="middle"
      />
    </div>
  );
};

export default InventoryTable; 