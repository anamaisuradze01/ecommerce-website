import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

function Payment({ cart = [], contactInfo = {}, shippingInfo = {}, selectedShipping, formatPrice }) {
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  const [cardNumber, setCardNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvv, setCvv] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const isValidCardNumber = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    return /^\d{16}$/.test(cleanNumber);
  };

  const isValidExpiration = (exp) => {
    if (!/^\d{2}\/\d{2}$/.test(exp)) return false;
    
    const [month, year] = exp.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; 
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
  };

  const isValidCVV = (cvv) => {
    return /^\d{3}$/.test(cvv);
  };

  const isFormValid = () => {
    return isValidCardNumber(cardNumber) &&
           holderName.trim() !== '' &&
           isValidExpiration(expiration) &&
           isValidCVV(cvv);
  };

  const hasError = (fieldValue, validator) => {
    if (!showErrors) return false;
    return !validator(fieldValue);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 16) value = value.slice(0, 16); 
    
    if (value.length > 8) {
      value = value.slice(0, 4) + ' ' + value.slice(4, 8) + ' ' + value.slice(8, 12) + ' ' + value.slice(12);
    } else if (value.length > 4) {
      value = value.slice(0, 4) + ' ' + value.slice(4);
    }
    
    setCardNumber(value);
  };

  const handleExpirationChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 4) value = value.slice(0, 4); 
    
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiration(value);
  };

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 3) value = value.slice(0, 3); 
    setCvv(value);
  };

  const handlePayNow = () => {
    if (isFormValid()) {
      navigate('/confirmation');
    } else {
      setShowErrors(true);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <nav className="checkout-steps">
          <span className="step finished">Cart</span> &gt;
          <span className="step finished">Details</span> &gt;
          <span className="step finished">Shipping</span> &gt;
          <span className="step current">Payment</span>
        </nav>

        <div className="info-combined-box full-box">
          <div className="info-row-inline-payment">
            <span className="info-label">Contact</span>
            <span>{contactInfo.email}</span>
          </div>
          <div className="divider-line"></div>
          <div className="info-row-inline-payment">
            <span className="info-label">Ship to</span>
            <span>{shippingInfo.address}, {shippingInfo.postal} {shippingInfo.city}, {shippingInfo.country}</span>
          </div>
          <div className="divider-line"></div>
          <div className="info-row-inline-payment">
            <span className="info-label">Method</span>
            <span>{selectedShipping === 'express' ? `Express Shipping - ${formatPrice(4.99)}` : 'Standard Shipping - FREE'}</span>
          </div>
        </div>

        <h2>Payment method</h2>

        <div className="payment-method-box">
          <div className="payment-method-header">
            <img src="https://img.icons8.com/ios-filled/50/228B22/bank-card-back-side.png" alt="card icon" className="card-icon"/>
            <span className="method-label">Credit Card</span>
          </div>
          <div className="payment-method-body">
            <input 
              type="text" 
              placeholder="Card Number" 
              className={`payment-input ${hasError(cardNumber, isValidCardNumber) ? 'error' : ''}`}
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
            />
            <input 
              type="text" 
              placeholder="Holder Name" 
              className={`payment-input ${hasError(holderName, (name) => name.trim() !== '') ? 'error' : ''}`}
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
            />
            <div className="payment-row">
                <input 
                  type="text" 
                  placeholder="Expiration (MM/YY)" 
                  className={`payment-input small ${hasError(expiration, isValidExpiration) ? 'error' : ''}`}
                  value={expiration}
                  onChange={handleExpirationChange}
                  maxLength={5}
                />
                <input 
                  type="text" 
                  placeholder="CVV" 
                  className={`payment-input small ${hasError(cvv, isValidCVV) ? 'error' : ''}`}
                  value={cvv}
                  onChange={handleCVVChange}
                  maxLength={3}
                />
            </div>
          </div>
        </div>

        <div className="checkout-buttons">
          <button className="back-btn" onClick={() => navigate(-1)}>Back to shipping</button>
          <button 
            className={`continue-btn ${!isFormValid() ? 'disabled' : ''}`} 
            onClick={handlePayNow}
            disabled={!isFormValid()}
          >
            Pay now
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

export default Payment;
