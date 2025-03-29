import { useNavigate } from 'react-router-dom'; // Hook for navigation
import { useCart } from '../context/CartContext'; // Custom hook to access cart state
import { useMemo } from 'react'; // useMemo for performance optimization

const CartSummary = () => {
  const navigate = useNavigate(); // Enables navigation to different routes
  const { cart } = useCart(); // Retrieves the cart from context

  // Calculate total quantity and total price using useMemo to optimize performance
  const { totalAmount, totalQuantity } = useMemo(() => {
    return {
      totalAmount: cart.reduce((sum, item) => sum + item.subtotal, 0), // Sums up the subtotal of all items
      totalQuantity: cart.reduce((sum, item) => sum + item.quantity, 0), // Sums up the quantity of all items
    };
  }, [cart]); // Recalculates only when the cart changes

  return (
    <div
      role="button" // Adds button semantics for accessibility
      aria-label="Go to cart" // Improves screen reader experience
      style={{
        position: 'fixed', // Keeps the cart summary fixed on the screen
        top: '10px', // Positions it near the top
        right: '20px', // Positions it near the right edge
        background: '#f8f9fa', // Light gray background for visibility
        padding: '12px 18px', // Adds padding for better clickability
        borderRadius: '8px', // Rounded corners for a modern look
        cursor: 'pointer', // Indicates it's clickable
        display: 'flex', // Aligns items in a row
        alignItems: 'center', // Centers content vertically
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Adds shadow for depth effect
        fontSize: '16px', // Sets text size
        minWidth: '140px', // Ensures minimum width
        flexWrap: 'wrap', // Allows content to wrap if needed
        zIndex: 9999, // Ensures it's above other elements
        transition: 'background 0.2s ease-in-out', // Smooth hover effect
      }}
      onClick={() => navigate('/cart')} // Navigates to the cart page when clicked
      onMouseEnter={(e) => (e.currentTarget.style.background = '#e9ecef')} // Lightens background on hover
      onMouseLeave={(e) => (e.currentTarget.style.background = '#f8f9fa')} // Restores original background on mouse leave
    >
      🛒{' '}
      <strong>
        {totalQuantity > 0
          ? `${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'} - $${totalAmount.toFixed(2)}` // Displays total quantity and price
          : 'Cart is empty'}{' '}
      </strong>
    </div>
    // Shows "Cart is empty" when no items are present
  );
};

export default CartSummary;
