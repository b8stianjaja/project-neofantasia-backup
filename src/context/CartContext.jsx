import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [purchasedBeats, setPurchasedBeats] = useState([]);

    const addToCart = (beat) => {
        if (cartItems.find(item => item.id === beat.id)) {
            alert('This beat is already in your cart.');
            return;
        }
        setCartItems(prevItems => [...prevItems, beat]);
    };

    const removeFromCart = (beatId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== beatId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const addPurchasedBeats = (beats) => {
        setPurchasedBeats(prevBeats => {
            const newBeats = [...prevBeats];
            const purchasedIds = new Set(prevBeats.map(b => b.id));
            beats.forEach(beat => {
                if (!purchasedIds.has(beat.id)) {
                    newBeats.push(beat);
                }
            });
            return newBeats;
        });
    };

    const value = {
        cartItems,
        purchasedBeats,
        addToCart,
        removeFromCart,
        clearCart,
        addPurchasedBeats,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};