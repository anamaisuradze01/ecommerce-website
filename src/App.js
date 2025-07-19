import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Cart from './Website/Cart';
import Product from './Website/Product';
import ProductListing from './Website/ProductListing';
import NavBar from './Website/NavBar';
import ShippingMethod from './Website/ShippingMethod';
import Checkout from './Website/Checkout';
import Confirmation from './Website/Confirmation';
import Payment from './Website/Payment';
import './App.css';

function App() {
  const [category, setCategory] = React.useState('woman');
  const [cart, setCart] = useState([]);
  const [contactInfo, setContactInfo] = useState({ email: '' });
  const [shippingInfo, setShippingInfo] = useState({ address: '', city: '', postal: '', country: 'Italy' });
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [currency, setCurrency] = useState({ symbol: '$', label: 'USD', rate: 1 });
  const [products, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(process.env.PUBLIC_URL + '/clothing_data.json');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    loadProducts();
  }, []);

  const addToCart = (product) => {
    console.log('addToCart called with:', { product: product.name, size: product.selectedSize, stockQuantity: product.stockQuantity });
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id && item.selectedSize === product.selectedSize);
      if (existing) {
        console.log('Existing item found, checking stock...');
        const currentProduct = products && products.find(p => p.id === product.id);
        const currentQuantity = existing.quantity || 1;
        
        if (currentProduct && currentQuantity >= currentProduct.stockQuantity) {
          console.log('Cannot add more - already at stock limit');
          return prevCart;
        }
        
        console.log('Incrementing existing item quantity');
        return prevCart.map(item =>
          item.id === product.id && item.selectedSize === product.selectedSize
            ? { ...item, quantity: currentQuantity + 1 }
            : item
        );
      }
      
      console.log('Adding new item to cart');
      const currentProduct = products && products.find(p => p.id === product.id);
      if (currentProduct && currentProduct.stockQuantity <= 0) {
        console.log('Cannot add - out of stock');
        return prevCart;
      }
      
      return [...prevCart, { ...product, cartId: Date.now(), quantity: 1 }];
    });
  };

  const updateCartItemSize = (cartId, newSize) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.cartId === cartId ? { ...item, selectedSize: newSize } : item
      )
    );
  };

  const incrementCartItem = (cartId) => {
    setCart(prevCart => {
      const item = prevCart.find(item => item.cartId === cartId);
      if (!item) return prevCart;
      
      const currentProduct = products && products.find(p => p.id === item.id);
      const currentQuantity = item.quantity || 1;
      
      if (currentProduct && currentQuantity >= currentProduct.stockQuantity) {
        return prevCart;
      }
      
      return prevCart.map(item =>
        item.cartId === cartId ? { ...item, quantity: currentQuantity + 1 } : item
      );
    });
  };

  const decrementCartItem = (cartId) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.cartId === cartId && (item.quantity || 1) > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.cartId !== cartId || (item.quantity || 1) > 1)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateStockAfterPurchase = () => {
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      
      cart.forEach(cartItem => {
        const productIndex = updatedProducts.findIndex(p => p.id === cartItem.id);
        if (productIndex !== -1) {
          const quantity = cartItem.quantity || 1;
          updatedProducts[productIndex].stockQuantity -= quantity;
          
          if (updatedProducts[productIndex].stockQuantity <= 0) {
            updatedProducts[productIndex].inStock = false;
            updatedProducts[productIndex].stockQuantity = 0;
          }
        }
      });
      
      return updatedProducts;
    });
  };

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  const formatPrice = (price) => {
    return `${currency.symbol}${(price * currency.rate).toFixed(2)}`;
  };

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <div>
      {location.pathname !== '/checkout' && location.pathname !== '/shipping-method' && location.pathname !== '/payment' && location.pathname !== '/confirmation' && (
        <NavBar 
          category={category} 
          setCategory={setCategory} 
          cartItemCount={totalItems} 
          cart={cart} 
          totalPrice={totalPrice}
          updateCartItemSize={updateCartItemSize}
          incrementCartItem={incrementCartItem}
          decrementCartItem={decrementCartItem}
          currency={currency}
          changeCurrency={changeCurrency}
          formatPrice={formatPrice}
          products={products}
        />
      )}
      <Routes>
        <Route path="/" element={
          <ProductListing 
            category={category} 
            addToCart={addToCart}
            formatPrice={formatPrice}
            products={products}
          />
        } />
        <Route path="/cart" element={
          <Cart 
            cart={cart} 
            updateCartItemSize={updateCartItemSize} 
            incrementCartItem={incrementCartItem} 
            decrementCartItem={decrementCartItem} 
            totalItems={totalItems} 
            totalPrice={totalPrice}
            currency={currency}
            formatPrice={formatPrice}
            products={products}
          />
        } />
        <Route path="/product" element={
          <Product 
            addToCart={addToCart}
            formatPrice={formatPrice}
            products={products}
          />
        } />
        <Route path="/navbar" element={
          <NavBar 
            category={category} 
            setCategory={setCategory} 
            cartItemCount={totalItems} 
            cart={cart} 
            totalPrice={totalPrice}
            updateCartItemSize={updateCartItemSize}
            incrementCartItem={incrementCartItem}
            decrementCartItem={decrementCartItem}
            currency={currency}
            changeCurrency={changeCurrency}
            formatPrice={formatPrice}
            products={products}
          />
        } />
        <Route path="/shipping-method" element={
          <ShippingMethod 
            cart={cart} 
            contactInfo={contactInfo} 
            shippingInfo={shippingInfo} 
            selectedShipping={selectedShipping} 
            setSelectedShipping={setSelectedShipping}
            currency={currency}
            formatPrice={formatPrice}
          />
        } />
        <Route path="/checkout" element={
          <Checkout 
            cart={cart} 
            setContactInfo={setContactInfo} 
            setShippingInfo={setShippingInfo}
            currency={currency}
            formatPrice={formatPrice}
          />
        } />
        <Route path="/payment" element={
          <Payment 
            cart={cart} 
            contactInfo={contactInfo} 
            shippingInfo={shippingInfo} 
            selectedShipping={selectedShipping}
            currency={currency}
            formatPrice={formatPrice}
          />
        } />
        <Route path="/confirmation" element={
          <Confirmation 
            cart={cart} 
            contactInfo={contactInfo} 
            shippingInfo={shippingInfo} 
            selectedShipping={selectedShipping}
            currency={currency}
            formatPrice={formatPrice}
            clearCart={clearCart}
            updateStockAfterPurchase={updateStockAfterPurchase}
          />
        } />
      </Routes>
    </div>
  );
}

export default App;

