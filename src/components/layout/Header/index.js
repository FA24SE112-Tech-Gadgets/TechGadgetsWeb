import React, { useState, useRef } from "react";
import Logo from "~/assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaCaretDown, FaBell } from "react-icons/fa";
import DarkMode from "./DarkMode";
import useAuth from "~/context/auth/useAuth";
import R from "~/assets/R.png";
import { Link } from "react-router-dom";
import Notifications from "~/Notification/Notification";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const { user, logout } = useAuth(); 
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout clicked");
    logout();
  };

  const showProfile = () => {
    setOpen(!open);
  };

  const handleNewNotification = (newCount, newNotifications) => {
    setNotificationCount(newCount);
    setNotifications(newNotifications);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery) {
        navigate(`/search?q=${searchQuery}`);
      }
    }
  };

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      {/* upper Navbar */}
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center">
          <div>
            <Link to="/"  className="font-bold text-2xl sm:text-3xl flex gap-2">
              <img src={Logo} alt="Logo" className="w-10" />
              Tech Gadget
            </Link>
          </div>

          {/* search bar */}
          <div className="flex justify-between items-center gap-4">
            <div className="relative group hidden sm:block">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch} // triggers on pressing Enter
          placeholder="Tìm kiếm"
          className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800"
        />
        <IoMdSearch
          className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
          onClick={handleSearch} // triggers on clicking search icon
        />
      </div>

            {/* order button */}
            <button
              className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group"
            >
              <span className="group-hover:block hidden transition-all duration-200">
                Giỏ hàng
              </span>
              <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
            </button>

            {/* Notifications Icon */}
            <div className="relative">
            <Notifications onNewNotification={handleNewNotification}  />
            </div>

            {/* Darkmode Switch */}
            <div>
              <DarkMode />
            </div>

            {user ? (
              <div className="relative">
                <div
                  className="flex items-center gap-[15px] cursor-pointer"
                  onClick={showProfile}
                >
                  <div className="h-[30px] w-[30px] rounded-full flex items-center justify-center relative z-40 ">
                    <img
                      src={R}
                      alt="Profile Icon"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>

                  <FaCaretDown className="text-xl" />
                </div>

                {open && (
                  <div className="absolute right-1/2 transform translate-x-1/2 mt-2 w-52 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg z-50">
                    <div className="py-2 ">
                      <p className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200 font-semibold w-full ">
                        <Link to="/profile">Hồ sơ</Link>
                      </p>
                      <p className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200 font-semibold w-full ">
                        <Link to ="/favorite">Yêu thích</Link>
                      </p>
                      <p className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200 font-semibold w-full ">
                        <Link to ="/seller">Trang người bán</Link>
                      </p>
                      <p
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg text-red-600 dark:text-red-400 font-semibold w-full"
                        onClick={handleLogout}
                      >
                        Đăng Xuất
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden text-white lg:flex justify-center space-x-6 items-center">
                <Link to="/signin" className="py-2 px-3 rounded-md border-2 text-black/80 dark:text-light dark:text-white border-black ">
                  Đăng Nhập
                </Link>
                <Link to="/signup"
                  className="bg-gradient-to-r from-primary to-secondary py-2 px-3 rounded-md text-white"
                >
                  Tạo tài khoản
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Header;
