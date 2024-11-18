import React from 'react'
import { FaTachometerAlt, FaRegSun, FaWrench, FaStickyNote, FaRegChartBar, FaRegCalendarAlt, FaWpforms, FaSignOutAlt, FaProductHunt } from "react-icons/fa"
import { useNavigate } from 'react-router-dom';
import icon from "~/assets/icon.ico"
import { useDeviceToken } from '~/context/auth/Noti';
import useAuth from '~/context/auth/useAuth';

const Sidebar = ({ minHeight = 'min-h-screen' }) => {
    const navigate = useNavigate();
    const { deleteDeviceToken } = useDeviceToken();
    const { logout, error } = useAuth();

    const handleLogout = async () => {
        console.log("Logout clicked");
        await deleteDeviceToken(); 
        logout();
    };

    return (
        <div className={`bg-primary/40 px-[25px] ${minHeight} relative`}>   
            <div className='px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]'>
                <div className="h-[80px] w-[80px] rounded-full cursor-pointer flex items-center justify-center relative z-40">
                    <img src={icon} alt="" className="h-full w-full rounded-full object-cover" />
                </div>
            </div>
            <div className='pt-[15px] border-b-[1px] border-black'>
                <div onClick={() => navigate('/specification-unit')} className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <FaRegSun color='black' /> 
                        <p className='text-[14px] leading-[20px] font-normal text-black whitespace-nowrap'>Quản lý đơn vị</p> 
                    </div>
                </div>
                <div onClick={() => navigate('/category')} className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <FaWrench color='black' /> 
                        <p className='text-[14px] leading-[20px] font-normal text-black'>Quản lý danh mục</p>
                    </div>
                </div>
                <div onClick={() => navigate('/brand')} className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <FaWrench color='black' /> 
                        <p className='text-[14px] leading-[20px] font-normal text-black'>Quản lý thương hiệu</p>
                    </div>
                </div>
                <div onClick={() => navigate('/manage-seller-application')} className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <FaWpforms color='black' /> 
                        <p className='text-[14px] leading-[20px] font-normal text-black'>Quản lý đơn người bán</p>
                    </div>
                </div>
                <div onClick={() => navigate('/manage-gadget')} className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <FaProductHunt color='black' /> 
                        <p className='text-[14px] leading-[20px] font-normal text-black'>Quản lý sản phẩm</p>
                    </div>
                </div>
            </div>
            <div className='pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3]'>
                <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <FaStickyNote color='black' /> <p className='text-[14px] leading-[20px] font-normal text-black'>Pages</p>
                    </div>
                </div>
                <div className='flex items-center gap-[10px] py-[15px]  cursor-pointer'>
                    <FaRegChartBar color='black' /> <p className='text-[14px] leading-[20px] font-normal text-black'>Charts</p>
                </div>
                <div className='flex items-center gap-[10px] py-[15px] cursor-pointer'>
                    <FaRegCalendarAlt color='black' /> <p className='text-[14px] leading-[20px] font-normal text-black'>Tables</p>
                </div>
            </div>
            <div className='absolute bottom-0 left-0 w-full border-t border-[#EDEDED]/[0.3] p-4'>
                <div 
                    className='flex items-center gap-2 cursor-pointer hover:bg-black/10 p-3 rounded-lg transition-all duration-300'
                    onClick={handleLogout}
                >
                    <FaSignOutAlt color='black' />
                    <p className='text-[14px] font-semibold text-black'>Log out</p>
                </div>
            </div>
        </div>
    )
}

export default Sidebar