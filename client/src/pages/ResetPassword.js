import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import axios from "axios";

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("danger");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Xử lý chuyển hướng sau 3 giây khi thành công
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setVariant("danger");
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (password.length < 6) {
        setVariant("danger");
        setMessage("Mật khẩu phải có ít nhất 6 ký tự.");
        return;
      }

    setLoading(true);
    try {
      const { data } = await axios.post(`/api/reset-password/${id}/${token}`, {
        password,
      });

      // Khớp với status từ Backend: "Password Updated Successfully"
      if (data.status === "Password Updated Successfully" || data.status === "Password Updated Succeeded") {
        setVariant("success");
        setMessage("Cập nhật thành công! Bạn sẽ được chuyển về trang đăng nhập sau 3 giây...");
        setIsSuccess(true);
      } else {
        setVariant("danger");
        setMessage(data.status);
      }
    } catch (error) {
      setVariant("danger");
      const errorMsg = error.response && error.response.data.status 
        ? error.response.data.status 
        : "Liên kết đã hết hạn hoặc có lỗi xảy ra.";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="box-container" style={{ maxWidth: '450px', width: '100%', margin: '0 auto' }}>
        
        <h2 className="title" style={{ textAlign: 'center', marginBottom: '20px', textTransform: 'none' }}>
            Thiết lập mật khẩu mới
        </h2>

        {message && <Message variant={variant}>{message}</Message>}
        {loading && <Loader />}

        <form onSubmit={handleSubmit} className="box-shadow" style={{ background: '#fff', padding: '25px', borderRadius: '10px' }}>
          <p style={{ fontSize: '1.4rem', color: '#666', marginBottom: '20px' }}>
            Vui lòng nhập mật khẩu mới bảo mật để hoàn tất quá trình khôi phục.
          </p>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '1.3rem', fontWeight: '600' }}>Mật khẩu mới</label>
            <input
              type="password"
              required
              className="box"
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSuccess}
              style={{ marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '1.3rem', fontWeight: '600' }}>Xác nhận mật khẩu</label>
            <input
              type="password"
              required
              className="box"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSuccess}
              style={{ marginTop: '5px' }}
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={loading || isSuccess}
            style={{ 
                width: '100%', 
                background: isSuccess ? '#28a745' : '#4f46e5',
                cursor: (loading || isSuccess) ? 'not-allowed' : 'pointer' 
            }}
          >
            {loading ? 'Đang xử lý...' : isSuccess ? 'Đang chuyển hướng...' : 'Cập nhật mật khẩu'}
          </button>

          {isSuccess && (
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                  <progress value={100} max={100} style={{ width: '100%', height: '5px' }}></progress>
              </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;