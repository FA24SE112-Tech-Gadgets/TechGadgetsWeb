import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <Result
      status='404'
      title='404'
      subTitle='Xin lỗi, trang bạn truy cập không tồn tại.'
      extra={
        <Button type='primary' className='bg-blueAnt' onClick={handleGoBack}>
          Quay về
        </Button>
      }
    />
  );
};

export default ErrorPage;