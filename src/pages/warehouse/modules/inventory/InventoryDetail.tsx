import React from 'react';
import { 
  Modal, 
  Descriptions, 
  Button, 
  Tabs, 
  Badge, 
  Divider, 
  Typography, 
  Card, 
  Row, 
  Col,
  Tag,
  Progress,
  Statistic,
  Table
} from 'antd';
import { 
  PrinterOutlined, 
  BarChartOutlined, 
  HistoryOutlined, 
  QrcodeOutlined,
  AlertOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ApiOutlined
} from '@ant-design/icons';
import type { InventoryItem, InventoryTransaction } from '../types';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface InventoryDetailProps {
  visible: boolean;
  record: InventoryItem | null;
  onClose: () => void;
}

/**
 * 库存详情组件
 */
const InventoryDetail: React.FC<InventoryDetailProps> = ({
  visible,
  record,
  onClose
}) => {
  if (!record) {
    return null;
  }
  
  // 获取库存状态
  const getStockStatus = () => {
    const { quantity, safetyStock } = record;
    
    if (quantity <= safetyStock * 0.5) {
      return { text: '紧急', color: 'red', status: 'exception' };
    } else if (quantity <= safetyStock) {
      return { text: '偏低', color: 'orange', status: 'warning' };
    } else if (quantity >= safetyStock * 2) {
      return { text: '过高', color: 'blue', status: 'success' };
    } else {
      return { text: '正常', color: 'green', status: 'success' };
    }
  };
  
  const stockStatus = getStockStatus();
  
  // 模拟最近入出库记录
  const recentTransactions: InventoryTransaction[] = [
    {
      id: '1',
      transactionNo: 'TRN-2023042501',
      transactionType: '采购入库',
      materialCode: record.materialCode,
      materialName: record.materialName,
      warehouse: record.warehouse,
      location: record.location,
      quantity: 100,
      unit: record.unit,
      direction: '入库',
      beforeQuantity: 50,
      afterQuantity: 150,
      relatedOrderNo: 'PO-2023-001',
      operator: '张三',
      createdAt: '2023-04-25 10:30:00',
      batch: record.batch
    },
    {
      id: '2',
      transactionNo: 'TRN-2023042502',
      transactionType: '生产领料',
      materialCode: record.materialCode,
      materialName: record.materialName,
      warehouse: record.warehouse,
      location: record.location,
      quantity: 20,
      unit: record.unit,
      direction: '出库',
      beforeQuantity: 150,
      afterQuantity: 130,
      relatedOrderNo: 'PP-2023-005',
      operator: '李四',
      createdAt: '2023-04-25 14:15:00',
      batch: record.batch
    }
  ];
  
  // 历史出入库表格列定义
  const historyColumns = [
    {
      title: '日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '类型',
      dataIndex: 'transactionType',
      key: 'transactionType',
    },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
      render: (text: string) => (
        <Tag color={text === '入库' ? 'green' : 'red'}>
          {text}
        </Tag>
      )
    },
    {
      title: '数量',
      key: 'quantity',
      render: (_: any, record: InventoryTransaction) => (
        <span>
          {record.direction === '入库' ? '+' : '-'}{record.quantity} {record.unit}
        </span>
      )
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '关联单据',
      dataIndex: 'relatedOrderNo',
      key: 'relatedOrderNo',
    }
  ];
  
  return (
    <Modal
      title={`物料详情 - ${record.materialName}`}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="print" icon={<PrinterOutlined />}>打印</Button>,
        <Button key="qrcode" icon={<QrcodeOutlined />}>查看二维码</Button>,
        <Button key="close" type="primary" onClick={onClose}>关闭</Button>
      ]}
    >
      <div className="inventory-detail">
        {/* 状态概览卡片 */}
        <Card className="status-card" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="当前库存"
                value={record.quantity}
                suffix={record.unit}
                precision={0}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="安全库存"
                value={record.safetyStock}
                suffix={record.unit}
                precision={0}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="库存金额"
                value={record.totalValue}
                precision={2}
                prefix="¥"
              />
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 8 }}>库存状态</div>
                <Progress
                  type="dashboard"
                  percent={Math.min(100, (record.quantity / record.safetyStock) * 100)}
                  width={80}
                  status={stockStatus.status as any}
                  format={() => (
                    <span style={{ color: stockStatus.color }}>
                      {stockStatus.text}
                    </span>
                  )}
                />
              </div>
            </Col>
          </Row>
        </Card>
        
        {/* 详细信息标签页 */}
        <Tabs defaultActiveKey="info">
          <TabPane
            tab={
              <span>
                <ApiOutlined />
                基本信息
              </span>
            }
            key="info"
          >
            <Descriptions 
              bordered 
              column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
              style={{ marginTop: 16 }}
            >
              <Descriptions.Item label="物料编码">{record.materialCode}</Descriptions.Item>
              <Descriptions.Item label="物料名称">{record.materialName}</Descriptions.Item>
              <Descriptions.Item label="规格型号">{record.specification}</Descriptions.Item>
              <Descriptions.Item label="物料类别">{record.category}</Descriptions.Item>
              <Descriptions.Item label="计量单位">{record.unit}</Descriptions.Item>
              <Descriptions.Item label="批次号">{record.batch}</Descriptions.Item>
              <Descriptions.Item label="仓库">{record.warehouse}</Descriptions.Item>
              <Descriptions.Item label="库位">{record.location}</Descriptions.Item>
              <Descriptions.Item label="最后更新">{record.lastUpdated}</Descriptions.Item>
              <Descriptions.Item label="单价">{`¥${record.costPrice.toFixed(2)}`}</Descriptions.Item>
              <Descriptions.Item label="库存金额">{`¥${record.totalValue.toFixed(2)}`}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge status={record.statusCode === 'normal' ? 'success' : 'warning'} 
                  text={record.statusCode === 'normal' ? '正常' : '低库存'} 
                />
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <HistoryOutlined />
                出入库记录
              </span>
            }
            key="history"
          >
            <Table
              dataSource={recentTransactions}
              columns={historyColumns}
              rowKey="id"
              pagination={false}
              style={{ marginTop: 16 }}
            />
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                库存分析
              </span>
            }
            key="analysis"
          >
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card title="库存趋势" size="small">
                  <div style={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Text type="secondary">库存趋势图表将显示在这里</Text>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="周转分析" size="small">
                  <div style={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Text type="secondary">周转分析图表将显示在这里</Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <AlertOutlined />
                库存预警
              </span>
            }
            key="alert"
          >
            <div style={{ marginTop: 16 }}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="安全库存">
                  {record.safetyStock} {record.unit}
                </Descriptions.Item>
                <Descriptions.Item label="当前状态">
                  <Tag color={stockStatus.color}>{stockStatus.text}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="库存差额">
                  {record.quantity - record.safetyStock > 0 ? (
                    <Text type="success">
                      <ArrowUpOutlined /> +{record.quantity - record.safetyStock} {record.unit}
                    </Text>
                  ) : (
                    <Text type="danger">
                      <ArrowDownOutlined /> {record.quantity - record.safetyStock} {record.unit}
                    </Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="建议操作">
                  {record.quantity < record.safetyStock ? (
                    <span>建议补货 <strong>{record.safetyStock - record.quantity + 50}</strong> {record.unit}</span>
                  ) : record.quantity > record.safetyStock * 2 ? (
                    <span>建议减少库存，当前库存过高</span>
                  ) : (
                    <span>库存水平正常，无需特别操作</span>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default InventoryDetail; 