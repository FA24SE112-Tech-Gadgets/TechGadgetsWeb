import React from 'react';
import { Layout, Menu } from 'antd';
import { ShoppingCartOutlined, AppstoreOutlined, BarChartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const SellerSidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        {
            key: 'orders',
            icon: <ShoppingCartOutlined />,
            title: 'Quản lý đơn hàng',
            children: [
                { key: 'bulkProcessing', label: 'Xử lý đơn hàng', route: '/seller/Order-management' },
            ],
        },
        {
            key: 'products',
            icon: <AppstoreOutlined />,
            title: 'Quản lý sản phẩm',
            children: [
                { key: 'allProducts', label: 'Danh sách sản phẩm', route: '/all-products' },
                { key: 'manageProducts', label: 'Đánh giá sản phẩm', route: '/seller/manage-reviews-gadgets' },
            ],
        },
        {
            key: 'marketing',
            icon: <BarChartOutlined />,
            title: 'Ví của tôi',
            children: [
                { key: 'marketingChannels', label: 'Lịch sử giao dịch', route: '/seller/transaction-history' },
            ],
        },
    ];

    const handleMenuClick = (route) => {
        navigate(route);
    };

    return (
        <Sider
            width={250}
            className="bg-primary/80 shadow-md"
            style={{ minHeight: '100vh' }}
        >
            {/* Menu Section */}
            <Menu
                mode="inline"
                defaultOpenKeys={['orders', 'products', 'marketing']}
                style={{ height: '100%', borderRight: 0 }}
                className="text-black bg-primary/80"
            >
                {menuItems.map(item => (
                    <Menu.SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {item.children.map(child => (
                            <Menu.Item
                                key={child.key}
                                onClick={() => handleMenuClick(child.route)}
                                className="hover:bg-gray-100"
                                style={{ padding: '10px 20px' }}
                            >
                                {child.label}
                            </Menu.Item>
                        ))}
                    </Menu.SubMenu>
                ))}
            </Menu>
        </Sider>
    );
};

export default SellerSidebar;