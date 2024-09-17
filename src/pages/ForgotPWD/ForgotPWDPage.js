import React, { useState } from 'react';
// import { forgotPassword, resetPassword } from '~/api/UserAPI';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0); // Track OTP attempts
  const navigate = useNavigate();

//   const handleSendOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await forgotPassword(email);
//       console.log('OTP sent successfully', response.data);
//       setOtp(response.data.data);
//       toast.success('OTP sent successfully!');
//       setStep(2);
//     } catch (error) {
//       console.error('Error sending OTP:', error.response ? error.response.data : error.message);
//       toast.error('Error sending OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOTP = (e) => {
//     e.preventDefault();
//     if (enteredOtp === otp) {
//       setStep(3);
//     } else {
//       const newAttempts = otpAttempts + 1;
//       setOtpAttempts(newAttempts);
//       if (newAttempts >= 3) {
//         toast.error('Too many failed attempts. Please try again.');
//         setTimeout(() => {
//           navigate('/signin');
//         }, 2500);
//       } else {
//         toast.error('Invalid OTP');
//       }
//     }
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     if (password === confirmPassword) {
//       setLoading(true);
//       try {
//         const response = await resetPassword(email, password);
//         console.log('Password reset successfully', response.data);
//         toast.success('Password reset successfully!');
//         // Delay navigate to ensure toast is shown
//         setTimeout(() => {
//           navigate('/signin');
//         }, 2000); // Delay of 2 seconds (2000 milliseconds)
//       } catch (error) {
//         console.error('Error resetting password:', error.response ? error.response.data : error.message);
//         toast.error('Error resetting password');
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       console.error('Passwords do not match');
//       toast.error('Passwords do not match!!!');
//     }
//   };

  return (
    
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto mt-2 p-6 bg-white rounded-lg shadow-md">
      <ToastContainer />
      {step === 1 && (
        <>
          <h1 className="text-center font-bold text-3xl text-black mb-1">Recover Your Password!</h1>
          <form> 
             {/* <form onSubmit={handleSendOTP}>  */}
            <div className="mt-10">
              <p className="text-center text-base mb-3">
                Enter your email address you'd like your password reset information sent to
              </p>
              <label htmlFor="email" className="text-base font-semibold text-gray-600 p-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="block w-full h-10 mt-1 mb-8 border-gray-300 rounded-md shadow-sm bg-gray-100 p-2"
                required
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-black border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        </>
      )}
      {step === 2 && (
        <>
          <h1 className="text-center font-bold text-3xl text-black mb-1">Verify OTP</h1>
         <form>
          {/* <form onSubmit={handleVerifyOTP}> */}
            <div className="mt-10">
              <p className="text-center text-base mb-3">
                Enter the OTP sent to your email
              </p>
              <label htmlFor="otp" className="text-base font-semibold text-gray-600 p-2">OTP</label>
              <input
                type="text"
                id="otp"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="Enter your OTP"
                className="block w-full h-10 mt-1 mb-8 border-gray-300 rounded-md shadow-sm bg-gray-100 p-2"
                required
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-black border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-orange-600"
              >
                Verify OTP
              </button>
            </div>
          </form>
        </>
      )}
      {step === 3 && (
        <>
          <h1 className="text-center font-bold text-3xl text-black mb-1">Reset Your Password</h1>
          <form>
          {/* <form onSubmit={handleResetPassword}> */}
            <div className="mt-10">
              <label htmlFor="password" className="text-base font-semibold text-gray-600 p-2">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                className="block w-full h-10 mt-1 mb-8 border-gray-300 rounded-md shadow-sm bg-gray-100 p-2"
                required
              />
              <label htmlFor="confirmPassword" className="text-base font-semibold text-gray-600 p-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="block w-full h-10 mt-1 mb-8 border-gray-300 rounded-md shadow-sm bg-gray-100 p-2"
                required
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-black border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
    </div>
  );
}

export default ForgotPassword;