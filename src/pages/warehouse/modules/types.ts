/**
 * 库存物料接口
 */
export interface InventoryItem {
  id: string;
  materialCode: string;
  materialName: string;
  specification: string;
  category: string;
  warehouse: string;
  location: string;
  batch: string;
  quantity: number;
  unit: string;
  safetyStock: number;
  statusCode: string;
  lastUpdated: string;
  costPrice: number;
  totalValue: number;
}

/**
 * 入库单接口
 */
export interface InboundOrder {
  id: string;
  orderNo: string;
  orderType: string;
  sourceOrderNo: string;
  sourceType: string;
  status: string;
  createdBy: string;
  createdAt: string;
  approvedBy: string;
  approvedAt: string;
  warehouse: string;
  totalItems: number;
  remarks: string;
}

/**
 * 出库单接口
 */
export interface OutboundOrder {
  id: string;
  orderNo: string;
  orderType: string;
  destinationOrderNo: string;
  destinationType: string;
  status: string;
  createdBy: string;
  createdAt: string;
  approvedBy: string;
  approvedAt: string;
  warehouse: string;
  totalItems: number;
  remarks: string;
}

/**
 * 库存流水接口
 */
export interface InventoryTransaction {
  id: string;
  transactionNo: string;
  transactionType: string;
  materialCode: string;
  materialName: string;
  warehouse: string;
  location: string;
  quantity: number;
  unit: string;
  direction: string;
  beforeQuantity: number;
  afterQuantity: number;
  relatedOrderNo: string;
  operator: string;
  createdAt: string;
  batch: string;
}

/**
 * 库存盘点记录接口
 */
export interface InventoryCheckRecord {
  id: string;
  checkCode: string;
  warehouseName: string;
  checkDate: string;
  checkType: string;
  status: string;
  checkManager: string;
}

/**
 * 库存盘点项目接口
 */
export interface InventoryCheckItem {
  id: string;
  materialCode: string;
  materialName: string;
  systemQuantity: number;
  actualQuantity: number | null;
  differenceQuantity: number | null;
  status: string;
}

/**
 * 入库检验状态接口
 */
export interface InspectionState {
  visible: boolean;
  inboundOrderId: string;
  items: InspectionItem[];
}

/**
 * 检验项目接口
 */
export interface InspectionItem {
  id: string;
  materialCode: string;
  materialName: string;
  specification: string;
  quantity: number;
  unit: string;
  status: string;
  qualifiedQuantity?: number;
  unqualifiedQuantity?: number;
  remarks?: string;
}

/**
 * 库存分析数据接口
 */
export interface InventoryAnalysisData {
  // 库存概览
  totalMaterialCount?: number;
  totalWarehouseCount?: number;
  totalCategoryCount?: number;
  totalInventoryValue?: number;
  categoryDistribution?: Array<{category: string, count: number}>;
  warehouseDistribution?: Array<{warehouse: string, count: number}>;
  
  // 价值分析
  totalValue?: number;
  valueByCategory?: Array<{category: string, value: number, percentage: number}>;
  valueByWarehouse?: Array<{warehouse: string, value: number, percentage: number}>;
  topItems?: Array<InventoryItem>;
  
  // ABC分析
  categoryStats?: Array<{category: string, itemCount: number, totalValue: number, valuePercentage: number}>;
  aItems?: Array<any>;
  
  // 预警分析
  warnings?: Array<{
    materialId: string;
    materialCode: string;
    materialName: string;
    currentQuantity: number;
    minimumStockLevel: number;
    stockLevel: string;
    suggestedOrderQuantity: number;
  }>;
}

/**
 * 筛选条件接口
 */
export interface FilterConditions {
  searchText?: string;
  warehouse?: string;
  category?: string;
  dateRange?: [string, string] | null;
  status?: string;
  statusFilter?: string;
  priorityFilter?: string;
} 