import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartPage.css'; // Ensure you have this CSS file

function CartPage() {
  const { cartItems, removeFromCart, addPurchasedBeats, clearCart } = useCart();
  const navigate = useNavigate();

  const handleConfirmCheckout = () => {
    console.log("--- CartPage: Confirm button clicked! ---");
    
    if (!cartItems || cartItems.length === 0) {
        console.error("Checkout failed: Cart is empty.");
        alert("Your cart is empty!");
        return;
    }

    // --- The two crucial steps of a successful purchase ---
    // 1. Move items from the temporary cart to the permanent "purchased" list.
    addPurchasedBeats(cartItems);

    // 2. Clear the temporary cart.
    clearCart();

    console.log("--- CartPage: Navigating to /hub ---");
    // 3. Navigate to the hub to see the results.
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