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

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('buyer')
  const [message, setMessage] = useState(null)

  const [passwordModal, setPasswordModal] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [userData, setUserData] = useState(null)

  const [paypalClientId, setPaypalClientId] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister

  const redirect = new URLSearchParams(location.search).get('redirect') || '/'

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, navigate, redirect])

  // =========================
  // GOOGLE HANDLER (DÙNG CHUNG)
  // =========================
  const handleGoogleCredential = async (credential) => {
    try {
      const decoded = jwtDecode(credential)
      const { email, name } = decoded

      setEmail(email)
      setName(name)

      const response = await dispatch(checkEmailExists(email))

      if (response?.exists) {
        dispatch(login(email, credential))
        navigate('/')
      } else {
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
  // MODAL SUBMIT (REGISTER)
  // =========================
  const handleModalSubmit = async () => {
    if (!userData || !passwordModal) return

    const { email, name } = userData

    await dispatch(
      register(name, email, passwordModal, 'buyer', paypalClientId)
    )
    dispatch(login(email, passwordModal))

    setShowModal(false)
  }

  // =========================
  // NORMAL REGISTER
  // =========================
  const submitHandler = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(register(name, email, password, role, paypalClientId))
    }
  }

  return (
    <FormContainer>
      <h1>Sign Up</h1>

      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      {/* GOOGLE LOGIN BUTTON */}
      <div className="mb-3 text-center">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => console.log('Google Login Failed')}
        />
      </div>

      {/* REGISTER FORM */}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="mb-2">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="mb-2">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="role" className="mb-2">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="paypalClientId" className="mb-3">
          <Form.Label>PayPal Client ID (Optional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter PayPal Client ID"
            value={paypalClientId}
            onChange={(e) => setPaypalClientId(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Register
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>

      {/* GOOGLE REGISTER MODAL */}
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

export default RegisterScreen
