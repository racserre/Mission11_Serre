import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook for navigation
import { useCart } from '../context/CartContext'; // Importing useCart hook to access cart functionality
import { CartItem } from '../types/CartItem'; // Importing CartItem type for type safety

function CartPage() {
  const navigate = useNavigate(); // Hook to navigate between pages
  const { cart, removeFromCart, totalPrice } = useCart(); // Accessing cart items, removeFromCart method, and total price from CartContext

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        // Displaying message if the cart is empty
        <p>Your cart is empty.</p>
      ) : (
        // Mapping through the cart items to display each item in a list
        <ul className="list-group">
          {cart.map((item: CartItem) => (
            <li
              key={item.bookID} // Using bookID as a unique key for each cart item
              className="list-group-item list-group-item-action"
            >
              <h3>{item.title}</h3> {/* Displaying the book title */}
              <p>Price: ${item.price.toFixed(2)}</p>{' '}
              {/* Displaying the price with two decimal places */}
              <p>Quantity: {item.quantity}</p>{' '}
              {/* Displaying the quantity of the item */}
              <p>Subtotal: ${item.subtotal.toFixed(2)}</p>{' '}
              {/* Displaying the subtotal for this item */}
              <button
                onClick={() => removeFromCart(item.bookID)} // Handling item removal by calling removeFromCart with bookID
                className="btn btn-danger"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: ${totalPrice.toFixed(2)}</h3>{' '}
      {/* Displaying the total price of all cart items */}
      <button onClick={() => alert('Checkout functionality coming soon!')}>
        {/* Placeholder for checkout functionality */}
        Checkout
      </button>
      <button onClick={() => navigate('/books')}>Continue Shopping</button>{' '}
      {/* Button to navigate back to the books page */}
    </div>
  );
}

export default CartPage; // Exporting CartPage component for use in other parts of the app
