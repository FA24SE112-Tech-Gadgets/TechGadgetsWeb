import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import signin from '~/assets/signin.jpg';
import google from '~/assets/google.svg'
import useAuth from '~/context/auth/useAuth';
import { useGoogleLogin } from '@react-oauth/google';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LogIn() {
  const { login, error } = useAuth();
  const { googleLogin} = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!user.email|| !user.password) {
      toast.error('email and password are required!');
      return;
    }
    
    setLoading(true);
    try {
      await login(user);
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const googleLoginHandler  = useGoogleLogin({
    onSuccess: (response) => {
      console.log('Google login successful:', response.access_token);
      googleLogin(response.access_token);
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error('Google login failed. Please try again.');
    },
  });

  const handleChangeValue = (fieldName, value) => {
    setUser((prev) => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold">Chào mừng trở lại</span>
          <span className="font-light text-gray-400 mb-8">
            Chào mừng trở lại!
          </span>
          <form onSubmit={handleSubmit}>
            <div className="py-4">
              <span className="text-base font-semibold text-gray-600">Email</span>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                name="email"
                id="email"
                value={user.email}
                onChange={(e) => handleChangeValue("email", e.target.value)}
              />
            </div>
            <div className="py-4">
              <span className="text-base font-semibold text-gray-600">Mật khẩu</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                value={user.password}
                onChange={(e) => handleChangeValue("password", e.target.value)}
              />
            </div>
            <div className="flex justify-between w-full py-4">
              <div className="mr-24">
                <input type="checkbox" name="ch" id="ch" className="mr-2" />
                <span className="text-base font-medium text-gray-400">Ghi nhớ mật khẩu</span>
              </div>
              <Link to="/forgot-password" className="font-bold text-md italic hover:text-orange-500">Quên mật khẩu?</Link>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-black border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-t-transparent border-white"></div>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>
          <div className="mb-5 pt-5 flex justify-center">
            <button
             onClick={() => googleLoginHandler ()}
            class="w-full border border-gray-300 text-md p-2 rounded-lg mb-6 hover:bg-black hover:text-white"
          >
            <img src={google} alt="img" class="w-6 h-6 inline mr-2 test-base" />
            Đăng nhập với Google
          </button>
          </div>
          <div className="text-center text-gray-400">
            Không có tài khoản?
            <Link to="/signup" className="font-bold text-black hover:text-orange-500"> Đăng ký miễn phí</Link>
          </div>
        </div>

        <div className="relative">
          <img
            src={signin}
            alt="img"
            className="w-[380px] h-full hidden rounded-r-2xl md:block object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default LogIn;
