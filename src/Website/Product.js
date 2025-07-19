import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Product.css';

function Product({ addToCart, formatPrice, products }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);

  const product = location.state?.product;

  if (!product) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const currentProduct = products && products.find(p => p.id === product.id);
  const canAddToCart = currentProduct && currentProduct.stockQuantity > 0;

  const fullProduct = currentProduct || product;

  const images = fullProduct.images || [fullProduct.image, fullProduct.image, fullProduct.image];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    if (canAddToCart) {
      addToCart({ ...fullProduct, selectedSize });
    }
  };

  return (
    <div className="product-page">
      <div className="product-gallery">
        <div className="product-thumbnails">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={process.env.PUBLIC_URL + img}
              alt={`Thumbnail ${idx + 1}`}
              className={`thumbnail${selectedImg === idx ? ' selected' : ''}`}
              onClick={() => setSelectedImg(idx)}
            />
          ))}
        </div>
        <div className="product-main-image">
          <img src={process.env.PUBLIC_URL + images[selectedImg]} alt="Main product" />
        </div>
      </div>
      <div className="product-info-block">
        <div className="product-title-block">
          <h2 className="product-brand">{fullProduct.brand}</h2>
          <h3 className="product-name-detail">{fullProduct.name}</h3>
        </div>

        <div className="product-sizes-price">
          <div className="product-sizes">
            <h2 className="label">SIZE:</h2>
            <div className="size-btn-group">
              {['XS', 'S', 'M', 'L'].map(size => (
                <button
                  key={size}
                  className={`size-btn${selectedSize === size ? ' selected' : ''}`}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  type="button"
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && (
              <div className="size-error" style={{ color: 'red', marginTop: '0.5rem' }}>
                Please select a size before adding to cart.
              </div>
            )}
          </div>

          <div className="product-price-block">
            <h1 className="label">PRICE:</h1>
            <div className="product-price">{formatPrice(fullProduct.price)}</div>
          </div>

          <button
            className={`add-to-cart-main-btn${!canAddToCart ? ' disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={!canAddToCart}
          >
            {canAddToCart ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>

        <div className="product-description">
          {fullProduct.description || 'No description available.'}
        </div>
      </div>
    </div>
  );
}

export default Product;
