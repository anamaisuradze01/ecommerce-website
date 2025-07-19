import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CartPreview from './CartPreview';
import './NavBar.css';
import mainLogo from './MainLogo.png';

const currencyOptions = [
  { symbol: '$', label: 'USD', rate: 1 },
  { symbol: '€', label: 'EUR', rate: 0.85 },
  { symbol: '£', label: 'GBP', rate: 0.73 },
];

function NavBar({ 
  category, 
  setCategory, 
  cart, 
  totalPrice, 
  updateCartItemSize, 
  incrementCartItem, 
  decrementCartItem,
  currency,
  changeCurrency,
  formatPrice,
  products
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleCategoryClick = (newCategory) => {
    setCategory(newCategory);
    navigate('/');
  };

  const toggleCartPreview = () => setCartPreviewOpen(!cartPreviewOpen);
  const isProductListing = location.pathname === '/';

  return (
    <>
      {cartPreviewOpen && (
        <div 
          className="cart-overlay" 
          onClick={() => setCartPreviewOpen(false)}
        />
      )}
      <nav className="navbar">
        <div className="navbar-left">
          {['woman', 'man', 'kids'].map((cat) => (
            <button
              key={cat}
              className={`category-btn${isProductListing && category === cat ? ' active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="navbar-center">
          <button className="logo-btn" onClick={() => navigate('/')} aria-label="Home">
            <img src={mainLogo} alt="Logo" className="logo-img" />
          </button>
        </div>

        <div className="navbar-right">
          <div className="currency-dropdown-select" ref={dropdownRef}>
            <div 
              className="currency-display"
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
            >
              <span className="currency-symbol">{currency.symbol}</span>
              <span className="currency-arrow">
                <svg width="8" height="4" viewBox="0 0 8 4" fill="none">
                  <path d="M1 0.5L4 3.5L7 0.5" stroke="black" />
                </svg>
              </span>
            </div>
            {currencyDropdownOpen && (
              <div className="currency-options">
                {currencyOptions.map((opt) => (
                  <div
                    key={opt.label}
                    className={`currency-option${currency.label === opt.label ? ' selected' : ''}`}
                    onClick={() => {
                      changeCurrency(opt);
                      setCurrencyDropdownOpen(false);
                    }}
                  >
                    {opt.symbol} {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cart-preview-wrapper">
            <button className="cart-btn" onClick={toggleCartPreview} aria-label="Cart">
              {cart?.length > 0 && <span className="cart-item-count">{cart.length}</span>}
              <svg className="cart-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </button>
            {cartPreviewOpen && (
              <CartPreview
                cart={cart}
                totalPrice={totalPrice}
                closePreview={() => setCartPreviewOpen(false)}
                updateCartItemSize={updateCartItemSize}
                incrementCartItem={incrementCartItem}
                decrementCartItem={decrementCartItem}
                formatPrice={formatPrice}
                products={products}
              />
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
