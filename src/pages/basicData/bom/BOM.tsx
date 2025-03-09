import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tree,
  Typography,
  Tabs,
  Modal,
  Form,
  Select,
  InputNumber,
  Divider,
  message,
  Tag,
  Row,
  Col,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  ExportOutlined,
  ImportOutlined,
  InfoCircleOutlined,
  FolderOpenOutlined,
  FileOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Mock materials data
const mockMaterials = [
  { id: '1', name: '船板Q235B', code: 'CP-001', category: '原料', unit: '吨' },
  { id: '2', name: '型钢H型钢', code: 'XG-002', category: '原料', unit: '吨' },
  { id: '3', name: '焊条E4303', code: 'HD-001', category: '辅料', unit: '箱' },
  { id: '4', name: '液压油', code: 'YY-001', category: '辅料', unit: '桶' },
  { id: '5', name: '电机220kW', code: 'DJ-001', category: '成品', unit: '台' },
  { id: '6', name: '钢板支架', code: 'BT-001', category: '半成品', unit: '件' },
  { id: '7', name: '船用泵', code: 'CYB-001', category: '成品', unit: '台' },
  { id: '8', name: '螺栓M12', code: 'LZ-001', category: '辅料', unit: '箱' },
];

// Mock BOM data
const mockBomList = [
  {
    id: '1',
    code: 'BOM-CYB-001',
    name: '船用泵总成',
    product: '船用泵',
    productCode: 'CYB-001',
    version: 'V1.0',
    createdBy: '张工',
    createdAt: '2023-06-10',
    status: '已审核',
  },
  {
    id: '2',
    code: 'BOM-DJ-001',
    name: '电机总成',
    product: '电机220kW',
    productCode: 'DJ-001',
    version: 'V2.1',
    createdBy: '李工',
    createdAt: '2023-07-15',
    status: '已审核',
  },
  {
    id: '3',
    code: 'BOM-BT-001',
    name: '钢板支架总成',
    product: '钢板支架',
    productCode: 'BT-001',
    version: 'V1.2',
    createdBy: '王工',
    createdAt: '2023-08-22',
    status: '草稿',
  },
];

// Mock BOM structure data for tree view
const mockBomStructure: DataNode[] = [
  {
    title: '船用泵总成',
    key: '0-0',
    children: [
      {
        title: '泵体组件',
        key: '0-0-0',
        children: [
          {
            title: '船板Q235B (20kg)',
            key: '0-0-0-0',
            isLeaf: true,
          },
          {
            title: '型钢H型钢 (15kg)',
            key: '0-0-0-1',
            isLeaf: true,
          },
          {
            title: '螺栓M12 (12个)',
            key: '0-0-0-2',
            isLeaf: true,
          },
        ],
      },
      {
        title: '电机组件',
        key: '0-0-1',
        children: [
          {
            title: '电机220kW (1台)',
            key: '0-0-1-0',
            isLeaf: true,
          },
          {
            title: '液压油 (2桶)',
            key: '0-0-1-1',
            isLeaf: true,
          },
        ],
      },
      {
        title: '钢板支架 (2件)',
        key: '0-0-2',
        isLeaf: true,
      },
    ],
  },
];

// Mock BOM details for component list
const mockBomDetails = [
  {
    id: '1',
    parentId: '0',
    level: 1,
    materialName: '泵体组件',
    materialCode: 'BTZ-001',
    category: '半成品',
    quantity: 1,
    unit: '件',
  },
  {
    id: '2',
    parentId: '1',
    level: 2,
    materialName: '船板Q235B',
    materialCode: 'CP-001',
    category: '原料',
    quantity: 20,
    unit: 'kg',
  },
  {
    id: '3',
    parentId: '1',
    level: 2,
    materialName: '型钢H型钢',
    materialCode: 'XG-002',
    category: '原料',
    quantity: 15,
    unit: 'kg',
  },
  {
    id: '4',
    parentId: '1',
    level: 2,
    materialName: '螺栓M12',
    materialCode: 'LZ-001',
    category: '辅料',
    quantity: 12,
    unit: '个',
  },
  {
    id: '5',
    parentId: '0',
    level: 1,
    materialName: '电机组件',
    materialCode: 'DJZ-001',
    category: '半成品',
    quantity: 1,
    unit: '件',
  },
  {
    id: '6',
    parentId: '5',
    level: 2,
    materialName: '电机220kW',
    materialCode: 'DJ-001',
    category: '成品',
    quantity: 1,
    unit: '台',
  },
  {
    id: '7',
    parentId: '5',
    level: 2,
    materialName: '液压油',
    materialCode: 'YY-001',
    category: '辅料',
    quantity: 2,
    unit: '桶',
  },
  {
    id: '8',
    parentId: '0',
    level: 1,
    materialName: '钢板支架',
    materialCode: 'BT-001',
    category: '半成品',
    quantity: 2,
    unit: '件',
  },
];

const BOM: React.FC = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedBom, setSelectedBom] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('1');
  const [bomData, setBomData] = useState(mockBomList);
  const [addComponentModalVisible, setAddComponentModalVisible] = useState(false);
  const [componentForm] = Form.useForm();
  const [selectedParent, setSelectedParent] = useState<string | null>(null);

  // Filter BOM list based on search text
  const filteredBomList = bomData.filter(
    (bom) =>
      bom.name.toLowerCase().includes(searchText.toLowerCase()) ||
      bom.code.toLowerCase().includes(searchText.toLowerCase()) ||
      bom.product.toLowerCase().includes(searchText.toLowerCase())
  );

  const showModal = (bom?: any) => {
    if (bom) {
      setSelectedBom(bom);
      form.setFieldsValue(bom);
    } else {
      setSelectedBom(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleFormSubmit = (values: any) => {
    if (selectedBom) {
      // Update existing BOM
      setBomData(
        bomData.map((bom) =>
          bom.id === selectedBom.id ? { ...bom, ...values } : bom
        )
      );
      message.success('BOM更新成功');
    } else {
      // Add new BOM
      const newBom = {
        id: `${Date.now()}`,
        ...values,
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: '当前用户',
        status: '草稿',
      };
      setBomData([...bomData, newBom]);
      message.success('BOM创建成功');
    }
    setModalVisible(false);
  };

  const handleBomDelete = (id: string) => {
    setBomData(bomData.filter((bom) => bom.id !== id));
    message.success('BOM删除成功');
  };

  const handleBomSelect = (bom: any) => {
    setSelectedBom(bom);
    setActiveTab('2'); // Switch to structure tab
  };

  const showAddComponentModal = (parentId?: string) => {
    setSelectedParent(parentId || '0');
    componentForm.resetFields();
    setAddComponentModalVisible(true);
  };

  const handleAddComponentSubmit = (values: any) => {
    message.success('组件添加成功');
    setAddComponentModalVisible(false);
  };

  // BOM list columns
  const bomListColumns = [
    {
      title: 'BOM编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'BOM名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '产品',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      key: 'productCode',
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '创建日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        const color = text === '已审核' ? 'success' : 'warning';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="text" onClick={() => handleBomSelect(record)}>
            查看结构
          </Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleBomDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  // BOM detail columns
  const bomDetailColumns = [
    {
      title: '层级',
      dataIndex: 'level',
      key: 'level',
      render: (text: number, record: any) => {
        return '—'.repeat(text - 1) + (text > 1 ? ' ' : '') + text;
      },
    },
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      key: 'materialName',
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => {
        let color = 'blue';
        if (text === '辅料') color = 'green';
        if (text === '成品') color = 'purple';
        if (text === '半成品') color = 'orange';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          {record.category === '半成品' && (
            <Button
              type="text"
              icon={<PlusOutlined />}
              onClick={() => showAddComponentModal(record.id)}
            >
              添加子项
            </Button>
          )}
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>BOM管理</Title>
        <Space>
          <Input
            placeholder="搜索BOM名称/编码/产品"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            新建BOM
          </Button>
          <Button icon={<ImportOutlined />}>导入</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="BOM列表" key="1">
            <Table
              columns={bomListColumns}
              dataSource={filteredBomList}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              bordered
            />
          </TabPane>
          <TabPane tab="BOM结构" key="2" disabled={!selectedBom}>
            {selectedBom && (
              <div>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Title level={4}>{selectedBom.name}</Title>
                    <Tag color={selectedBom.status === '已审核' ? 'success' : 'warning'}>
                      {selectedBom.status}
                    </Tag>
                  </Space>
                  <Space>
                    <Button icon={<PlusOutlined />} onClick={() => showAddComponentModal()}>
                      添加组件
                    </Button>
                    <Button icon={<SaveOutlined />}>保存</Button>
                  </Space>
                </div>

                <Row gutter={16}>
                  <Col span={8}>
                    <Card title="BOM树形结构" style={{ marginBottom: 16 }}>
                      <Tree
                        showLine
                        showIcon
                        defaultExpandAll
                        treeData={mockBomStructure}
                        icon={({ isLeaf }) =>
                          isLeaf ? <FileOutlined /> : <FolderOpenOutlined />
                        }
                      />
                    </Card>

                    <Card title="BOM基本信息">
                      <p><strong>产品：</strong> {selectedBom.product}</p>
                      <p><strong>产品编码：</strong> {selectedBom.productCode}</p>
                      <p><strong>版本：</strong> {selectedBom.version}</p>
                      <p><strong>创建人：</strong> {selectedBom.createdBy}</p>
                      <p><strong>创建日期：</strong> {selectedBom.createdAt}</p>
                    </Card>
                  </Col>
                  <Col span={16}>
                    <Card title="BOM组件明细">
                      <Table
                        columns={bomDetailColumns}
                        dataSource={mockBomDetails}
                        rowKey="id"
                        pagination={false}
                        bordered
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* New BOM Modal */}
      <Modal
        title={selectedBom ? '编辑BOM' : '创建BOM'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="BOM编码"
                rules={[{ required: true, message: '请输入BOM编码' }]}
              >
                <Input placeholder="请输入BOM编码" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="BOM名称"
                rules={[{ required: true, message: '请输入BOM名称' }]}
              >
                <Input placeholder="请输入BOM名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="productCode"
                label="产品编码"
                rules={[{ required: true, message: '请选择产品' }]}
              >
                <Select placeholder="请选择产品" onChange={(value, option: any) => {
                  form.setFieldsValue({ product: option.children });
                }}>
                  {mockMaterials.map((material) => (
                    <Option key={material.id} value={material.code}>
                      {material.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="product"
                label="产品名称"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="version"
            label="版本"
            rules={[{ required: true, message: '请输入版本号' }]}
          >
            <Input placeholder="请输入版本号" />
          </Form.Item>

          <Divider />

          <div style={{ color: '#1890ff', marginBottom: 16 }}>
            <InfoCircleOutlined /> 提示: BOM创建后可以在BOM结构标签页中添加组件
          </div>
        </Form>
      </Modal>

      {/* Add Component Modal */}
      <Modal
        title="添加BOM组件"
        open={addComponentModalVisible}
        onOk={() => componentForm.submit()}
        onCancel={() => setAddComponentModalVisible(false)}
        width={600}
      >
        <Form form={componentForm} layout="vertical" onFinish={handleAddComponentSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="materialCode"
                label="物料编码"
                rules={[{ required: true, message: '请选择物料' }]}
              >
                <Select placeholder="请选择物料" onChange={(value, option: any) => {
                  // 通过物料编码自动填充其他字段
                  const material = mockMaterials.find(m => m.code === value);
                  if (material) {
                    componentForm.setFieldsValue({
                      materialName: material.name,
                      category: material.category,
                      unit: material.unit,
                    });
                  }
                }}>
                  {mockMaterials.map((material) => (
                    <Option key={material.id} value={material.code}>
                      {material.code} - {material.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="materialName"
                label="物料名称"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="类别"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unit"
                label="单位"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="quantity"
            label="数量"
            rules={[{ required: true, message: '请输入数量' }]}
          >
            <InputNumber min={0.01} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="parentId"
            label="上级组件"
            initialValue={selectedParent || '0'}
            hidden
          >
            <Input />
          </Form.Item>

          <Tooltip title="用于展示组件在BOM结构中的层级关系" placement="topLeft">
            <Form.Item
              name="level"
              label={<span>层级 <InfoCircleOutlined /></span>}
              initialValue={selectedParent === '0' ? 1 : 2}
            >
              <InputNumber min={1} max={10} disabled style={{ width: '100%' }} />
            </Form.Item>
          </Tooltip>
        </Form>
      </Modal>
    </div>
  );
};

export default BOM; 