import React, { useState } from 'react';
import { 
  Table, 
  Input, 
  Button, 
  Space, 
  Row, 
  Col, 
  Tag, 
  DatePicker, 
  Select, 
  Tooltip, 
  Divider 
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  EyeOutlined, 
  FileExcelOutlined, 
  PrinterOutlined, 
  FilterOutlined 
} from '@ant-design/icons';
import type { InventoryTransaction } from '../types';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TransactionTableProps {
  loading: boolean;
  dataSource: InventoryTransaction[];
  onSearch: (value: string) => void;
  onDateRangeChange: (dates: any) => void;
  onFilterChange: (filters: any) => void;
  onViewDetail: (record: InventoryTransaction) => void;
  onRefresh: () => void;
}

/**
 * 库存流水表格组件
 */
const TransactionTable: React.FC<TransactionTableProps> = ({
  loading,
  dataSource,
  onSearch,
  onDateRangeChange,
  onFilterChange,
  onViewDetail,
  onRefresh
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [directionFilter, setDirectionFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [warehouseFilter, setWarehouseFilter] = useState<string | undefined>(undefined);
  
  // 获取类型和仓库的唯一值用于筛选
  const transactionTypes = Array.from(new Set(dataSource.map(item => item.transactionType)));
  const warehouses = Array.from(new Set(dataSource.map(item => item.warehouse)));
  
  // 应用筛选条件
  const applyFilters = () => {
    onFilterChange({
      direction: directionFilter,
      transactionType: typeFilter,
      warehouse: warehouseFilter
    });
  };
  
  // 重置筛选条件
  const resetFilters = () => {
    setDirectionFilter(undefined);
    setTypeFilter(undefined);
    setWarehouseFilter(undefined);
    onFilterChange({});
  };
  
  // 表格列配置
  const columns: ColumnsType<InventoryTransaction> = [
    {
      title: '流水号',
      dataIndex: 'transactionNo',
      key: 'transactionNo',
      width: 150,
      render: (text: string) => <a>{text}</a>
    },
    {
      title: '操作类型',
      dataIndex: 'transactionType',
      key: 'transactionType',
      width: 120
    },
    {
      title: '物料',
      key: 'material',
      width: 200,
      render: (_: any, record: InventoryTransaction) => (
        <span>
          <div>{record.materialName}</div>
          <small style={{ color: '#999' }}>{record.materialCode}</small>
        </span>
      )
    },
    {
      title: '仓库/库位',
      key: 'location',
      width: 150,
      render: (_: any, record: InventoryTransaction) => (
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
      title: '变动',
      key: 'change',
      width: 180,
      render: (_: any, record: InventoryTransaction) => (
        <span>
          <Tag color={record.direction === '入库' ? 'green' : 'red'}>
            {record.direction === '入库' ? '+' : '-'}{record.quantity} {record.unit}
          </Tag>
          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
            {record.beforeQuantity} → {record.afterQuantity}
          </div>
        </span>
      )
    },
    {
      title: '相关单号',
      dataIndex: 'relatedOrderNo',
      key: 'relatedOrderNo',
      width: 120
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: (a: InventoryTransaction, b: InventoryTransaction) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: InventoryTransaction) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => onViewDetail(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];
  
  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    }
  };
  
  return (
    <div className="transaction-table">
      {/* 工具栏 */}
      <div className="table-toolbar" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="搜索流水号/物料/单号"
              prefix={<SearchOutlined />}
              allowClear
              onChange={e => onSearch(e.target.value)}
            />
          </Col>
          
          <Col xs={24} sm={24} md={16} lg={18}>
            <Space wrap>
              <RangePicker onChange={onDateRangeChange} />
              
              <Button 
                icon={<FilterOutlined />} 
                onClick={() => setShowFilter(!showFilter)}
                type={showFilter ? "primary" : "default"}
              >
                筛选
              </Button>
              
              <Tooltip title="刷新数据">
                <Button icon={<ReloadOutlined />} onClick={onRefresh} />
              </Tooltip>
              
              <Tooltip title="导出Excel">
                <Button icon={<FileExcelOutlined />} disabled={selectedRowKeys.length === 0} />
              </Tooltip>
              
              <Tooltip title="打印">
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
                <div style={{ marginBottom: 8 }}>出入方向</div>
                <Select
                  style={{ width: '100%' }}
                  placeholder="选择出入方向"
                  allowClear
                  value={directionFilter}
                  onChange={value => setDirectionFilter(value)}
                >
                  <Option value="入库">入库</Option>
                  <Option value="出库">出库</Option>
                </Select>
              </Col>
              
              <Col xs={24} sm={8}>
                <div style={{ marginBottom: 8 }}>操作类型</div>
                <Select
                  style={{ width: '100%' }}
                  placeholder="选择操作类型"
                  allowClear
                  value={typeFilter}
                  onChange={value => setTypeFilter(value)}
                >
                  {transactionTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Col>
              
              <Col xs={24} sm={8}>
                <div style={{ marginBottom: 8 }}>仓库</div>
                <Select
                  style={{ width: '100%' }}
                  placeholder="选择仓库"
                  allowClear
                  value={warehouseFilter}
                  onChange={value => setWarehouseFilter(value)}
                >
                  {warehouses.map(warehouse => (
                    <Option key={warehouse} value={warehouse}>{warehouse}</Option>
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
        scroll={{ x: 1300 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条记录`
        }}
      />
    </div>
  );
};

export default TransactionTable; 