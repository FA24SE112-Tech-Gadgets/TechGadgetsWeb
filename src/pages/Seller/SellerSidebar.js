import React from 'react';
import { useNavigate } from 'react-router-dom';
import icon from "~/assets/icon.ico";
import { ShoppingCartCheckoutOutlined, StackedBarChartOutlined } from '@mui/icons-material';
import { AppstoreAddOutlined } from '@ant-design/icons';

const SellerSidebar = ({ minHeight = 'min-h-screen' }) => {
    const navigate = useNavigate();

    return (
        <div className={`bg-primary/40 px-[25px] ${minHeight} relative`}>
            <div className='px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]'>
                <div className="h-[80px] w-[80px] rounded-full cursor-pointer flex items-center justify-center relative z-40">
                    <img src={icon} alt="" className="h-full w-full rounded-full object-cover" />
                </div>
            </div>

            <div className='pt-[15px] border-b-[1px] border-black'>
                <h2 className="text-sm font-semibold text-black/60 mb-4 px-3">MENU QUẢN LÝ</h2>
                <div onClick={() => navigate('/seller/Order-management')} className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <ShoppingCartCheckoutOutlined className="text-black" />
                        <p className='text-[14px] leading-[20px] font-normal text-black'>Quản lý đơn hàng</p>
                    </div>
                </div>

                <div onClick={() => navigate('/all-products')} className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <AppstoreAddOutlined className="text-black" />
                        <p className='text-[14px] leading-[20px] font-normal text-black'>Danh sách sản phẩm</p>
                    </div>
                </div>

                <div onClick={() => navigate('/seller/manage-reviews-gadgets')} className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <AppstoreAddOutlined className="text-black" />
                        <p className='text-[14px] leading-[20px] font-normal text-black'>Đánh giá sản phẩm</p>
                    </div>
                </div>

                <div onClick={() => navigate('/seller/transaction-history')} className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <StackedBarChartOutlined className="text-black" />
                        <p className='text-[14px] leading-[20px] font-normal text-black'>Lịch sử giao dịch</p>
                    </div>
                </div>
            </div>
            </div>
    );
};

export default SellerSidebar;