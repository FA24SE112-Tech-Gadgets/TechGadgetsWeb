import React from 'react'
import { FaTachometerAlt, FaRegSun, FaWrench, FaStickyNote, FaRegChartBar, FaRegCalendarAlt } from "react-icons/fa"
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import icon from "~/assets/icon.ico"

const Sidebar = () => {
    return (
        <div className='bg-primary/40 px-[25px] h-screen'>
            <div className='px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]'>
                <div className="h-[80px] w-[80px] rounded-full cursor-pointer flex items-center justify-center relative z-40">
                    <img src={icon} alt="" className="h-full w-full rounded-full object-cover" />
                </div>
            </div>
            <div className='flex items-center gap-[15px] py-[20px] border-b-[1px] border-black cursor-pointer'>
                <FaTachometerAlt color='black' />
                <Link to="/dashboard" className='text-[14px] leading-[20px] font-bold text-black'>Dashboard</Link>
            </div>
            <div className='pt-[15px] border-b-[1px] border-black'>
                <Link to="/specification-unit" className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <FaRegSun color='black' /> 
                        <p className='text-[14px] leading-[20px] font-normal text-black whitespace-nowrap'>Quản lý đơn vị</p> 
                    </div>
                </Link>
                <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <Link to="/category" className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <FaWrench color='black' /> 
                        <p className='text-[14px] leading-[20px] font-normal text-black'>Quản lý danh mục</p>
                    </div>
                    </Link>
                </div>
                <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <Link to="/brand" className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <FaWrench color='black' /> 
                        <p className='text-[14px] leading-[20px] font-normal text-black'>Quản lý thương hiệu</p>
                    </div>
                    </Link>
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
        </div>
    )
}

export default Sidebar