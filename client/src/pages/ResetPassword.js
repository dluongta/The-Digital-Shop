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
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!success) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      navigate("/login", {
        state: { message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại." },
      });
    }

    return () => clearInterval(timer);
  }, [success, countdown, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

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
      const response = await axios.post(
        `/api/reset-password/${id}/${token}`,
        { password }
      );

      if (response.data.status?.toLowerCase().includes("thành công")) {
        setSuccess(true);
        setMessage("Đổi mật khẩu thành công!");
      } else {
        setMessage(response.data.status || "Có lỗi xảy ra.");
      }
    } catch (error) {
      setMessage("Liên kết đã hết hạn hoặc không hợp lệ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4">
      
      <div className="max-w-md w-full bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-gray-100 transition-all duration-500">
        
        {/* Header */}
        <div className="text-center mb-6">

          <h2 className="text-3xl font-extrabold text-gray-900">
            Đặt lại mật khẩu
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            {success
              ? "Hệ thống đang chuyển hướng..."
              : "Nhập mật khẩu mới để bảo mật tài khoản"}
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 transition-all duration-500">
            <Message variant={success ? "success" : "danger"}>
              <div className="text-center">
                <p>{message}</p>
                {success && (
                  <p className="text-xs mt-1 opacity-70">
                    Tự động chuyển sau {countdown}s...
                  </p>
                )}
              </div>
            </Message>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <input
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                required
                disabled={loading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              }`}
            >
              {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
            </button>
          </form>
        )}

        {/* Success button */}
        {success && (
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Đi đến đăng nhập ngay →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;