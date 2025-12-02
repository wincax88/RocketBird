import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Button, theme } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  GiftOutlined,
  CrownOutlined,
  ShoppingOutlined,
  CheckSquareOutlined,
  HeartOutlined,
  CoffeeOutlined,
  ShareAltOutlined,
  MessageOutlined,
  SettingOutlined,
  TeamOutlined,
  SafetyOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuthStore } from '@/stores/auth';

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '数据概览',
  },
  {
    key: '/members',
    icon: <UserOutlined />,
    label: '会员管理',
  },
  {
    key: '/levels',
    icon: <CrownOutlined />,
    label: '等级管理',
  },
  {
    key: 'points',
    icon: <GiftOutlined />,
    label: '积分管理',
    children: [
      { key: '/points/products', label: '积分商品' },
      { key: '/points/orders', label: '兑换订单' },
    ],
  },
  {
    key: 'checkin',
    icon: <CheckSquareOutlined />,
    label: '打卡管理',
    children: [
      { key: '/checkin/themes', label: '打卡主题' },
      { key: '/checkin/records', label: '打卡记录' },
    ],
  },
  {
    key: '/benefits/rules',
    icon: <HeartOutlined />,
    label: '福利管理',
  },
  {
    key: '/meals',
    icon: <CoffeeOutlined />,
    label: '健身餐管理',
  },
  {
    key: '/referral/rules',
    icon: <ShareAltOutlined />,
    label: '推荐管理',
  },
  {
    key: '/feedback',
    icon: <MessageOutlined />,
    label: '反馈管理',
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      { key: '/system/accounts', icon: <TeamOutlined />, label: '账号管理' },
      { key: '/system/roles', icon: <SafetyOutlined />, label: '角色管理' },
      { key: '/system/logs', icon: <FileTextOutlined />, label: '操作日志' },
    ],
  },
];

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token: themeToken } = theme.useToken();
  const { adminInfo, logout } = useAuthStore();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          borderRight: `1px solid ${themeToken.colorBorderSecondary}`,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: `1px solid ${themeToken.colorBorderSecondary}`,
          }}
        >
          <h1 style={{ fontSize: collapsed ? 16 : 18, margin: 0, color: themeToken.colorPrimary }}>
            {collapsed ? 'RB' : 'RocketBird'}
          </h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['points', 'checkin', 'system']}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${themeToken.colorBorderSecondary}`,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} src={adminInfo?.avatar} />
              <span>{adminInfo?.realName || adminInfo?.username}</span>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: '#fff',
            borderRadius: themeToken.borderRadiusLG,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
