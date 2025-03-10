import React from 'react';
import { Card } from 'antd';
import { useInventoryTable, useInventoryDetail } from './hooks';
import InventoryTable from './InventoryTable';
import InventoryDetail from './InventoryDetail';

/**
 * 库存查询主模块
 */
const InventoryModule: React.FC = () => {
  // 使用库存表格钩子函数
  const {
    loading,
    inventoryItems,
    filterConditions,
    warehouseOptions,
    categoryOptions,
    statusOptions,
    handleFilterChange,
    resetFilters,
    loadData
  } = useInventoryTable();
  
  // 使用库存详情钩子函数
  const {
    visible,
    selectedItem,
    viewDetail,
    closeDetail
  } = useInventoryDetail();
  
  // 处理搜索
  const handleSearch = (value: string) => {
    handleFilterChange({ searchText: value });
  };
  
  return (
    <Card 
      title="库存查询" 
      className="warehouse-card"
      style={{ marginBottom: 16 }}
    >
      {/* 库存表格 */}
      <InventoryTable
        loading={loading}
        dataSource={inventoryItems}
        warehouseOptions={warehouseOptions}
        categoryOptions={categoryOptions}
        statusOptions={statusOptions}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onViewDetail={viewDetail}
        onRefresh={loadData}
        onReset={resetFilters}
      />
      
      {/* 库存详情 */}
      <InventoryDetail
        visible={visible}
        record={selectedItem}
        onClose={closeDetail}
      />
    </Card>
  );
};

export default InventoryModule; 