import React, { useState } from 'react';
import { Card, Modal, Form, Input, InputNumber } from 'antd';
import { useStockCheckTable, useStockCheckDetail } from './hooks';
import StockCheckTable from './StockCheckTable';
import StockCheckDetail from './StockCheckDetail';
import { InventoryCheckItem } from '../types';

/**
 * 库存盘点模块组件 - 整合表格和详情功能
 */
const StockCheckModule: React.FC = () => {
  // 使用库存盘点表格钩子
  const { loading, records, createStockCheck } = useStockCheckTable();
  
  // 创建盘点表单状态
  const [formVisible, setFormVisible] = useState(false);
  const [form] = Form.useForm();
  
  // 结果录入状态
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultForm] = Form.useForm();
  const [selectedItem, setSelectedItem] = useState<InventoryCheckItem | null>(null);
  
  // 更新记录的函数，用于传递给详情钩子
  const updateRecordsFn = (updater: (records: any[]) => any[]) => {
    // 实际使用时，应该调用表格钩子中的方法来更新记录
    console.log("需要更新记录", updater);
  };
  
  // 使用库存盘点详情钩子
  const { 
    visible: detailVisible, 
    loading: detailLoading, 
    selectedRecord,
    items, 
    viewStockCheck,
    startStockCheck,
    completeStockCheck, 
    closeModal,
    enterCheckResult
  } = useStockCheckDetail(updateRecordsFn);
  
  // 处理创建盘点单
  const handleCreate = () => {
    setFormVisible(true);
    form.resetFields();
  };
  
  // 处理提交创建盘点表单
  const handleSubmitCreate = () => {
    form.validateFields().then(values => {
      createStockCheck(values);
      setFormVisible(false);
    });
  };
  
  // 处理录入结果按钮点击
  const handleEnterResult = (item: InventoryCheckItem) => {
    setSelectedItem(item);
    resultForm.resetFields();
    resultForm.setFieldsValue({
      actualQuantity: item.systemQuantity // 默认使用系统数量
    });
    setResultModalVisible(true);
  };
  
  // 处理提交录入结果
  const handleSubmitResult = () => {
    if (!selectedItem) return;
    
    resultForm.validateFields().then(values => {
      enterCheckResult(values, selectedItem);
      setResultModalVisible(false);
    });
  };
  
  return (
    <div>
      {/* 盘点表格 */}
      <Card title="库存盘点管理">
        <StockCheckTable 
          data={records}
          loading={loading}
          onView={viewStockCheck}
          onCreate={handleCreate}
        />
      </Card>
      
      {/* 盘点详情 */}
      <StockCheckDetail 
        visible={detailVisible}
        record={selectedRecord}
        items={items}
        loading={detailLoading}
        onClose={closeModal}
        onStart={startStockCheck}
        onComplete={completeStockCheck}
        onEnterResult={handleEnterResult}
      />
      
      {/* 创建盘点表单 */}
      <Modal
        title="新建库存盘点单"
        open={formVisible}
        onCancel={() => setFormVisible(false)}
        onOk={handleSubmitCreate}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="checkType"
            label="盘点类型"
            rules={[{ required: true, message: '请选择盘点类型' }]}
          >
            <Input placeholder="例如：全面盘点、抽样盘点等" />
          </Form.Item>
          
          <Form.Item
            name="warehouseName"
            label="盘点仓库"
            rules={[{ required: true, message: '请选择盘点仓库' }]}
          >
            <Input placeholder="例如：原材料仓、成品仓等" />
          </Form.Item>
          
          <Form.Item
            name="checkDate"
            label="盘点日期"
            rules={[{ required: true, message: '请选择盘点日期' }]}
          >
            <Input placeholder="格式：YYYY-MM-DD" />
          </Form.Item>
          
          <Form.Item
            name="checkManager"
            label="盘点负责人"
            rules={[{ required: true, message: '请输入盘点负责人' }]}
          >
            <Input placeholder="例如：张三" />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 录入结果模态框 */}
      <Modal
        title="录入盘点结果"
        open={resultModalVisible}
        onCancel={() => setResultModalVisible(false)}
        onOk={handleSubmitResult}
      >
        {selectedItem && (
          <Form
            form={resultForm}
            layout="vertical"
          >
            <div style={{ marginBottom: 16 }}>
              <p><strong>物料编码：</strong> {selectedItem.materialCode}</p>
              <p><strong>物料名称：</strong> {selectedItem.materialName}</p>
              <p><strong>系统数量：</strong> {selectedItem.systemQuantity}</p>
            </div>
            
            <Form.Item
              name="actualQuantity"
              label="实际盘点数量"
              rules={[{ required: true, message: '请输入实际盘点数量' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
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
    </div>
  );
};

export default StockCheckModule; 