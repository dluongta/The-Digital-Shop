import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import { listTopProducts } from '../actions/productActions'

const ProductCarousel = () => {
  const [index, setIndex] = useState(0)

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex)
  }
  const dispatch = useDispatch()

  const productTopRated = useSelector((state) => state.productTopRated)
  const { loading, error, products } = productTopRated

  useEffect(() => {
    dispatch(listTopProducts())
  }, [dispatch])

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      {/* Khối Style này sẽ ép Bootstrap không được làm mờ 2 nút điều hướng */}
      <style>
        {`
          .carousel-control-prev, 
          .carousel-control-next {
            opacity: 1 !important; /* Luôn đậm 100% ngay từ đầu */
          }
        `}
      </style>

      <Carousel
        pause='hover'
        className='bg-dark'
        activeIndex={index}
        onSelect={handleSelect}
        // Ghi đè icon mũi tên trái
        prevIcon={
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)', // Nền đen đậm gần như tuyệt đối (95%)
              width: '45px', // Cố định chiều rộng tạo hình vuông
              height: '45px', // Cố định chiều cao
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px', // Bo góc cực nhẹ để khối vuông trông hiện đại hơn
              border: '1px solid rgba(0, 0, 0, 0.95)', // Thêm viền trắng mờ để nổi bật khỏi ảnh nền đen
            }}
          >
            <span
              className='carousel-control-prev-icon'
              aria-hidden='true'
              style={{
                // Tăng độ sáng và tạo hiệu ứng phát sáng nhẹ (glow) cho mũi tên
                filter:
                  'brightness(200%) drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.8))',
              }}
            />
          </div>
        }
        // Ghi đè icon mũi tên phải
        nextIcon={
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              width: '45px',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              border: '1px solid rgba(0, 0, 0, 0.95)',
            }}
          >
            <span
              className='carousel-control-next-icon'
              aria-hidden='true'
              style={{
                filter:
                  'brightness(200%) drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.8))',
              }}
            />
          </div>
        }
      >
        {products.map((product) => (
          <Carousel.Item key={product._id}>
            <Link to={`/product/${product._id}`}>
              <Image src={product.images[0]} alt={product.name} fluid />
              <Carousel.Caption className='carousel-caption'>
                <h2>
                  {product.name} (${product.price})
                </h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  )
}

export default ProductCarousel