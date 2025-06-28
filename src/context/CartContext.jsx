import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { generateMockProjectDetails } from '../utils/projectGenerators'; // Import generator

// 1. Create the Context
export const CartContext = createContext();

// 2. Create a custom hook to use the context easily
export const useCart = () => useContext(CartContext);

// Helper to get initial state from localStorage - remains outside component
const getInitialPurchasedBeats = () => {
  try {
    const storedBeats = localStorage.getItem('purchasedBeats');
    if (storedBeats) {
      const parsedBeats = JSON.parse(storedBeats);
      console.log('CartContext: Loaded purchasedBeats from localStorage:', parsedBeats);
      return parsedBeats;
    }
    console.log('CartContext: No purchasedBeats found in localStorage, initializing empty array.');
    return [];
  } catch (error) {
    console.error("CartContext: Failed to parse purchasedBeats from localStorage:", error);
    return [];
  }
};

// 3. Create the Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [purchasedBeats, setPurchasedBeats] = useState(getInitialPurchasedBeats);

  // Update localStorage whenever purchasedBeats changes
  useEffect(() => {
    try {
      console.log('CartContext: Saving purchasedBeats to localStorage:', purchasedBeats);
      localStorage.setItem('purchasedBeats', JSON.stringify(purchasedBeats));
    } catch (error) {
      console.error("CartContext: Failed to save purchasedBeats to localStorage:", error);
    }
  }, [purchasedBeats]);

  const addToCart = (item) => {
    if (!cartItems.some(cartItem => cartItem.id === item.id)) {
      setCartItems(prevItems => {
        console.log('CartContext: Added to cart:', item);
        return [...prevItems, item];
      });
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => {
      console.log('CartContext: Removed from cart:', itemId);
      return prevItems.filter(item => item.id !== itemId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    console.log('CartContext: Cart cleared.');
  };

  const addPurchasedBeats = useCallback((beatsToAdd) => {
    console.log('CartContext: addPurchasedBeats called. beatsToAdd:', beatsToAdd);
    
    setPurchasedBeats(prevBeats => { // Use functional update form for prevBeats
        console.log('CartContext: addPurchasedBeats - inside setPurchasedBeats callback. prevBeats:', prevBeats);

        // Generate full collaboration project details for all beats to add
        const potentialNewProjects = beatsToAdd.map(beat => generateMockProjectDetails(beat));

        // Filter out any duplicates that might already exist in prevBeats
        const uniqueNewProjects = potentialNewProjects.filter(newProject => 
            prevBeats.every(existingProject => existingProject.beatDetails.id !== newProject.beatDetails.id)
        );
        // Changed `some` to `every` for clarity and correctness in filter
        // `!prevBeats.some(...)` is equivalent to `prevBeats.every(...)` of the negated condition
        // Here `!prevBeats.some(duplicateCheck)` is `prevBeats.every(noDuplicateFound)`
        // `!prevBeats.some(existingProject => existingProject.beatDetails.id === newProject.beatDetails.id)`
        // is the same as
        // `prevBeats.every(existingProject => existingProject.beatDetails.id !== newProject.beatDetails.id)`


        if (uniqueNewProjects.length > 0) {
            const nextPurchasedBeats = [...prevBeats, ...uniqueNewProjects];
            console.log('CartContext: New unique collaboration projects generated:', uniqueNewProjects);
            console.log('CartContext: Returning nextPurchasedBeats:', nextPurchasedBeats);
            return nextPurchasedBeats;
        }
        console.log('CartContext: No unique new beats to add to purchased (either empty beatsToAdd or all are duplicates). Returning prevBeats.');
        return prevBeats;
    });
  }, []); // Removed purchasedBeats from dependency array as prevBeats is handled by functional update

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const value = {
    cartItems,
    purchasedBeats,
    addToCart,
    removeFromCart,
    clearCart,
    addPurchasedBeats,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};