import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message";
import axios from "axios";

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Xử lý đếm ngược khi thành công
  useEffect(() => {
    let timer;
    if (isSuccess && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isSuccess && countdown === 0) {
      navigate("/login");
    }
    return () => clearInterval(timer);
  }, [isSuccess, countdown, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message

    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (password.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/reset-password/${id}/${token}`, {
        password,
      });

      // ĐÃ SỬA: Khớp với status từ Backend trả về
      if (response.data.status === "Cập nhật mật khẩu thành công!") {
        setIsSuccess(true);
        setMessage("Đổi mật khẩu thành công!");
      } else {
        setMessage(response.data.status || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Liên kết đã hết hạn hoặc không hợp lệ."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Mật khẩu mới
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {isSuccess 
              ? "Hệ thống đang chuẩn bị chuyển hướng..." 
              : "Vui lòng nhập mật khẩu mới bảo mật để bảo vệ tài khoản của bạn."}
          </p>
        </div>

        {message && (
          <div className={`transform transition-all duration-500 ${message ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <Message variant={isSuccess ? 'success' : 'danger'}>
              <div className="flex flex-col items-center">
                <span>{message}</span>
                {isSuccess && (
                  <span className="text-xs mt-1 font-medium italic">
                    Tự động chuyển về trang Đăng nhập sau {countdown}s...
                  </span>
                )}
              </div>
            </Message>
          </div>
        )}

        {!isSuccess && (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  required
                  disabled={loading}
                  className="appearance-none block w-full px-4 py-3.5 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm group-hover:border-gray-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  required
                  disabled={loading}
                  className="appearance-none block w-full px-4 py-3.5 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm group-hover:border-gray-300"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`relative w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-xl text-white transition-all transform active:scale-[0.98] shadow-lg hover:shadow-xl ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : "Cập nhật mật khẩu"}
            </button>
          </form>
        )}

        {isSuccess && (
           <div className="flex justify-center pt-4">
              <button 
                onClick={() => navigate("/login")}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Chuyển tiếp ngay &rarr;
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;