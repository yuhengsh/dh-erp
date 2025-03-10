import { useState, useEffect } from 'react';
import { InventoryTransaction } from '../types';

/**
 * 库存流水表格数据钩子
 */
export const useTransactionTable = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<InventoryTransaction[]>([]);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [filters, setFilters] = useState<any>({});
  
  // 加载交易数据
  const loadData = () => {
    setLoading(true);
    
    // 模拟API调用，实际项目中应该调用后端API
    setTimeout(() => {
      const mockData: InventoryTransaction[] = [
        {
          id: '1',
          transactionNo: 'TRN-2023042501',
          transactionType: '采购入库',
          materialCode: 'M001',
          materialName: '钢板',
          warehouse: '原材料仓',
          location: 'A-01-01',
          quantity: 100,
          unit: '张',
          direction: '入库',
          beforeQuantity: 50,
          afterQuantity: 150,
          relatedOrderNo: 'PO-2023-001',
          operator: '张三',
          createdAt: '2023-04-25 10:30:00',
          batch: 'B20230425-01'
        },
        {
          id: '2',
          transactionNo: 'TRN-2023042502',
          transactionType: '生产领料',
          materialCode: 'M001',
          materialName: '钢板',
          warehouse: '原材料仓',
          location: 'A-01-01',
          quantity: 20,
          unit: '张',
          direction: '出库',
          beforeQuantity: 150,
          afterQuantity: 130,
          relatedOrderNo: 'PP-2023-005',
          operator: '李四',
          createdAt: '2023-04-25 14:15:00',
          batch: 'B20230425-01'
        },
        {
          id: '3',
          transactionNo: 'TRN-2023042601',
          transactionType: '成品入库',
          materialCode: 'P001',
          materialName: '金属构件',
          warehouse: '成品仓',
          location: 'B-02-03',
          quantity: 30,
          unit: '件',
          direction: '入库',
          beforeQuantity: 100,
          afterQuantity: 130,
          relatedOrderNo: 'MO-2023-008',
          operator: '王五',
          createdAt: '2023-04-26 09:45:00',
          batch: 'B20230426-01'
        },
        {
          id: '4',
          transactionNo: 'TRN-2023042602',
          transactionType: '销售出库',
          materialCode: 'P001',
          materialName: '金属构件',
          warehouse: '成品仓',
          location: 'B-02-03',
          quantity: 10,
          unit: '件',
          direction: '出库',
          beforeQuantity: 130,
          afterQuantity: 120,
          relatedOrderNo: 'SO-2023-012',
          operator: '赵六',
          createdAt: '2023-04-26 16:20:00',
          batch: 'B20230426-01'
        },
        {
          id: '5',
          transactionNo: 'TRN-2023042701',
          transactionType: '库存调整',
          materialCode: 'M002',
          materialName: '螺丝',
          warehouse: '辅料仓',
          location: 'C-05-10',
          quantity: 5,
          unit: '箱',
          direction: '入库',
          beforeQuantity: 15,
          afterQuantity: 20,
          relatedOrderNo: 'ADJ-2023-003',
          operator: '张三',
          createdAt: '2023-04-27 11:10:00',
          batch: 'B20230420-01'
        }
      ];
      
      setTransactions(mockData);
      setFilteredTransactions(mockData);
      setLoading(false);
    }, 500);
  };
  
  // 首次加载
  useEffect(() => {
    loadData();
  }, []);
  
  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
    applyFilters(value, dateRange, filters);
  };
  
  // 处理日期范围变化
  const handleDateRangeChange = (dates: any) => {
    let range: [string, string] | null = null;
    
    if (dates && dates.length === 2) {
      range = [
        dates[0].format('YYYY-MM-DD'),
        dates[1].format('YYYY-MM-DD')
      ];
    }
    
    setDateRange(range);
    applyFilters(searchText, range, filters);
  };
  
  // 处理筛选条件变化
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    applyFilters(searchText, dateRange, newFilters);
  };
  
  // 应用所有筛选条件
  const applyFilters = (search: string, dates: [string, string] | null, filterValues: any) => {
    let filtered = [...transactions];
    
    // 应用搜索条件
    if (search) {
      const lowercaseSearch = search.toLowerCase();
      filtered = filtered.filter(item => 
        item.transactionNo.toLowerCase().includes(lowercaseSearch) ||
        item.materialName.toLowerCase().includes(lowercaseSearch) ||
        item.materialCode.toLowerCase().includes(lowercaseSearch) ||
        item.relatedOrderNo.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    // 应用日期范围筛选
    if (dates) {
      filtered = filtered.filter(item => {
        const itemDate = item.createdAt.split(' ')[0]; // 提取日期部分
        return itemDate >= dates[0] && itemDate <= dates[1];
      });
    }
    
    // 应用其他筛选条件
    if (filterValues.direction) {
      filtered = filtered.filter(item => item.direction === filterValues.direction);
    }
    
    if (filterValues.transactionType) {
      filtered = filtered.filter(item => item.transactionType === filterValues.transactionType);
    }
    
    if (filterValues.warehouse) {
      filtered = filtered.filter(item => item.warehouse === filterValues.warehouse);
    }
    
    setFilteredTransactions(filtered);
  };
  
  return {
    loading,
    transactions: filteredTransactions,
    handleSearch,
    handleDateRangeChange,
    handleFilterChange,
    loadData
  };
};

/**
 * 库存流水详情钩子
 */
export const useTransactionDetail = () => {
  const [visible, setVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<InventoryTransaction | null>(null);
  
  // 查看流水详情
  const viewTransaction = (record: InventoryTransaction) => {
    setSelectedTransaction(record);
    setVisible(true);
  };
  
  return {
    visible,
    selectedTransaction,
    viewTransaction,
    closeModal: () => setVisible(false)
  };
}; 