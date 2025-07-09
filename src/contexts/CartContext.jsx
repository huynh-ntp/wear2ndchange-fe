import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import { privateApi } from "../services/api";

const CartContext = createContext(null);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart items when user changes
  useEffect(() => {
    if (user) {
      fetchCartItems();
      fetchCartCount();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [user]);

  const fetchCartCount = async () => {
    try {
      const response = await privateApi.get("/cart/countCart");
      setCartCount(response.data);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await privateApi.get("/cart");
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await privateApi.post("/cart", { productId });
      await fetchCartItems(); // Refresh cart items after adding
      await fetchCartCount(); // Refresh cart count after adding
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await privateApi.delete(`/cart/${productId}`);
      await fetchCartItems(); // Refresh cart items after removing
      await fetchCartCount(); // Refresh cart count after removing
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      await privateApi.delete("/cart");
      setCartItems([]);
      setCartCount(0);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        clearCart,
        fetchCartItems,
        fetchCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
