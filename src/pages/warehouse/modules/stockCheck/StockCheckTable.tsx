import React from 'react';
import { Table, Button, Tag, Input, Space, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ExportOutlined, PrinterOutlined, PlusOutlined } from '@ant-design/icons';
import { InventoryCheckRecord } from '../types';

interface StockCheckTableProps {
  data: InventoryCheckRecord[];
  loading: boolean;
  onView: (record: InventoryCheckRecord) => void;
  onCreate: () => void;
}

/**
 * 库存盘点表格组件
 */
const StockCheckTable: React.FC<StockCheckTableProps> = ({
  data,
  loading,
  onView,
  onCreate
}) => {
  // 表格列定义
  const columns: ColumnsType<InventoryCheckRecord> = [
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
        <Button type="link" size="small" onClick={() => onView(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  // 工具栏组件
  const ToolBar = () => (
    <div style={{ marginBottom: 16 }}>
      <Row justify="space-between">
        <Col>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
              新建盘点单
            </Button>
            <Button icon={<ExportOutlined />}>导出</Button>
            <Button icon={<PrinterOutlined />}>打印</Button>
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
  );

  return (
    <>
      <ToolBar />
      <Table 
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="id"
        loading={loading}
      />
    </>
  );
};

export default StockCheckTable; 