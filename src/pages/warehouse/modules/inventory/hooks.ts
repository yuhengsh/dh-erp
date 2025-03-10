import { useState, useEffect } from 'react';
import { InventoryItem, FilterConditions } from '../types';

/**
 * 库存查询表格钩子函数
 */
export const useInventoryTable = () => {
  const [loading, setLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [filterConditions, setFilterConditions] = useState<FilterConditions>({});
  const [warehouseOptions, setWarehouseOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<{value: string; label: string}[]>([]);
  
  // 加载库存数据
  const loadData = () => {
    setLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      const mockData: InventoryItem[] = [
        {
          id: '1',
          materialCode: 'M001',
          materialName: '钢板',
          specification: '2mm*1000mm*2000mm',
          category: '原材料',
          warehouse: '原材料仓',
          location: 'A-01-01',
          batch: 'B20230425-01',
          quantity: 150,
          unit: '张',
          safetyStock: 50,
          statusCode: 'normal',
          lastUpdated: '2023-04-25 14:15:00',
          costPrice: 200,
          totalValue: 30000
        },
        {
          id: '2',
          materialCode: 'M002',
          materialName: '螺丝',
          specification: 'M5*15mm',
          category: '辅料',
          warehouse: '辅料仓',
          location: 'C-05-10',
          batch: 'B20230420-01',
          quantity: 20,
          unit: '箱',
          safetyStock: 10,
          statusCode: 'low',
          lastUpdated: '2023-04-27 11:10:00',
          costPrice: 100,
          totalValue: 2000
        },
        {
          id: '3',
          materialCode: 'P001',
          materialName: '金属构件',
          specification: '标准件A型',
          category: '成品',
          warehouse: '成品仓',
          location: 'B-02-03',
          batch: 'B20230426-01',
          quantity: 120,
          unit: '件',
          safetyStock: 30,
          statusCode: 'normal',
          lastUpdated: '2023-04-26 16:20:00',
          costPrice: 1500,
          totalValue: 180000
        },
        {
          id: '4',
          materialCode: 'M003',
          materialName: '铝板',
          specification: '3mm*1200mm*2400mm',
          category: '原材料',
          warehouse: '原材料仓',
          location: 'A-02-02',
          batch: 'B20230422-01',
          quantity: 80,
          unit: '张',
          safetyStock: 100,
          statusCode: 'low',
          lastUpdated: '2023-04-22 10:30:00',
          costPrice: 300,
          totalValue: 24000
        },
        {
          id: '5',
          materialCode: 'M004',
          materialName: '塑料粒子',
          specification: '白色ABS',
          category: '原材料',
          warehouse: '原材料仓',
          location: 'A-03-01',
          batch: 'B20230420-02',
          quantity: 500,
          unit: 'kg',
          safetyStock: 200,
          statusCode: 'normal',
          lastUpdated: '2023-04-20 15:45:00',
          costPrice: 20,
          totalValue: 10000
        }
      ];
      
      // 提取筛选选项
      const warehouses = Array.from(new Set(mockData.map(item => item.warehouse)));
      const categories = Array.from(new Set(mockData.map(item => item.category)));
      const statuses = [
        { value: 'normal', label: '正常' },
        { value: 'low', label: '库存不足' },
        { value: 'excess', label: '库存过高' }
      ];
      
      setWarehouseOptions(warehouses);
      setCategoryOptions(categories);
      setStatusOptions(statuses);
      setInventoryItems(mockData);
      setFilteredItems(mockData);
      setLoading(false);
    }, 500);
  };
  
  // 首次加载
  useEffect(() => {
    loadData();
  }, []);
  
  // 处理过滤条件变化
  const handleFilterChange = (newFilters: FilterConditions) => {
    setFilterConditions({ ...filterConditions, ...newFilters });
    applyFilters({ ...filterConditions, ...newFilters });
  };
  
  // 重置筛选条件
  const resetFilters = () => {
    setFilterConditions({});
    setFilteredItems(inventoryItems);
  };
  
  // 应用筛选
  const applyFilters = (filters: FilterConditions) => {
    let filtered = [...inventoryItems];
    
    // 关键词搜索
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.materialCode.toLowerCase().includes(searchLower) ||
          item.materialName.toLowerCase().includes(searchLower) ||
          item.specification.toLowerCase().includes(searchLower) ||
          item.batch.toLowerCase().includes(searchLower)
      );
    }
    
    // 仓库筛选
    if (filters.warehouse) {
      filtered = filtered.filter(item => item.warehouse === filters.warehouse);
    }
    
    // 物料类别筛选
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    
    // 状态筛选
    if (filters.status) {
      filtered = filtered.filter(item => item.statusCode === filters.status);
    }
    
    setFilteredItems(filtered);
  };
  
  return {
    loading,
    inventoryItems: filteredItems,
    filterConditions,
    warehouseOptions,
    categoryOptions,
    statusOptions,
    handleFilterChange,
    resetFilters,
    loadData
  };
};

/**
 * 库存详情钩子函数
 */
export const useInventoryDetail = () => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  // 查看详情
  const viewDetail = (record: InventoryItem) => {
    setSelectedItem(record);
    setVisible(true);
  };
  
  // 关闭详情
  const closeDetail = () => {
    setVisible(false);
  };
  
  return {
    visible,
    selectedItem,
    viewDetail,
    closeDetail
  };
}; 