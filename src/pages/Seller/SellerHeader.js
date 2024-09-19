import React from 'react';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import icon from "~/assets/icon.ico"; 

const { Header } = Layout;

const userMenu = (
  <Menu>
    <Menu.Item key="profile" icon={<UserOutlined />}>
      Thông tin cá nhân
    </Menu.Item>
    <Menu.Item key="logout" icon={<LogoutOutlined />}>
      Đăng xuất
    </Menu.Item>
  </Menu>
);

const SellerHeader = () => {
  return (
    <Header style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',  borderBottom: '1px solid #e8e8e8' }}>
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
        <Dropdown overlay={userMenu} placement="bottomRight">
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Avatar size="small" icon={<UserOutlined />} />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default SellerHeader;
