import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Row, Col, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import {
  login,
  register,
  checkEmailExists,
} from '../actions/userActions'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordModal, setPasswordModal] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [userData, setUserData] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const redirect = location.search
    ? location.search.split('=')[1]
    : '/'

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, navigate, redirect])

  // =========================
  // GOOGLE LOGIN HANDLER (CHUNG)
  // =========================
  const handleGoogleCredential = async (credential) => {
    try {
      const decoded = jwtDecode(credential)
      const { email, name } = decoded

      setEmail(email)
      setName(name)

      const response = await dispatch(checkEmailExists(email))

      if (response?.exists) {
        // login Google user đã tồn tại
        dispatch(login(email, credential)) // backend xử lý credential
      } else {
        // user mới → mở modal nhập password
        setUserData({ email, name })
        setShowModal(true)
      }
    } catch (err) {
      console.error('Google auth error:', err)
    }
  }

  // =========================
  // GOOGLE ONE TAP LOGIN
  // =========================
  useGoogleOneTapLogin({
    disabled: !!userInfo,
    onSuccess: (res) => {
      handleGoogleCredential(res.credential)
    },
    onError: () => {
      console.log('Google One Tap failed')
    },
  })

  // =========================
  // GOOGLE BUTTON LOGIN
  // =========================
  const handleGoogleLoginSuccess = (credentialResponse) => {
    if (credentialResponse?.credential) {
      handleGoogleCredential(credentialResponse.credential)
    }
  }

  // =========================
  // REGISTER FROM MODAL
  // =========================
  const handleModalSubmit = async () => {
    if (!userData || !passwordModal) return

    const { email, name } = userData

    await dispatch(register(name, email, passwordModal, 'buyer'))
    dispatch(login(email, passwordModal))

    setShowModal(false)
  }

  // =========================
  // NORMAL LOGIN
  // =========================
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>

      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      {/* GOOGLE LOGIN BUTTON */}
      <div className="mb-3 text-center">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => console.log('Google Login Failed')}
        />
      </div>

      {/* NORMAL LOGIN FORM */}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Sign In
        </Button>
      </Form>

      {/* REGISTER LINK */}
      <Row className="py-3">
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>

      {/* REGISTER MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Set Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={passwordModal}
            onChange={(e) => setPasswordModal(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            Register & Login
          </Button>
        </Modal.Footer>
      </Modal>
    </FormContainer>
  )
}

export default LoginScreen
