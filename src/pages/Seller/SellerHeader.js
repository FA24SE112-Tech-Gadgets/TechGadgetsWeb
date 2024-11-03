import React, { useEffect, useState } from 'react';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import icon from "~/assets/icon.ico";
import { useNavigate } from 'react-router-dom';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuth from '~/context/auth/useAuth';
import { Wallet } from '@mui/icons-material';

const { Header } = Layout;

const SellerHeader = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [walletAmount, setWalletAmount] = useState(0);
  const [showWalletAmount, setShowWalletAmount] = useState(false);

  const formatWalletAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const fetchWalletAmount = async () => {
    try {
      const response = await AxiosInterceptor.get('/api/users/current');
      setWalletAmount(response.data.wallet.amount);
      console.log("wallet seller",response.data.wallet.amount );
      
    } catch (error) {
      console.error('Error fetching wallet amount:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWalletAmount();
    }
  }, [user]);

  const handleToggleWalletAmount = (e) => {
    e.stopPropagation(); // Prevent dropdown from closing
    setShowWalletAmount(!showWalletAmount);
    if (!showWalletAmount) {
      fetchWalletAmount(); 
    }
  };


  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/sellerProfile')}>
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Item key="wallet" icon={<Wallet/>}>
        <div className=" rounded-lg w-full">
          <div className="flex justify-between items-center">
            <span>Ví của tôi:</span>
            <span className={`font-bold ml-2 ${showWalletAmount ? 'text-green-600 dark:text-green-400' : 'text-black'}`}>
              {showWalletAmount ? formatWalletAmount(walletAmount) : '******'}
            </span>
            <button onClick={handleToggleWalletAmount} className="focus:outline-none ml-2">
              {showWalletAmount ? (
                <FaEyeSlash className="text-gray-500" />
              ) : (
                <FaEye className="text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </Menu.Item>

      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e8e8e8' }}>
      {/* Logo Section */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '10px' }}>
          <img src={icon} alt="Logo" style={{ height: '40px', width: '40px', borderRadius: '50%' }} />
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '15px' }}>
          Tech-Gadget Kênh Người Bán
        </div>
      </div>

      {/* Right-side icons */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Notification Bell */}
        <div style={{ marginRight: '20px', cursor: 'pointer' }}>
          <BellOutlined style={{ fontSize: '20px' }} />
        </div>

        {/* User Profile Dropdown */}
        <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Avatar size="small" icon={<UserOutlined />} />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default SellerHeader;
