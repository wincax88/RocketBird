import { Card } from 'antd';
import { useParams } from 'react-router-dom';

const MemberDetail = () => {
  const { userId } = useParams();

  return (
    <div>
      <Card title={`会员详情 - ${userId}`}>
        <p>会员详情页面开发中...</p>
      </Card>
    </div>
  );
};

export default MemberDetail;
