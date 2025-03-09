import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Drawer,
  Form,
  Select,
  InputNumber,
  Popconfirm,
  message,
  Typography,
  Divider,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Option } = Select;

interface Material {
  id: string;
  name: string;
  code: string;
  category: string;
  spec: string;
  unit: string;
  safetyStock: number;
  currentStock: number;
  purchasePrice: number;
  supplier: string;
  status: string;
}

// Mock data
const mockMaterials: Material[] = [
  {
    id: '1',
    name: '船板Q235B',
    code: 'CP-001',
    category: '原料',
    spec: '10mm×1500mm×6000mm',
    unit: '吨',
    safetyStock: 50,
    currentStock: 62,
    purchasePrice: 5600,
    supplier: '鞍钢股份',
    status: '正常',
  },
  {
    id: '2',
    name: '型钢H型钢',
    code: 'XG-002',
    category: '原料',
    spec: 'HW 200×200×8×12',
    unit: '吨',
    safetyStock: 30,
    currentStock: 25,
    purchasePrice: 6200,
    supplier: '首钢集团',
    status: '库存不足',
  },
  {
    id: '3',
    name: '焊条E4303',
    code: 'HD-001',
    category: '辅料',
    spec: 'Φ3.2mm',
    unit: '箱',
    safetyStock: 100,
    currentStock: 180,
    purchasePrice: 560,
    supplier: '天津大桥焊材',
    status: '正常',
  },
  {
    id: '4',
    name: '液压油',
    code: 'YY-001',
    category: '辅料',
    spec: '46#',
    unit: '桶',
    safetyStock: 20,
    currentStock: 18,
    purchasePrice: 1100,
    supplier: '长城润滑油',
    status: '库存不足',
  },
  {
    id: '5',
    name: '电机220kW',
    code: 'DJ-001',
    category: '成品',
    spec: 'YE3-315M-4',
    unit: '台',
    safetyStock: 5,
    currentStock: 7,
    purchasePrice: 45000,
    supplier: '上海电气',
    status: '正常',
  },
];

const Materials: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [searchText, setSearchText] = useState('');
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  // Filter materials based on search text
  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchText.toLowerCase()) ||
      material.code.toLowerCase().includes(searchText.toLowerCase()) ||
      material.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const showDrawer = (material?: Material) => {
    if (material) {
      setEditingMaterial(material);
      form.setFieldsValue(material);
    } else {
      setEditingMaterial(null);
      form.resetFields();
    }
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  const handleDelete = (id: string) => {
    setMaterials(materials.filter((material) => material.id !== id));
    message.success('物料删除成功');
  };

  const handleSubmit = (values: any) => {
    if (editingMaterial) {
      // Update existing material
      setMaterials(
        materials.map((material) =>
          material.id === editingMaterial.id ? { ...material, ...values } : material
        )
      );
      message.success('物料更新成功');
    } else {
      // Add new material
      const newMaterial: Material = {
        id: `${Date.now()}`,
        ...values,
        status: values.currentStock >= values.safetyStock ? '正常' : '库存不足',
      };
      setMaterials([...materials, newMaterial]);
      message.success('物料添加成功');
    }
    closeDrawer();
  };

  const columns: ColumnsType<Material> = [
    {
      title: '物料编码',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: '物料名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: '原料', value: '原料' },
        { text: '辅料', value: '辅料' },
        { text: '成品', value: '成品' },
      ],
      onFilter: (value, record) => record.category === value,
      render: (text) => {
        let color = 'blue';
        if (text === '辅料') color = 'green';
        if (text === '成品') color = 'purple';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '规格型号',
      dataIndex: 'spec',
      key: 'spec',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '安全库存',
      dataIndex: 'safetyStock',
      key: 'safetyStock',
      sorter: (a, b) => a.safetyStock - b.safetyStock,
    },
    {
      title: '当前库存',
      dataIndex: 'currentStock',
      key: 'currentStock',
      sorter: (a, b) => a.currentStock - b.currentStock,
    },
    {
      title: '采购单价(元)',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      sorter: (a, b) => a.purchasePrice - b.purchasePrice,
      render: (text) => `¥${text.toLocaleString()}`,
    },
    {
      title: '主要供应商',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        const color = text === '正常' ? 'success' : 'error';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showDrawer(record)}
          />
          <Popconfirm
            title="确定要删除此物料吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>物料管理</Title>
        <Space>
          <Input
            placeholder="搜索物料名称/编码"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showDrawer()}>
            新增物料
          </Button>
          <Button icon={<ImportOutlined />}>导入</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredMaterials}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: 1300 }}
        />
      </Card>

      <Drawer
        title={editingMaterial ? '编辑物料' : '新增物料'}
        width={520}
        onClose={closeDrawer}
        open={visible}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button onClick={closeDrawer}>取消</Button>
            <Button type="primary" onClick={form.submit}>
              保存
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editingMaterial || {}}
        >
          <Form.Item
            name="code"
            label="物料编码"
            rules={[{ required: true, message: '请输入物料编码' }]}
          >
            <Input placeholder="请输入物料编码" />
          </Form.Item>
          <Form.Item
            name="name"
            label="物料名称"
            rules={[{ required: true, message: '请输入物料名称' }]}
          >
            <Input placeholder="请输入物料名称" />
          </Form.Item>
          <Form.Item
            name="category"
            label="类别"
            rules={[{ required: true, message: '请选择物料类别' }]}
          >
            <Select placeholder="请选择物料类别">
              <Option value="原料">原料</Option>
              <Option value="辅料">辅料</Option>
              <Option value="成品">成品</Option>
            </Select>
          </Form.Item>
          <Form.Item name="spec" label="规格型号">
            <Input placeholder="请输入规格型号" />
          </Form.Item>
          <Form.Item
            name="unit"
            label="单位"
            rules={[{ required: true, message: '请选择单位' }]}
          >
            <Select placeholder="请选择单位">
              <Option value="个">个</Option>
              <Option value="台">台</Option>
              <Option value="件">件</Option>
              <Option value="吨">吨</Option>
              <Option value="米">米</Option>
              <Option value="卷">卷</Option>
              <Option value="箱">箱</Option>
              <Option value="桶">桶</Option>
            </Select>
          </Form.Item>

          <Divider />

          <Form.Item
            name="safetyStock"
            label="安全库存"
            rules={[{ required: true, message: '请输入安全库存' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="currentStock"
            label="当前库存"
            rules={[{ required: true, message: '请输入当前库存' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="purchasePrice"
            label="采购单价(元)"
            rules={[{ required: true, message: '请输入采购单价' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="supplier" label="主要供应商">
            <Input placeholder="请输入主要供应商" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Materials; 