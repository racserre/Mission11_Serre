import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, totalPrice } = useCart();

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="list-group">
          {cart.map((item: CartItem) => (
            <li
              key={item.bookID}
              className="list-group-item list-group-item-action"
            >
              <h3>{item.title}</h3>
              <p>Price: ${item.price.toFixed(2)}</p>
              <p>Quantity: {item.quantity}</p>{' '}
              {/* Simply display the quantity */}
              <p>Subtotal: ${item.subtotal.toFixed(2)}</p>
              <button
                onClick={() => removeFromCart(item.bookID)}
                className="btn btn-danger"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: ${totalPrice.toFixed(2)}</h3>
      <button onClick={() => alert('Checkout functionality coming soon!')}>
        Checkout
      </button>
      <button onClick={() => navigate('/books')}>Continue Shopping</button>
    </div>
  );
}

export default CartPage;
