import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ShippingMethod.css';

function ShippingMethod({ cart = [], contactInfo = {}, shippingInfo = {}, selectedShipping, setSelectedShipping, currency, formatPrice }) {
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const EXPRESS_SHIPPING_BASE = 4.99;
  const shippingCost = selectedShipping === 'express' ? EXPRESS_SHIPPING_BASE : 0;
  const formattedExpressShipping = formatPrice(EXPRESS_SHIPPING_BASE);
  const total = subtotal + shippingCost;
  const [shippingError, setShippingError] = React.useState(false);

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <nav className="checkout-steps">
          <span className="step finished">Cart</span> &gt;
          <span className="step finished">Details</span> &gt;
          <span className="step current">Shipping</span> &gt;
          <span className="step">Payment</span>
        </nav>

        <div className="info-combined-box">
          <div className="info-row info-row-inline">
            <span className="info-label">Contact</span>
            <span>{contactInfo.email}</span>
          </div>
          <div className="divider-line"></div>
          <div className="info-row info-row-inline">
            <span className="info-label">Ship to</span>
            <span>{shippingInfo.address}, {shippingInfo.postal} {shippingInfo.city}, {shippingInfo.country}</span>
          </div>
        </div>
        
        <h2>Shipping method</h2>
        <div className="shipping-options">
          <label className="shipping-option">
            <input
              type="radio"
              name="shipping"
              value="standard"
              checked={selectedShipping === 'standard'}
              onChange={() => { setSelectedShipping('standard'); setShippingError(false); }}
            />
            <span>Standard Shipping</span>
            <span className="shipping-price">Free</span>
          </label>
          <label className="shipping-option">
            <input
              type="radio"
              name="shipping"
              value="express"
              checked={selectedShipping === 'express'}
              onChange={() => { setSelectedShipping('express'); setShippingError(false); }}
            />
            <span>Express Shipping</span>
            <span className="shipping-price">{formattedExpressShipping}</span>
          </label>
          {shippingError && (
            <div style={{ color: 'red', marginTop: '0.5rem' }}>
              Please select a shipping method to continue.
            </div>
          )}
        </div>
        <div className="checkout-buttons">
          <button className="back-btn" onClick={() => navigate(-1)}>Back to details</button>
          <button className="continue-btn" onClick={() => {
            if (!selectedShipping) {
              setShippingError(true);
              return;
            }
            setShippingError(false);
            navigate('/payment');
          }}>Go to payment</button>
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
            <div><span>Shipping</span><span>{selectedShipping === 'express' ? formattedExpressShipping : 'Free Shipping'}</span></div>
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

export default ShippingMethod;
