import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [purchasedBeats, setPurchasedBeats] = useState([]);

    const addToCart = (beat) => {
        // This part is working correctly
        setCartItems(prevItems => [...prevItems, beat]);
    };

    const removeFromCart = (beatId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== beatId));
    };

    // This is the function that moves items to the final list
    const addPurchasedBeats = (beats) => {
        console.log("✅ addPurchasedBeats CALLED with:", beats);
        setPurchasedBeats(prevBeats => [...prevBeats, ...beats]);
    };

    const clearCart = () => {
        console.log("✅ clearCart CALLED");
        setCartItems([]);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        purchasedBeats,
        addPurchasedBeats,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};