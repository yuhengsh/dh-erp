import React from 'react';
import { Card } from 'antd';
import { useTransactionTable, useTransactionDetail } from './hooks';
import TransactionTable from './TransactionTable';
import TransactionDetail from './TransactionDetail';

/**
 * 库存流水主模块
 */
const TransactionModule: React.FC = () => {
  // 使用自定义钩子管理表格数据和状态
  const {
    loading,
    transactions,
    handleSearch,
    handleDateRangeChange,
    handleFilterChange,
    loadData
  } = useTransactionTable();
  
  // 使用自定义钩子管理详情模态框
  const {
    visible,
    selectedTransaction,
    viewTransaction,
    closeModal
  } = useTransactionDetail();
  
  return (
    <Card
      title="库存流水管理"
      className="warehouse-card"
      style={{ marginBottom: 16 }}
    >
      {/* 库存流水表格 */}
      <TransactionTable
        loading={loading}
        dataSource={transactions}
        onSearch={handleSearch}
        onDateRangeChange={handleDateRangeChange}
        onFilterChange={handleFilterChange}
        onViewDetail={viewTransaction}
        onRefresh={loadData}
      />
      
      {/* 库存流水详情模态框 */}
      <TransactionDetail
        visible={visible}
        record={selectedTransaction}
        onClose={closeModal}
      />
    </Card>
  );
};

export default TransactionModule; 