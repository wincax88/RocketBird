import { Row, Col, Card, Statistic } from 'antd';
import {
  UserOutlined,
  GiftOutlined,
  CheckSquareOutlined,
  RiseOutlined,
} from '@ant-design/icons';

const Dashboard = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>数据概览</h2>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总会员数"
              value={12580}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日新增"
              value={68}
              prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
              suffix="人"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日打卡"
              value={256}
              prefix={<CheckSquareOutlined style={{ color: '#ff6b35' }} />}
              suffix="次"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="积分消耗"
              value={15800}
              prefix={<GiftOutlined style={{ color: '#faad14' }} />}
              suffix="分"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="会员增长趋势">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              图表开发中...
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="积分流动分析">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              图表开发中...
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="等级分布">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              图表开发中...
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="打卡排行榜">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              排行榜开发中...
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
