import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// 任务类型定义
export interface Task {
  id: string;
  title: string;
  description: string;
  department: string;
  priority: string;
  createdAt: string;
  type: string;
  relatedId: string;
  status?: string;
  completedAt?: string;
  result?: string;
  remarks?: string;
  handler?: string;
}

// 通知类型定义
export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'warning' | 'success' | 'info';
  read: boolean;
  relatedType: string;
  relatedId: string;
}

// 上下文类型定义
interface TaskContextType {
  pendingTasks: Task[];
  completedTasks: Task[];
  notifications: Notification[];
  addTask: (task: Task) => void;
  completeTask: (taskId: string, result: string, remarks?: string) => void;
  removeTask: (taskId: string) => void;
  transferTask: (taskId: string, to: string, reason: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  addNotification: (notification: Notification) => void;
  getTaskById: (taskId: string) => Task | undefined;
  getTaskByRelatedId: (relatedId: string) => Task | undefined;
}

// 创建上下文
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// 初始待办任务
const initialPendingTasks: Task[] = [
  {
    id: '1',
    title: '采购申请审核',
    description: '需要审核来自生产部门的原材料采购申请',
    department: '采购部',
    priority: '高',
    createdAt: '2023-09-15 09:30',
    type: 'purchase_request',
    relatedId: 'PR-2023-002'
  },
  {
    id: '2',
    title: '销售订单确认',
    description: '新客户订单需要确认交期和价格',
    department: '销售部',
    priority: '高',
    createdAt: '2023-09-15 10:15',
    type: 'sales_order',
    relatedId: 'SO-2023-045'
  },
  {
    id: '3',
    title: '物料入库待检',
    description: '钢板已到货，需要进行质量检验',
    department: '质检部',
    priority: '中',
    createdAt: '2023-09-14 16:45',
    type: 'stock_in',
    relatedId: 'IN-2023-078'
  },
  {
    id: '4',
    title: '生产计划审核',
    description: '下周生产计划需要审批',
    department: '生产部',
    priority: '中',
    createdAt: '2023-09-14 14:30',
    type: 'production_plan',
    relatedId: 'PP-2023-034'
  },
];

// 初始已完成任务
const initialCompletedTasks: Task[] = [
  {
    id: '5',
    title: '采购订单确认',
    description: '确认焊条采购订单',
    department: '采购部',
    priority: '中',
    createdAt: '2023-09-13 10:00',
    completedAt: '2023-09-13 15:20',
    type: 'purchase_order',
    relatedId: 'PO-2023-067'
  },
  {
    id: '6',
    title: '销售报价审核',
    description: '审核国际客户销售报价',
    department: '销售部',
    priority: '高',
    createdAt: '2023-09-12 09:30',
    completedAt: '2023-09-12 11:45',
    type: 'sales_quotation',
    relatedId: 'SQ-2023-023'
  },
];

// 初始通知
const initialNotifications: Notification[] = [
  {
    id: '1',
    title: '物料库存不足提醒',
    description: '5种物料低于安全库存，需要及时补充',
    time: '2023-09-15 08:30',
    type: 'warning',
    read: false,
    relatedType: 'inventory',
    relatedId: 'low-stock'
  },
  {
    id: '2',
    title: '生产任务已完成',
    description: '订单SL-2023-089的生产任务已完成，等待质检',
    time: '2023-09-14 16:20',
    type: 'success',
    read: false,
    relatedType: 'production',
    relatedId: 'SL-2023-089'
  },
  {
    id: '3',
    title: '系统维护通知',
    description: '系统将于本周日进行例行维护，请提前做好工作安排',
    time: '2023-09-13 10:00',
    type: 'info',
    read: false,
    relatedType: 'system',
    relatedId: 'maintenance'
  },
];

// 提供者组件
export const TaskProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // 状态
  const [pendingTasks, setPendingTasks] = useState<Task[]>(initialPendingTasks);
  const [completedTasks, setCompletedTasks] = useState<Task[]>(initialCompletedTasks);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // 从本地存储加载数据
  useEffect(() => {
    const storedPendingTasks = localStorage.getItem('pendingTasks');
    const storedCompletedTasks = localStorage.getItem('completedTasks');
    const storedNotifications = localStorage.getItem('notifications');

    if (storedPendingTasks) setPendingTasks(JSON.parse(storedPendingTasks));
    if (storedCompletedTasks) setCompletedTasks(JSON.parse(storedCompletedTasks));
    if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
  }, []);

  // 保存数据到本地存储
  useEffect(() => {
    localStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [pendingTasks, completedTasks, notifications]);

  // 添加新任务
  const addTask = (task: Task) => {
    setPendingTasks(prev => [task, ...prev]);
  };

  // 完成任务
  const completeTask = (taskId: string, result: string, remarks?: string) => {
    const task = pendingTasks.find(t => t.id === taskId);
    if (task) {
      // 从待办任务中移除
      setPendingTasks(prev => prev.filter(t => t.id !== taskId));
      
      // 添加到已完成任务
      const completedTask = {
        ...task,
        completedAt: new Date().toLocaleString(),
        result,
        remarks
      };
      
      setCompletedTasks(prev => [completedTask, ...prev]);
    }
  };

  // 移除任务
  const removeTask = (taskId: string) => {
    setPendingTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // 转交任务
  const transferTask = (taskId: string, to: string, reason: string) => {
    // 在实际应用中，这里会有转交给其他用户的逻辑
    // 现在我们只是简单地从当前用户的待办列表中移除
    setPendingTasks(prev => prev.filter(t => t.id !== taskId));
    
    // 可以添加一个通知，表示任务已转交
    addNotification({
      id: Date.now().toString(),
      title: '任务已转交',
      description: `您的任务已转交给${to}，原因：${reason}`,
      time: new Date().toLocaleString(),
      type: 'info',
      read: false,
      relatedType: 'task',
      relatedId: taskId
    });
  };

  // 标记通知为已读
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(item => 
        item.id === notificationId 
          ? { ...item, read: true } 
          : item
      )
    );
  };

  // 添加新通知
  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  // 根据ID获取任务
  const getTaskById = (taskId: string) => {
    return pendingTasks.find(t => t.id === taskId) || 
           completedTasks.find(t => t.id === taskId);
  };

  // 根据关联ID获取任务
  const getTaskByRelatedId = (relatedId: string) => {
    return pendingTasks.find(t => t.relatedId === relatedId) || 
           completedTasks.find(t => t.relatedId === relatedId);
  };

  // 上下文值
  const value = {
    pendingTasks,
    completedTasks,
    notifications,
    addTask,
    completeTask,
    removeTask,
    transferTask,
    markNotificationAsRead,
    addNotification,
    getTaskById,
    getTaskByRelatedId
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// 自定义钩子
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext; 