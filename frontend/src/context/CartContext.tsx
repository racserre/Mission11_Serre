import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CartItem } from '../types/CartItem';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
  handleQuantityChange: (item: CartItem, change: number) => void; // Added handleQuantityChange method
  totalPrice: number; // Track total price
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = sessionStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart)); // Persist cart in session storage
  }, [cart]);

  // Function to add items to cart
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.bookID === item.bookID
      );

      if (existingItem) {
        // If the book already exists, update its quantity and subtotal by the specified quantity
        return prevCart.map((cartItem) =>
          cartItem.bookID === item.bookID
            ? {
                ...cartItem,
                quantity: cartItem.quantity + item.quantity, // Add the specified quantity
                subtotal: (cartItem.quantity + item.quantity) * cartItem.price, // Recalculate subtotal
              }
            : cartItem
        );
      }

      // If the item is not in the cart, add it as a new item with the specified quantity
      return [...prevCart, { ...item, subtotal: item.price * item.quantity }];
    });
  };

  // Function to remove item from cart
  const removeFromCart = (bookId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.bookID !== bookId));
  };

  // Function to clear the cart
  const clearCart = () => {
    setCart([]);
  };

  // Function to handle quantity changes from -/+ buttons
  const handleQuantityChange = (item: CartItem, change: number) => {
    setCart((prevCart) => {
      return prevCart.map((cartItem) =>
        cartItem.bookID === item.bookID
          ? {
              ...cartItem,
              quantity: cartItem.quantity + change, // Adjust the quantity
              subtotal: (cartItem.quantity + change) * cartItem.price, // Update subtotal based on quantity
            }
          : cartItem
      );
    });
  };

  // Total price calculation
  const totalPrice = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        handleQuantityChange, // Exposing handleQuantityChange method to be used elsewhere
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
