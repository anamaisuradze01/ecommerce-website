import React from 'react';
import './CartPreview.css';
import { useNavigate } from 'react-router-dom';

function CartPreview({ cart = [], totalPrice, closePreview, updateCartItemSize, incrementCartItem, decrementCartItem, formatPrice, products }) {
  const navigate = useNavigate();
  const isCartEmpty = !cart || cart.length === 0;

  return (
    <div className="cart-preview">
      <h3 className="cart-preview-title">My Bag, {cart.length} items</h3>
      <ul className="cart-preview-list">
        {cart.map((item) => {
          const currentProduct = products && products.find(p => p.id === item.id);
          const currentQuantity = item.quantity || 1;
          const canIncrement = currentProduct && currentQuantity < currentProduct.stockQuantity;

          return (
            <li className="cart-preview-item" key={item.cartId}>
              <div className="cart-preview-info">
                <div className="cart-preview-brand">{item.brand || 'Brand'}</div>
                <div className="cart-preview-name">{item.name}</div>
                <div className="cart-preview-price">{formatPrice(item.price)}</div>
                <div className="cart-preview-sizes">
                  <div className="size-label">SIZE:</div>
                  <div className="size-buttons-container">
                    {['XS', 'S', 'M', 'L'].map((size) => (
                      <button
                        key={size}
                        className={`size-btn${item.selectedSize === size ? ' selected' : ''}`}
                        onClick={() => updateCartItemSize(item.cartId, size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="cart-preview-controls">
                <div className="qty-controls">
                  <button 
                    className={!canIncrement ? 'disabled' : ''}
                    onClick={() => canIncrement && incrementCartItem(item.cartId)}
                    disabled={!canIncrement}
                  >
                    +
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => decrementCartItem(item.cartId)}>-</button>
                </div>
                <img src={process.env.PUBLIC_URL + item.image} alt={item.name} className="cart-preview-image" />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="cart-preview-total">
        <span>Total</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>

      <div className="cart-preview-buttons">
        <button 
          className="view-bag-btn" 
          onClick={() => { if (!isCartEmpty) { closePreview(); navigate('cart'); } }}
          disabled={isCartEmpty}
          title={isCartEmpty ? 'Add items to cart before viewing your bag' : ''}
        >
          VIEW BAG
        </button>
        <button 
          className="checkout-btn" 
          onClick={() => { if (!isCartEmpty) { closePreview(); navigate('checkout'); } }}
          disabled={isCartEmpty}
          title={isCartEmpty ? 'Add items to cart before proceeding to checkout' : ''}
        >
          CHECK OUT
        </button>
      </div>
    </div>
  );
}

export default CartPreview;
