import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
  const { cartItems, removeFromCart, addPurchasedBeats, clearCart } = useCart();
  const navigate = useNavigate();

  const handleConfirmCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    addPurchasedBeats(cartItems);
    clearCart();
    navigate('/hub');
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price || 0), 0);

  return (
    <div className="cart-page-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-items-list">
            {cartItems.map((item, index) => (
              <li key={`${item.id}-${index}`} className="cart-item">
                <span className="item-title">{item.title}</span>
                <span className="item-price">${(item.price || 0).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.id)} className="remove-btn">Remove</button>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h3>Total: ${cartTotal.toFixed(2)}</h3>
            <button onClick={handleConfirmCheckout} className="checkout-btn">
              Confirm Purchase
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;