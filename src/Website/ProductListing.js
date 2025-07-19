import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductListing.css';

function ProductListing({ category, addToCart, formatPrice, products }) {
  const navigate = useNavigate();
  const filteredProducts = products.filter(item => item.category === category);
  const [sizePopup, setSizePopup] = useState(null); 

  const handleCartClick = (e, productId) => {
    e.stopPropagation();
    setSizePopup(productId);
  };

  const handleSizeClick = (product, size) => {
    console.log('handleSizeClick called with:', { product: product.name, size, stockQuantity: product.stockQuantity });
    if (product.stockQuantity > 0) {
      console.log('Adding to cart:', { product: product.name, size });
      addToCart({ ...product, selectedSize: size });
    } else {
      console.log('Product out of stock:', product.name);
    }
    setSizePopup(null);
  };

  const handleProductClick = (product) => {
    if (product.inStock !== false) {
      navigate('product', { state: { product } });
    }
  };

  let heading = '';
  if (category === 'woman') heading = "Women's clothing";
  else if (category === 'man') heading = "Men's clothing";
  else if (category === 'kids') heading = "Kids' clothing";

  return (
    <div>
      <h1 className="category">{heading}</h1>
      <ul className="product-list">
        {filteredProducts.length === 0 ? (
          <li>No products found.</li>
        ) : (
          filteredProducts.map(product => (
            <li
              key={product.id}
              className={`productBox ${product.inStock === false ? 'out-of-stock' : ''}`}
              onClick={() => handleProductClick(product)}
            >
              <div className="productBox-image-wrapper">
                <div className="product-image-wrapper">
                  <img src={process.env.PUBLIC_URL + product.image} alt={product.name} className="product-image" />
                  {product.inStock !== false && product.stockQuantity > 0 && (
                    <button
                      className="add-to-cart-btn"
                      onClick={e => handleCartClick(e, product.id)}
                      title="Add to cart"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    </button>
                  )}
                  {sizePopup === product.id && (
                    <div className="size-popup" onClick={e => e.stopPropagation()}>
                      {["XS", "S", "M", "L"].map(size => (
                        <button
                          key={size}
                          className="size-popup-btn"
                          onClick={() => handleSizeClick(product, size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                  {product.inStock === false && (
                    <div className="out-of-stock-overlay">
                      <span className="out-of-stock-text">OUT OF STOCK</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="product-info">
                <span>{product.brand} {product.name}</span>
                <span>{formatPrice(product.price)}</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ProductListing;
