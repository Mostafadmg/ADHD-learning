import React, { useState } from 'react';

export interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
}

interface MyComponentProps {
  title: string;
  backgroundColor: string;
  products?: Product[];
}

// Default 10 products mock data
const DEFAULT_PRODUCTS: Product[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: `$${((i + 1) * 15.99).toFixed(2)}`,
  imageUrl: `https://picsum.photos/seed/product${i + 1}/300/200`,
}));

export default function MyComponent({
  title,
  backgroundColor,
  products = DEFAULT_PRODUCTS,
}: MyComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Total items is 10, visible is 3, max slide offset is 10 - 3 = 7
  const maxIndex = Math.max(0, products.length - 3);

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor,
        borderRadius: '8px',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ margin: '0 0 20px 0' }}>{title}</h1>

      {/* Carousel Container */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '0 5px' }}>
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          aria-label="Previous Slide"
          style={{
            position: 'absolute',
            left: '5px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            padding: '8px 12px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentIndex === 0 ? 0.4 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          &#10094;
        </button>

        <button
          onClick={nextSlide}
          disabled={currentIndex >= maxIndex}
          aria-label="Next Slide"
          style={{
            position: 'absolute',
            right: '5px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            padding: '8px 12px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            cursor: currentIndex >= maxIndex ? 'not-allowed' : 'pointer',
            opacity: currentIndex >= maxIndex ? 0.4 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          &#10095;
        </button>

        {/* Sliding Track */}
        <div
          style={{
            display: 'flex',
            transition: 'transform 0.4s ease-in-out',
            transform: `translateX(-${currentIndex * (100)}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                flex: '0 0 100%',
                boxSizing: 'border-box',
                padding: '0 8px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
                }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                  }}
                />
                <h3 style={{ margin: '10px 0 5px', fontSize: '16px' }}>
                  {product.name}
                </h3>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#10b981' }}>
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Featured Products',
  },
  backgroundColor: {
    type: 'color',
    title: 'Background Color',
    defaultValue: '#f0f0f0',
  },
};