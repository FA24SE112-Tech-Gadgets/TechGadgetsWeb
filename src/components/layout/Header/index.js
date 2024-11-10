import React, { useState, useEffect, useRef, useContext } from "react";
import Logo from "~/assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaCaretDown, FaBell, FaEye, FaEyeSlash } from "react-icons/fa";
import DarkMode from "./DarkMode";
import useAuth from "~/context/auth/useAuth";
import R from "~/assets/R.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Notifications from "~/Notification/Notification";
import AxiosInterceptor from "~/components/api/AxiosInterceptor";
import SearchComponent from "~/pages/Search/Search";


const Header = () => {
  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const { user, logout, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [walletAmount, setWalletAmount] = useState(0); 
  const [showWalletAmount, setShowWalletAmount] = useState(false);

  const formatWalletAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    logout();
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
        navigate('/signin'); 
    } else {
        navigate('/cart'); 
    }
};
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // Function to fetch wallet amount from API
  const fetchWalletAmount = async () => {
    try {
      const response = await AxiosInterceptor.get('/api/users/current');
      setWalletAmount(response.data.wallet.amount);
    } catch (error) {
      console.error('Error fetching wallet amount:', error);
    }
  };

  // Fetch wallet amount when component mounts
  useEffect(() => {
    if (user) {
      fetchWalletAmount();
    }
  }, [user]);

  // Fetch wallet amount when eye icon is clicked
  const handleToggleWalletAmount = () => {
    setShowWalletAmount(!showWalletAmount);
    if (!showWalletAmount) {
      fetchWalletAmount(); 
    }
  };

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center">
          <div>
            <button onClick={() => navigate("/")} className="font-bold text-2xl sm:text-3xl flex gap-2">
              <img src={Logo} alt="Logo" className="w-10" />
              Tech Gadget
            </button>
          </div>

          {/* search bar */}
          <div className="flex justify-between items-center gap-4">
          <SearchComponent/>

            {/* Cart button */}
            <button
            onClick={handleCartClick}
              className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group"
            >
              <span
               className="group-hover:block hidden transition-all duration-200">
                Giỏ hàng
              </span>
              <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
            </button>

            {/* Notifications Icon */}
            <div className="relative">
            {isAuthenticated &&   
            
              <Notifications />
          }
            </div>
         
            {/* Darkmode Switch */}
            <DarkMode />

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center gap-[15px] cursor-pointer"
                  onClick={() => setOpen(!open)}
                >
                  <div className="h-[30px] w-[30px] rounded-full flex items-center justify-center relative z-40">
                    <img
                      src={R}
                      alt="Profile Icon"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <FaCaretDown className="text-xl" />
                </div>

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg z-50">
                    <div className="py-2">
                    <button
                        onClick={() => navigate("/profile")}
                        className="flex justify-start cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200 font-semibold w-full transition-colors duration-300"
                      >
                        <p>Hồ sơ</p>
                      </button>
                      <button
                        onClick={() => navigate("/orderHistory")}
                        className="flex justify-start cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200 font-semibold w-full transition-colors duration-300"
                      >
                        <p>Đơn hàng</p>
                      </button>
                      <button
                        onClick={() => navigate("/favorite")}
                        className="flex justify-start cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200 font-semibold w-full transition-colors duration-300"
                      >
                        <p>Yêu thích</p>
                      </button>
                      <button
                        onClick={() => navigate("/review-gadget")}
                        className="flex justify-start cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200 font-semibold w-full transition-colors duration-300"
                      >
                        <p>Đánh giá sản phẩm</p>
                      </button>
                      {/* Wallet Amount Display */}
                      <div className="p-3 rounded-lg text-gray-800 dark:text-gray-200 font-semibold w-full">
                        <div className="flex justify-between items-center">
                          <NavLink to="/deposit-history" className="flex items-center">
                            <span>Ví của tôi:</span>
                            <span className={`font-bold ml-2 ${showWalletAmount ? 'text-green-600 dark:text-green-400' : 'text-black'}`}>
                              {showWalletAmount ? formatWalletAmount(walletAmount) : '******'}
                            </span>
                          </NavLink>
                          <div className="flex items-center">
                            <button
                              onClick={handleToggleWalletAmount}
                              className="focus:outline-none"
                            >
                              {showWalletAmount ? (
                                <FaEyeSlash className="text-gray-500" />
                              ) : (
                                <FaEye className="text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      <p
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg text-red-600 dark:text-red-400 font-semibold w-full transition-colors duration-300"
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
                <Link
                  to="/signin"
                  className="py-2 px-3 rounded-md border-2 text-black/80 dark:text-white border-black "
                >
                  Đăng Nhập
                </Link>
                <Link
                  to="/signup"
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
