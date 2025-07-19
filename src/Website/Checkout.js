import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

function Checkout({ cart = [], setContactInfo, setShippingInfo, formatPrice }) {
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [country, setCountry] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
    'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
    'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
    'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
    'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
    'Haiti', 'Honduras', 'Hungary',
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast',
    'Jamaica', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
    'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
    'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
    'Oman',
    'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar',
    'Romania', 'Russia', 'Rwanda',
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
    'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
    'Yemen',
    'Zambia', 'Zimbabwe'
  ];

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    const digits = phone.replace(/[^0-9]/g, '');
    return digits.length >= 8;
  };

  const isFormValid = () => {
    return email.trim() !== '' && 
           (isValidEmail(email) || isValidPhone(email)) &&
           firstName.trim() !== '' && 
           lastName.trim() !== '' && 
           address.trim() !== '' && 
           city.trim() !== '' && 
           postal.trim() !== '' &&
           country.trim() !== '';
  };

  const hasError = (fieldValue, isContact = false) => {
    if (!showErrors) return false;
    if (isContact) {
      return fieldValue.trim() === '' || (!isValidEmail(fieldValue) && !isValidPhone(fieldValue));
    }
    return fieldValue.trim() === '';
  };

  useEffect(() => {
    setContactInfo({ email });
    setShippingInfo({ address, city, postal, country });
  }, [email, address, city, postal, country, setContactInfo, setShippingInfo]);

  const handleContinue = () => {
    if (isFormValid()) {
      navigate('shipping-method');
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

        <h2>Contact</h2>
        <input 
          type="text" 
          placeholder="Email or mobile phone number" 
          className={`checkout-input ${hasError(email, true) ? 'error' : ''}`}
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />

        <h2>Shipping Address</h2>
        <div className="checkout-gridName">
          <input 
            type="text" 
            placeholder="Name"
            className={hasError(firstName) ? 'error' : ''}
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Second Name"
            className={hasError(lastName) ? 'error' : ''}
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>
        <input 
          type="text" 
          placeholder="Address and number" 
          className={`checkout-input ${hasError(address) ? 'error' : ''}`}
          value={address} 
          onChange={e => setAddress(e.target.value)} 
        />
        <input type="text" placeholder="Shipping note (optional)" className="checkout-input" />

        <div className="checkout-grid">
          <input 
            type="text" 
            placeholder="City" 
            className={hasError(city) ? 'error' : ''}
            value={city} 
            onChange={e => setCity(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Postal Code" 
            className={hasError(postal) ? 'error' : ''}
            value={postal} 
            onChange={e => setPostal(e.target.value)} 
          />
          <select 
            value={country} 
            onChange={e => setCountry(e.target.value)}
            className={hasError(country) ? 'error' : ''}
          >
            <option value="">Country</option>
            {countries.map((countryName) => (
              <option key={countryName} value={countryName}>{countryName}</option>
            ))}
          </select>
        </div>

        <label className="save-checkbox">
          <input type="checkbox" />
          Save this information for a future fast checkout
        </label>

        <div className="checkout-buttons">
          <button className="back-btn" onClick={() => navigate('cart')}>Back to cart</button>
          <button 
            className={`continue-btn ${!isFormValid() ? 'disabled' : ''}`} 
            onClick={() => isFormValid() && navigate('/shipping-method')}
            disabled={!isFormValid()}
          >
            Continue Shopping
          </button>
        </div>

      </div>

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
          <div><span>Shipping</span><span>Calculated at the next step</span></div>
          <div className="summary-total">
            <span>Total</span>
            <span className='total'>{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

