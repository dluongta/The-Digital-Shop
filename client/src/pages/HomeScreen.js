import React, { useEffect, useState } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Form, Row, Col, Button } from 'react-bootstrap'
import { useGoogleOneTapLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import Meta from '../components/Meta'
import { listProducts } from '../actions/productActions'
import { login, register, checkEmailExists } from '../actions/userActions'
import LatestProducts from '../components/homePage/LatestProducts'
import ProductCarousel from '../components/ProductCarousel'
import SearchBar from '../layout/SearchBar'

const HomeScreen = () => {
  const { keyword, pageNumber = 1 } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const searchParams = new URLSearchParams(location.search)
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || '')

  const { loading, error, products = [], page = 1, pages = 1 } =
    useSelector((state) => state.productList)

  const { userInfo } = useSelector((state) => state.userLogin)

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber, '', minPrice, maxPrice, sort))
  }, [dispatch, keyword, pageNumber, minPrice, maxPrice, sort])

  // =========================
  // GOOGLE ONE TAP LOGIN
  // =========================
  useGoogleOneTapLogin({
    disabled: !!userInfo,
    onSuccess: async (res) => {
      try {
        const decoded = jwtDecode(res.credential)
        const { email, name } = decoded

        const existsRes = await dispatch(checkEmailExists(email))

        if (existsRes?.exists) {
          const password = await fetch(`/api/users/password/${email}`)
            .then((r) => r.json())
            .then((d) => d.password)

          dispatch(login(email, password))
        } else {
          dispatch(register(name, email, res.credential, 'buyer'))
        }
      } catch (err) {
        console.error('Google One Tap error:', err)
      }
    },
    onError: () => console.log('Google One Tap failed'),
  })

  // =========================
  // FILTER SUBMIT
  // =========================
  const submitHandler = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (sort) params.set('sort', sort)

    navigate(`${keyword ? `/search/${keyword}/${pageNumber}` : '/'}?${params}`)
  }

  return (
    <>
      <Meta />
      <SearchBar />

      {!keyword && (
        <Container>
          <h1>Top Products</h1>
          <ProductCarousel />
        </Container>
      )}

      <Container>
        <h1>Latest Products</h1>

        {/* FILTER */}
        <Form onSubmit={submitHandler} className="mb-3">
          <Row>
            <Col md={3}>
              <Form.Control
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </Col>

            <Col md={3}>
              <Form.Control
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </Col>

            <Col md={3}>
              {/* 🔥 FIX QUAN TRỌNG Ở ĐÂY */}
              <Form.Control
                as="select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Sort</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
              </Form.Control>
            </Col>

            <Col md={3}>
              <Button type="submit" className="w-100">
                Apply
              </Button>
            </Col>
          </Row>
        </Form>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <LatestProducts products={products} />
            <Paginate pages={pages} page={page} keyword={keyword || ''} />
          </>
        )}
      </Container>
    </>
  )
}

export default HomeScreen
