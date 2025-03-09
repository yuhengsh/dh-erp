# 东红船业 ERP系统

东红船业 ERP系统是一个专为船舶制造企业设计的企业资源计划系统，提供全面的企业经营管理解决方案。

## 功能概述

系统包含以下核心模块：

- **大屏看板**：运营驾驶舱，展示企业核心经营数据
- **基础资料管理**：
  - 物料管理：对原料、半成品、辅料、固定资产、产成品的编码管理
  - BOM管理：多级BOM支持复杂组件结构管理
  - 其他基础设置：财务设置、系统设置等
- **任务中心**：为不同角色提供专属工作台，显示与用户角色相关的任务
- **销售管理**：销售订单录入与管理
- **生产管理**：生产计划与排程，物料需求分析
- **采购管理**：采购申请、采购订单管理
- **仓库管理**：与所有业务模块集成的库存管理
- **附加模块**：
  - 技术文档管理
  - 质量管理
  - 设备管理
  - 财务管理集成

## 技术栈

### 前端
- React 18
- TypeScript
- Ant Design 5.24.3
- React Router
- Axios

### 后端（规划中）
- Java
- PostgreSQL
- Spring Boot
- Spring Security
- MyBatis

## 安装与启动

### 开发环境要求
- Node.js 16+ 
- npm 8+ 或 yarn 1.22+

### 安装步骤

1. 克隆仓库
```
git clone https://github.com/your-org/dh-erp.git
cd dh-erp
```

2. 安装依赖
```
npm install
```

3. 启动开发服务器
```
npm start
```

应用将在 http://localhost:3000 运行

## 项目结构

```
dh-erp/
├── public/                 # 静态资源
├── src/                    # 源代码目录
│   ├── assets/             # 图片、图标等资源
│   ├── components/         # 可复用组件
│   ├── contexts/           # React Context
│   ├── hooks/              # 自定义Hooks
│   ├── layouts/            # 布局组件
│   ├── pages/              # 页面组件
│   │   ├── dashboard/      # 大屏看板
│   │   ├── basicData/      # 基础资料
│   │   │   ├── materials/  # 物料管理
│   │   │   ├── bom/        # BOM管理
│   │   │   └── settings/   # 其他设置
│   │   ├── taskCenter/     # 任务中心
│   │   ├── sales/          # 销售管理
│   │   ├── production/     # 生产管理
│   │   ├── procurement/    # 采购管理
│   │   ├── warehouse/      # 仓库管理
│   │   ├── techDocs/       # 技术文档管理
│   │   ├── quality/        # 质量管理
│   │   ├── equipment/      # 设备管理
│   │   └── finance/        # 财务管理集成
│   ├── services/           # API请求服务
│   ├── styles/             # 全局样式
│   ├── types/              # TypeScript类型定义
│   ├── utils/              # 工具函数
│   ├── App.tsx             # 应用入口组件
│   └── index.tsx           # 入口文件
├── package.json            # 依赖和脚本
└── tsconfig.json           # TypeScript配置
```

## 部署说明

### 测试环境
```
npm run build
```
将生成的`build`目录部署到测试服务器。

### 生产环境
生产环境的部署需要配置正确的后端API地址，并确保所有安全措施已启用。

## 实施计划

系统采用分阶段实施方式：

1. 先上线仓库管理模块（对于拥有大量物料的船厂尤为重要）
2. 添加采购和销售模块
3. 最后实施生产和质量管理模块

## 许可证

[MIT License](LICENSE)

## 联系方式

如有问题或建议，请联系开发团队：erp_support@donghongshipyard.com
