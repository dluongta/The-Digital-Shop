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

  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

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

    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `/api/reset-password/${id}/${token}`,
        {
          password,
        }
      );

      if (response.data.status === "Password Updated Succeeded") {
        setIsSuccess(true);
        setMessage(
          "Đổi mật khẩu thành công! Đang chuyển hướng sau vài giây..."
        );
      } else {
        setMessage(response.data.status);
      }
    } catch (error) {
      setMessage("Liên kết đã hết hạn hoặc có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-2xl shadow-2xl shadow-black/40 p-7 sm:p-9">

          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" />

          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-all duration-500 ${
                isSuccess
                  ? "bg-emerald-500/20 shadow-emerald-500/20"
                  : "bg-blue-500/20 shadow-blue-500/20"
              }`}
            >
              {isSuccess ? (
                <svg
                  className="w-8 h-8 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"
                  />
                </svg>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isSuccess
                ? "Mật khẩu đã được cập nhật!"
                : "Thiết lập mật khẩu mới"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {isSuccess
                ? "Tài khoản của bạn đã được bảo mật bằng mật khẩu mới."
                : "Tạo một mật khẩu mới để bảo vệ tài khoản của bạn."}
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 ${
                isSuccess ? "" : "animate-[shake_0.4s_ease-in-out]"
              }`}
            >
              <Message
                variant={
                  isSuccess || message.includes("thành công")
                    ? "success"
                    : "danger"
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{message}</span>

                  {isSuccess && (
                    <span className="shrink-0 font-bold text-emerald-600">
                      {countdown}s
                    </span>
                  )}
                </div>
              </Message>
            </div>
          )}

          {/* Form */}
          {!isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Mật khẩu mới
                </label>

                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg
                      className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"
                      />
                    </svg>
                  </div>

                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-blue-500/60 focus:bg-slate-900/80 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Xác nhận mật khẩu
                </label>

                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg
                      className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-.695-.059-1.376-.17-2.044z"
                      />
                    </svg>
                  </div>

                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-blue-500/60 focus:bg-slate-900/80 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Password hint */}
              <div className="flex items-start gap-2 rounded-xl border border-blue-500/10 bg-blue-500/5 px-4 py-3">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <p className="text-xs leading-5 text-slate-400">
                  Hãy sử dụng mật khẩu đủ mạnh và không dùng lại mật khẩu ở
                  những tài khoản khác.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>

                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      Cập nhật mật khẩu

                      <svg
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>
          )}

          {/* Success countdown */}
          {isSuccess && (
            <div className="mt-7">
              <div className="mb-3 flex justify-between text-xs text-slate-400">
                <span>Đang chuyển đến trang đăng nhập</span>
                <span className="font-semibold text-emerald-400">
                  {countdown}s
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-1000 ease-linear"
                  style={{
                    width: `${(countdown / 5) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              🔒 Thông tin của bạn được bảo mật an toàn
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-5 text-center">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} • Secure Account
          </p>
        </div>
      </div>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          20%, 60% {
            transform: translateX(-5px);
          }
          40%, 80% {
            transform: translateX(5px);
          }
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;
