import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import signupp from '~/assets/signupp.jpg';
import google from '~/assets/google.svg';
import useAuth from '~/context/auth/useAuth';
import { useGoogleLogin } from '@react-oauth/google';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUp() {
  const { signup, error } = useAuth();
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    userName: "",
    password: "",
    role: "Student", // Default role
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChangeValue = (fieldName, value) => {
    setUser((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const googleLoginHandler = useGoogleLogin({
    onSuccess: (response) => {
      console.log('Google login successful:', response.access_token);
      googleLogin(response.access_token);
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error('Google login failed. Please try again.');
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    signup(user);
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold">Create an account</span>
          <span className="font-light text-gray-400 mb-8">Sign up to get started!</span>

          <div className="py-4">
            <span className="text-base font-semibold text-gray-600">Email</span>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              name="email"
              value={user.userName}
              onChange={(e) => handleChangeValue("userName", e.target.value)}
              required
            />
          </div>

          <div className="py-4">
            <span className="text-base font-semibold text-gray-600">Password</span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              value={user.password}
              onChange={(e) => handleChangeValue("password", e.target.value)}
              required
            />
          </div>

          <div className="py-4">
            <span className="text-base font-semibold text-gray-600">Role</span>
            <select
              name="role"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={user.role}
              onChange={(e) => handleChangeValue("role", e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Student">Student</option>
            </select>
          </div>

          <div className="flex justify-between w-full py-4">
            <div className="mr-24">
              <input
                type="checkbox"
                name="ch"
                id="ch"
                className="mr-2"
                onChange={handleClickShowPassword}
              />
              <span className="text-base font-medium text-gray-400">Show Password</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full p-2 mb-6 bg-black text-white border border-transparent rounded-lg shadow-sm text-base font-medium hover:bg-orange-600"
          >
            Sign up
          </button>

          <div className="mb-2 flex justify-center">
            <button
             onClick={() => googleLoginHandler ()}
            class="w-full border border-gray-300 text-md p-2 rounded-lg mb-6 hover:bg-black hover:text-white"
          >
            <img src={google} alt="img" class="w-6 h-6 inline mr-2 test-base" />
            Sign in with Google
          </button>
          </div>

          <div className="text-center text-gray-400">
            Already have an account?
            <Link to="/signin" className="font-bold text-black hover:text-orange-500"> Sign in</Link>
          </div>
        </div>

        <div className="relative">
          <img
            src={signupp}
            alt="img"
            className="w-[380px] h-full hidden rounded-r-2xl md:block object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
