import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card, Input, Button, Space, Tag, Avatar, Select } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { IUser } from '@rocketbird/shared';

const { Search } = Input;

const MemberList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IUser[]>([]);

  const columns: ColumnsType<IUser> = [
    {
      title: '会员',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '等级',
      dataIndex: 'levelName',
      key: 'levelName',
      render: (text) => <Tag color="gold">{text}</Tag>,
    },
    {
      title: '积分',
      dataIndex: 'availablePoints',
      key: 'availablePoints',
    },
    {
      title: '成长值',
      dataIndex: 'growthValue',
      key: 'growthValue',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => navigate(`/members/${record.userId}`)}>
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Search
            placeholder="搜索手机号/昵称"
            allowClear
            enterButton={<SearchOutlined />}
            style={{ width: 300 }}
          />
          <Select placeholder="会员等级" style={{ width: 120 }} allowClear>
            <Select.Option value="1">普通会员</Select.Option>
            <Select.Option value="2">银卡会员</Select.Option>
            <Select.Option value="3">金卡会员</Select.Option>
          </Select>
          <Select placeholder="状态" style={{ width: 100 }} allowClear>
            <Select.Option value="1">正常</Select.Option>
            <Select.Option value="0">禁用</Select.Option>
          </Select>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="userId"
          pagination={{
            total: 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
};

export default MemberList;
