import React from 'react';
import { Modal, Descriptions, Button, Space, Timeline, Tag, Divider, Typography } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import type { InventoryTransaction } from '../types';

const { Title, Text } = Typography;

interface TransactionDetailProps {
  visible: boolean;
  record: InventoryTransaction | null;
  onClose: () => void;
}

/**
 * 库存流水详情组件
 */
const TransactionDetail: React.FC<TransactionDetailProps> = ({
  visible,
  record,
  onClose
}) => {
  if (!record) {
    return null;
  }
  
  // 确定标题颜色和图标
  const getDirectionStyle = () => {
    if (record.direction === '入库') {
      return {
        color: '#52c41a',
        text: '入库',
        sign: '+'
      };
    } else {
      return {
        color: '#f5222d',
        text: '出库',
        sign: '-'
      };
    }
  };
  
  const directionStyle = getDirectionStyle();

  const getTimeLineIcon = (type: string) => {
    switch(type) {
      case 'create':
        return <Tag color="blue">创建</Tag>;
      case 'execute':
        return <Tag color="green">执行</Tag>;
      case 'complete':
        return <Tag color="purple">完成</Tag>;
      default:
        return null;
    }
  };
  
  return (
    <Modal
      title={`库存流水详情 - ${record.transactionNo}`}
      open={visible}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="print" icon={<PrinterOutlined />}>打印</Button>,
        <Button key="close" type="primary" onClick={onClose}>关闭</Button>
      ]}
    >
      <div className="transaction-detail">
        {/* 标题和数量变动信息 */}
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <Title level={4}>{record.transactionType}</Title>
          <div style={{ fontSize: 32, color: directionStyle.color, fontWeight: 'bold' }}>
            {directionStyle.sign}{record.quantity} {record.unit}
          </div>
          <Text type="secondary">
            库存变化: {record.beforeQuantity} → {record.afterQuantity} {record.unit}
          </Text>
        </div>
        
        <Divider />
        
        {/* 基本信息 */}
        <Descriptions
          title="基本信息"
          bordered
          column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="流水编号">{record.transactionNo}</Descriptions.Item>
          <Descriptions.Item label="操作类型">{record.transactionType}</Descriptions.Item>
          <Descriptions.Item label="操作方向">
            <Tag color={record.direction === '入库' ? 'green' : 'red'}>
              {record.direction}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="关联单号">{record.relatedOrderNo}</Descriptions.Item>
          <Descriptions.Item label="操作人">{record.operator}</Descriptions.Item>
          <Descriptions.Item label="操作时间">{record.createdAt}</Descriptions.Item>
        </Descriptions>
        
        <Divider style={{ margin: '24px 0' }} />
        
        {/* 物料信息 */}
        <Descriptions
          title="物料信息"
          bordered
          column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="物料名称">{record.materialName}</Descriptions.Item>
          <Descriptions.Item label="物料编码">{record.materialCode}</Descriptions.Item>
          <Descriptions.Item label="批次">{record.batch}</Descriptions.Item>
          <Descriptions.Item label="仓库">{record.warehouse}</Descriptions.Item>
          <Descriptions.Item label="库位">{record.location}</Descriptions.Item>
          <Descriptions.Item label="单位">{record.unit}</Descriptions.Item>
        </Descriptions>
        
        <Divider style={{ margin: '24px 0' }} />
        
        {/* 时间线 */}
        <div className="timeline-section">
          <Title level={5}>操作流程</Title>
          <Timeline style={{ marginTop: 16 }}>
            <Timeline.Item 
              dot={getTimeLineIcon('create')}
            >
              <div><strong>创建流水记录</strong></div>
              <div>时间：{record.createdAt}</div>
              <div>操作人：{record.operator}</div>
            </Timeline.Item>
            <Timeline.Item 
              dot={getTimeLineIcon('execute')}
            >
              <div><strong>执行库存操作</strong></div>
              <div>时间：{record.createdAt}</div>
              <div>操作类型：{record.transactionType}</div>
              <div>
                操作结果：库存从 {record.beforeQuantity} 变更为 {record.afterQuantity} {record.unit}
              </div>
            </Timeline.Item>
            <Timeline.Item 
              dot={getTimeLineIcon('complete')}
            >
              <div><strong>完成库存更新</strong></div>
              <div>时间：{record.createdAt}</div>
              <div>状态：已完成</div>
              <div>关联单据：{record.relatedOrderNo}</div>
            </Timeline.Item>
          </Timeline>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetail; 