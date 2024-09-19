import React from "react";
import { Layout, Menu } from "antd";
import { 
  ShoppingCartOutlined, 
  AppstoreOutlined, 
  BarChartOutlined, 
  ShopOutlined, 
  DollarOutlined 
} from "@ant-design/icons";
import icon from "~/assets/icon.ico";  // Your logo file

const { Sider } = Layout;
const { SubMenu } = Menu;

const SellerSidebar = () => {
  return (
    <Sider 
      width={250} 
      className="bg-primary/40 h-full" // Ensure full height and background color
      style={{ minHeight: '100vh' }}  // Ensure it covers the viewport height
    >
     

      {/* Menu Section */}
      <Menu
        mode="inline"
        defaultOpenKeys={['orders', 'products', 'marketing', 'finance', 'shop']}
        style={{ height: '100%', borderRight: 0 }}
        className="text-black bg-primary/40 h-screen" // Apply the same text color
      >
        {/* Quản lý đơn hàng */}
        <SubMenu key="orders" icon={<ShoppingCartOutlined />} title="Quản lý đơn hàng">
          <Menu.Item key="allOrders">Tất cả</Menu.Item>
          <Menu.Item key="bulkProcessing">Xử lý đơn hàng loạt</Menu.Item>
        </SubMenu>

        {/* Quản lý sản phẩm */}
        <SubMenu key="products" icon={<AppstoreOutlined />} title="Quản lý sản phẩm">
          <Menu.Item key="allProducts">Tất cả sản phẩm</Menu.Item>
          <Menu.Item key="manageProducts">Quản lý sản phẩm</Menu.Item>
        </SubMenu>

        {/* Kênh Marketing */}
        <SubMenu key="marketing" icon={<BarChartOutlined />} title="Kênh Marketing">
          <Menu.Item key="marketingChannels">Kênh Marketing</Menu.Item>
          <Menu.Item key="myAds">Quảng cáo của tôi</Menu.Item>
        </SubMenu>

        {/* Tài chính */}
        <SubMenu key="finance" icon={<DollarOutlined />} title="Tài chính">
          <Menu.Item key="revenue">Doanh thu</Menu.Item>
        </SubMenu>

        {/* Quản lý Shop */}
        <SubMenu key="shop" icon={<ShopOutlined />} title="Quản lý Shop">
          <Menu.Item key="shopReviews">Đánh giá shop</Menu.Item>
          <Menu.Item key="shopProfile">Hồ sơ shop</Menu.Item>
          <Menu.Item key="shopCategories">Danh mục shop</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default SellerSidebar;
