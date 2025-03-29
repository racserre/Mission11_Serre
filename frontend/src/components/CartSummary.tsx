import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartSummary = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  // ✅ Ensure subtotal is used (avoids calculation mistakes)
  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '20px',
        background: '#f8f9fa',
        padding: '10px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        fontSize: '16px',
        minWidth: '120px', // ✅ Helps prevent UI squishing on small screens
        flexWrap: 'wrap',
        zIndex: 9999,
      }}
      onClick={() => navigate('/cart')}
    >
      🛒 <strong>${totalAmount.toFixed(2)}</strong>
    </div>
  );
};

export default CartSummary;
