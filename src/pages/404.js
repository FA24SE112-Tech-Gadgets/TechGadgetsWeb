import { Result } from 'antd';
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
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary/80 hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          onClick={handleGoBack}>
          Quay về
        </button>
      }
    />
  );
};

export default ErrorPage;