import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const item = window.localStorage.getItem('feline_cart');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem('feline_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error(error);
    }
  }, [cartItems]);

  const addToCart = (product, variant, qty) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.variant.size === variant.size);
      if (existing) {
        const newQty = Math.min(existing.quantity + qty, variant.stock);
        return prev.map(item => 
          item.id === product.id && item.variant.size === variant.size 
            ? { ...item, quantity: newQty } 
            : item
        );
      }
      return [...prev, { ...product, variant, quantity: Math.min(qty, variant.stock) }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.variant.size === size)));
  };

  const updateQuantity = (id, size, qty) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.variant.size === size) {
        const validQty = Math.max(1, Math.min(qty, item.variant.stock));
        return { ...item, quantity: validQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = cartItems.reduce((total, item) => total + (item.variant.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      setIsCartOpen,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
