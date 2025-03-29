import { useNavigate, useParams } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import CartSummary from '../components/CartSummary';

function BuyPage() {
  const navigate = useNavigate();
  const { bookName, bookID } = useParams();
  const { addToCart } = useCart();
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    fetch(`https://localhost:5000/Book/GetBookPrice/${bookID}`)
      .then((res) => res.json())
      .then((data) => setPrice(data.price))
      .catch((err) => console.error('Error fetching price:', err));
  }, [bookID]);

  const handleAddToCart = () => {
    addToCart({
      bookID: Number(bookID),
      title: bookName || 'No Book Found',
      price,
      quantity,
      subtotal: price * quantity,
    });
    navigate('/cart');
  };

  return (
    <>
      <CartSummary />
      <WelcomeBand />
      <h2>Buy {bookName}</h2>

      <div>
        <h3>
          Price: ${price.toFixed(2)}{' '}
          {/* Ensure price is shown with two decimal places */}
        </h3>
        <label>
          Quantity:
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>

      <button onClick={() => navigate(-1)}>Continue Shopping</button>
    </>
  );
}

export default BuyPage;
