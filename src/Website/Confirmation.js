import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';
import './Checkout.css';
import './Confirmation.css';

function Confirmation({ cart = [], contactInfo = {}, shippingInfo = {}, selectedShipping, formatPrice, clearCart, updateStockAfterPurchase }) {
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shippingCost = 0;
  const total = subtotal + shippingCost;
  
  const [orderNumber] = useState(() => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `ORD${timestamp.slice(-6)}${random}`;
  });

  const [stockUpdated, setStockUpdated] = useState(false);

  useEffect(() => {
    if (updateStockAfterPurchase && !stockUpdated) {
      const timer = setTimeout(() => {
        updateStockAfterPurchase();
        setStockUpdated(true);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [updateStockAfterPurchase, stockUpdated]);

  const handleBackToShopping = () => {
    clearCart();
    navigate('/');
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <nav className="checkout-steps">
          <span className="step finished">Cart</span> &gt;
          <span className="step finished">Details</span> &gt;
          <span className="step finished">Shipping</span> &gt;
          <span className="step finished">Payment</span> &gt;
          <span className="step current">Confirmation</span>
        </nav>

        <div className="confirmation-container">
          <img 
            src={require('./checkmark.png')} 
            alt="checkmark" 
            className="confirmation-checkmark"
          />
          
          <h3 className="confirmation-title">
            Payment Confirmed
          </h3>
          
          <div className="order-info">
            <p className="order-label">
              ORDER #{orderNumber}
            </p>
          </div>
          
          <button 
            className="continue-btn back-to-shopping-btn" 
            onClick={handleBackToShopping}
          >
            Back to Shopping
          </button>
        </div>
      </div>

      <div className="checkout-summary-wrapper">
        <div className="checkout-summary">
          {cart.map((item) => (
            <div className="summary-item" key={item.cartId}>
              <div className="summary-image">
                <img src={process.env.PUBLIC_URL + item.image} alt={item.name} />
                <div className="summary-quantity">{item.quantity || 1}</div>
              </div>
              <div className="itemInfo">
                <p className='itemName'>{item.name}</p>
                <p className="price">{formatPrice(item.price)}</p>
              </div>
            </div>
          ))}
          <div className="summary-details">
            <div><span>Subtotal</span><span className='subtotal'>{formatPrice(subtotal)}</span></div>
            <div><span>Shipping</span><span>{shippingCost === 0 ? 'Free Shipping' : formatPrice(shippingCost)}</span></div>
            <div className="summary-total">
              <span>Total</span>
              <span className='total'>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
