import React from 'react';
import { Modal, Button, Descriptions, Table, Tag, Spin, Space } from 'antd';
import { InventoryCheckRecord, InventoryCheckItem } from '../types';

interface StockCheckDetailProps {
  visible: boolean;
  record: InventoryCheckRecord | null;
  items: InventoryCheckItem[];
  loading: boolean;
  onClose: () => void;
  onStart: (record: InventoryCheckRecord) => void;
  onComplete: (record: InventoryCheckRecord) => void;
  onEnterResult: (item: InventoryCheckItem) => void;
}

/**
 * 库存盘点详情组件
 */
const StockCheckDetail: React.FC<StockCheckDetailProps> = ({
  visible,
  record,
  items,
  loading,
  onClose,
  onStart,
  onComplete,
  onEnterResult
}) => {
  // 计算底部按钮
  const getFooterButtons = () => {
    const buttons = [
      <Button key="close" onClick={onClose}>
        关闭
      </Button>
    ];

    if (record) {
      if (record.status === '待盘点') {
        buttons.push(
          <Button 
            key="start" 
            type="primary" 
            onClick={() => onStart(record)}
          >
            开始盘点
          </Button>
        );
      } else if (record.status === '盘点中') {
        buttons.push(
          <Button 
            key="complete" 
            type="primary" 
            onClick={() => onComplete(record)}
          >
            完成盘点
          </Button>
        );
      }
    }

    return buttons;
  };

  return (
    <Modal
      title={`盘点单详情：${record?.checkCode}`}
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={getFooterButtons()}
    >
      {record && (
        <>
          <Descriptions bordered column={3} size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="盘点单号">{record.checkCode}</Descriptions.Item>
            <Descriptions.Item label="盘点类型">{record.checkType}</Descriptions.Item>
            <Descriptions.Item label="仓库">{record.warehouseName}</Descriptions.Item>
            <Descriptions.Item label="盘点日期">{record.checkDate}</Descriptions.Item>
            <Descriptions.Item label="盘点负责人">{record.checkManager}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={
                record.status === '待盘点' ? 'default' :
                record.status === '盘点中' ? 'processing' :
                record.status === '已完成' ? 'success' : 'default'
              }>
                {record.status}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
          
          <Spin spinning={loading}>
            <Table
              dataSource={items}
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
                    {(record.status !== '已盘点') && (
                      <Button 
                        type="link" 
                        size="small"
                        onClick={() => onEnterResult(record)}
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

export default StockCheckDetail; 