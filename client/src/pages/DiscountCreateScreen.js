import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Message from '../components/Message';

const DiscountCreateScreen = () => {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [assignType, setAssignType] = useState('all'); // 'all' hoặc 'specific'
  const [userId, setUserId] = useState('');
  
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const payload = {
        code,
        description,
        amount: Number(amount),
        userId: assignType === 'specific' ? userId : null,
      };

      await axios.post('/api/discounts/create', payload, config);
      setMessage('Tạo mã giảm giá thành công!');
      setError(null);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setMessage(null);
    }
  };

  return (
    <div>
      <h1>Tạo Mã Giảm Giá (Admin)</h1>
      {message && <Message variant="success">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="code" className="mb-3">
          <Form.Label>Mã Giảm Giá (VD: TET2026)</Form.Label>
          <Form.Control type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Mô Tả</Form.Label>
          <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </Form.Group>

        <Form.Group controlId="amount" className="mb-3">
          <Form.Label>Phần trăm giảm (%)</Form.Label>
          <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </Form.Group>

        <Form.Group controlId="assignType" className="mb-3">
          <Form.Label>Áp dụng cho</Form.Label>
          <Form.Control as="select" value={assignType} onChange={(e) => setAssignType(e.target.value)}>
            <option value="all">Tất cả mọi người</option>
            <option value="specific">Một người dùng cụ thể</option>
          </Form.Control>
        </Form.Group>

        {assignType === 'specific' && (
          <Form.Group controlId="userId" className="mb-3">
            <Form.Label>Nhập User ID</Form.Label>
            <Form.Control type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Nhập ID của người dùng (VD: 60d5ec49f1...)" required />
          </Form.Group>
        )}

        <Button type="submit" variant="primary">Tạo Mã</Button>
      </Form>
    </div>
  );
};

export default DiscountCreateScreen;