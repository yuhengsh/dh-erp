import { useState, useEffect } from 'react';
import { message } from 'antd';
import { InventoryCheckRecord, InventoryCheckItem } from '../types';
import dayjs from 'dayjs';

/**
 * 库存盘点表格数据钩子
 */
export const useStockCheckTable = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<InventoryCheckRecord[]>([]);
  
  // 加载盘点数据
  const loadData = () => {
    setLoading(true);
    
    // 模拟API调用，实际项目中应该调用后端API
    setTimeout(() => {
      const mockData: InventoryCheckRecord[] = [
        { id: 'SC001', checkCode: 'SC-20230501-001', warehouseName: '原材料仓', checkDate: '2023-05-01', checkType: '全面盘点', status: '已完成', checkManager: '张三' },
        { id: 'SC002', checkCode: 'SC-20230520-002', warehouseName: '辅料仓', checkDate: '2023-05-20', checkType: '抽样盘点', status: '盘点中', checkManager: '李四' },
        { id: 'SC003', checkCode: 'SC-20230610-003', warehouseName: '原材料仓', checkDate: '2023-06-10', checkType: '临时盘点', status: '待盘点', checkManager: '王五' },
        { id: 'SC004', checkCode: 'SC-20230715-004', warehouseName: '成品仓', checkDate: '2023-07-15', checkType: '月末盘点', status: '已完成', checkManager: '张三' },
        { id: 'SC005', checkCode: 'SC-20230805-005', warehouseName: '半成品仓', checkDate: '2023-08-05', checkType: '全面盘点', status: '待盘点', checkManager: '李四' },
      ];
      
      setRecords(mockData);
      setLoading(false);
    }, 500);
  };
  
  // 首次加载
  useEffect(() => {
    loadData();
  }, []);
  
  // 创建盘点单
  const createStockCheck = (values: any) => {
    const newStockCheck: InventoryCheckRecord = {
      id: `SC${Date.now()}`,
      checkCode: `SC-${dayjs().format('YYYYMMDD')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      warehouseName: values.warehouseName,
      checkDate: values.checkDate.format('YYYY-MM-DD'),
      checkType: values.checkType,
      status: '待盘点',
      checkManager: values.checkManager
    };
    
    setRecords([newStockCheck, ...records]);
    message.success('盘点单创建成功');
    return newStockCheck;
  };
  
  return {
    loading,
    records,
    loadData,
    createStockCheck
  };
};

/**
 * 库存盘点详情钩子
 */
export const useStockCheckDetail = (
  updateRecords: (updater: (records: InventoryCheckRecord[]) => InventoryCheckRecord[]) => void
) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<InventoryCheckRecord | null>(null);
  const [items, setItems] = useState<InventoryCheckItem[]>([]);
  
  // 查看盘点单详情
  const viewStockCheck = (record: InventoryCheckRecord) => {
    setSelectedRecord(record);
    setLoading(true);
    
    // 模拟加载盘点项目
    setTimeout(() => {
      const mockItems: InventoryCheckItem[] = [
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
      
      // 如果状态是"盘点中"，则更新项目状态
      const updatedItems = record.status === '盘点中' 
        ? mockItems.map(item => ({ ...item, status: '待盘点' })) 
        : mockItems;
      
      setItems(updatedItems);
      setLoading(false);
      setVisible(true);
    }, 500);
  };
  
  // 开始盘点
  const startStockCheck = (record: InventoryCheckRecord) => {
    if (!record) return;
    
    // 更新记录状态
    const updatedRecord = { ...record, status: '盘点中' };
    setSelectedRecord(updatedRecord);
    
    // 更新所有记录
    updateRecords((currentRecords: InventoryCheckRecord[]) => 
      currentRecords.map((r: InventoryCheckRecord) => r.id === record.id ? updatedRecord : r)
    );
    
    message.success('盘点已开始，请按计划进行盘点工作');
  };
  
  // 完成盘点
  const completeStockCheck = (record: InventoryCheckRecord) => {
    if (!record) return;
    
    // 更新记录状态
    const updatedRecord = { ...record, status: '已完成' };
    setSelectedRecord(updatedRecord);
    
    // 更新所有项目为已盘点
    const updatedItems = items.map(item => {
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
    
    setItems(updatedItems);
    
    // 更新所有记录
    updateRecords((currentRecords: InventoryCheckRecord[]) => 
      currentRecords.map((r: InventoryCheckRecord) => r.id === record.id ? updatedRecord : r)
    );
    
    message.success('盘点已完成');
  };
  
  // 录入盘点结果
  const enterCheckResult = (values: any, item: InventoryCheckItem) => {
    if (!item || !selectedRecord) return;
    
    const actualQuantity = parseFloat(values.actualQuantity);
    const differenceQuantity = actualQuantity - item.systemQuantity;
    
    // 更新项目
    const updatedItems = items.map(i => 
      i.id === item.id 
        ? { 
            ...i, 
            actualQuantity, 
            differenceQuantity,
            status: '已盘点' 
          } 
        : i
    );
    
    setItems(updatedItems);
    
    // 检查是否所有项目都已盘点
    const allChecked = updatedItems.every(i => i.status === '已盘点');
    
    if (allChecked) {
      // 更新记录状态
      const updatedRecord = { ...selectedRecord, status: '已完成' };
      setSelectedRecord(updatedRecord);
      
      // 更新所有记录
      updateRecords((currentRecords: InventoryCheckRecord[]) => 
        currentRecords.map((r: InventoryCheckRecord) => r.id === selectedRecord.id ? updatedRecord : r)
      );
      
      message.success('所有物料已盘点完成，盘点单已更新为已完成状态');
    } else {
      message.success('盘点结果已录入');
    }
  };
  
  return {
    visible,
    loading,
    selectedRecord,
    items,
    viewStockCheck,
    startStockCheck,
    completeStockCheck,
    enterCheckResult,
    closeModal: () => setVisible(false)
  };
}; 