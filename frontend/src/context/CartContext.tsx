import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CartItem } from '../types/CartItem';

// Defining the structure of the cart context type
interface CartContextType {
  cart: CartItem[]; // List of items in the cart
  addToCart: (item: CartItem) => void; // Function to add an item to the cart
  removeFromCart: (bookId: number) => void; // Function to remove an item from the cart
  clearCart: () => void; // Function to clear the cart
  totalPrice: number; // Total price of all items in the cart
}

// Creating the CartContext with a default value of undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider component that manages cart state and logic
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initializing the cart state from session storage or an empty array
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = sessionStorage.getItem('cart'); // Try to get saved cart from sessionStorage
    return savedCart ? JSON.parse(savedCart) : []; // If found, parse it; otherwise, start with an empty array
  });

  // Persist the cart in sessionStorage every time it changes
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart)); // Save cart state to sessionStorage
  }, [cart]);

  // Function to add an item to the cart
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      // Check if the item is already in the cart by comparing bookID
      const existingItem = prevCart.find(
        (cartItem) => cartItem.bookID === item.bookID
      );

      if (existingItem) {
        // If the item is found, update its quantity and subtotal
        return prevCart.map((cartItem) =>
          cartItem.bookID === item.bookID
            ? {
                ...cartItem,
                quantity: cartItem.quantity + item.quantity, // Increase quantity
                subtotal: (cartItem.quantity + item.quantity) * cartItem.price, // Update subtotal based on quantity
              }
            : cartItem
        );
      }

      // If the item isn't in the cart, add it as a new item with the specified quantity
      return [...prevCart, { ...item, subtotal: item.price * item.quantity }];
    });
  };

  // Function to remove an item from the cart by bookID
  const removeFromCart = (bookId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.bookID !== bookId)); // Remove the item with the given bookID
  };

  // Function to clear all items from the cart
  const clearCart = () => {
    setCart([]); // Reset cart to an empty array
  };

  // Calculate the total price of all items in the cart by summing their subtotals
  const totalPrice = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    // Providing the cart state and functions to the rest of the app through context
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}
    >
      {children} {/* Render the child components within the CartProvider */}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    // If useCart is called outside of CartProvider, throw an error
    throw new Error('useCart must be used within a CartProvider');
  }
  return context; // Return the context values for usage in components
};
