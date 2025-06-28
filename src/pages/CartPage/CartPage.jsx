import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartPage.css';

function CartPage() {
  const { cartItems, removeFromCart, clearCart, getTotalPrice, addPurchasedBeats } = useCart();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemsToConfirm, setItemsToConfirm] = useState([]); // State to hold items for confirmation

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cartItems.length > 0) {
      setItemsToConfirm(cartItems); // Store cart items before showing modal
      console.log('CartPage: Initiating checkout with cartItems:', cartItems);
      setShowConfirmation(true);
    } else {
      alert('Your cart is empty!');
    }
  };
  
  const handleConfirmCheckout = () => {
    console.log('CartPage: Confirming checkout for items:', itemsToConfirm);
    addPurchasedBeats(itemsToConfirm); // Use the items captured at initiation
    clearCart(); // Clear the cart after purchase
    setShowConfirmation(false);
    setItemsToConfirm([]); // Clear temporary state
    navigate('/hub'); // Navigate to the Collaboration Hub
  };

  const renderConfirmationModal = () => (
    <div className="checkout-modal-overlay">
      <div className="checkout-modal-content">
        <h2 className="checkout-modal-title">Purchase Complete!</h2>
        <p>Thank you for your order.</p>
        <p>Your beats are now available in your Collaboration Hub!</p>
        <button onClick={handleConfirmCheckout} className="crystal-button">
          Go to Hub
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      {showConfirmation && renderConfirmationModal()}
      <div className="cart-container">
        <h1 className="cart-title">Your Cart</h1>
        {cartItems.length > 0 ? (
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.artwork} alt={item.name} className="cart-item-artwork" />
                <div className="cart-item-details">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">${item.price.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="cart-item-remove"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="cart-empty-message">Your cart is empty.</p>
        )}

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span>${getTotalPrice()}</span>
            </div>
            <div className="cart-actions">
              <button onClick={clearCart} className="clear-cart-button">Clear Cart</button>
              <button onClick={handleCheckout} className="checkout-button">CHECKOUT</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;