import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart({ cart, updateCartItemSize, incrementCartItem, decrementCartItem, totalItems, totalPrice, formatPrice, products }) {
  const navigate = useNavigate();
  const isCartEmpty = !cart || cart.length === 0;
  if (isCartEmpty) {
    return (
      <div className="cart-page">
        <h1 className="cart-title">Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Cart</h1>
      <div className="cart-items-list">
        {cart.map((item) => (
          <CartItem
            key={item.cartId}
            item={item}
            updateCartItemSize={updateCartItemSize}
            incrementCartItem={incrementCartItem}
            decrementCartItem={decrementCartItem}
            formatPrice={formatPrice}
            products={products}
          />
        ))}
      </div>
      <div className="cart-summary">
        <div className="summary-line">
          <span className="summary-label">Quantity:</span>
          <span className="summary-value">{totalItems}</span>
        </div>
        <div className="summary-line">
          <span className="summary-label">Total:</span>
          <span className="summary-value">{formatPrice(totalPrice)}</span>
        </div>
        <button 
          className="continue-btn" 
          onClick={() => !isCartEmpty && navigate('checkout')}
          disabled={isCartEmpty}
          title={isCartEmpty ? 'Add items to cart before proceeding to checkout' : ''}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function CartItem({ item, updateCartItemSize, incrementCartItem, decrementCartItem, formatPrice, products }) {
  const images = item.images || [item.image, item.image, item.image];
  const [currentImg, setCurrentImg] = useState(0);

  const nextImage = () => setCurrentImg((currentImg - 1 + images.length) % images.length);
  const prevImage = () => setCurrentImg((currentImg + 1) % images.length);

  const currentProduct = products && products.find(p => p.id === item.id);
  const currentQuantity = item.quantity || 1;
  const canIncrement = currentProduct && currentQuantity < currentProduct.stockQuantity;

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <h2 className="cart-item-brand">{item.brand}</h2>
        <h3 className="cart-item-name">{item.name}</h3>
        <div className="cart-item-price">{formatPrice(item.price)}</div>
        <div className="product-sizes">
          <h2 className="label">SIZE:</h2>
          <div className="size-btn-group">
            {['XS', 'S', 'M', 'L'].map(size => (
              <button
                key={size}
                className={`size-btn${item.selectedSize === size ? ' selected' : ''}`}
                onClick={() => updateCartItemSize(item.cartId, size)}
                type="button"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="cart-item-image-row">
        <div className="cart-item-image-block">
          <button 
            className={`cart-qty-btn${!canIncrement ? ' disabled' : ''}`} 
            onClick={() => canIncrement && incrementCartItem(item.cartId)}
            disabled={!canIncrement}
          >
            +
          </button>
          <div className="cart-qty-value">{item.quantity || 1}</div>
          <button className="cart-qty-btn" onClick={() => decrementCartItem(item.cartId)}>-</button>
        </div>
        <div className="cart-item-image">
          <img src={process.env.PUBLIC_URL + images[currentImg]} alt={item.name} />
          <div className="image-controls">
            <button onClick={prevImage}>&lt;</button>
            <button onClick={nextImage}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
