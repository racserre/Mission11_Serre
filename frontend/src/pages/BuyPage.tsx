import { useNavigate, useParams } from 'react-router-dom'; // Importing navigation hooks from react-router-dom
import WelcomeBand from '../components/WelcomeBand'; // Importing WelcomeBand component for the header
import { useCart } from '../context/CartContext'; // Importing useCart to access cart functionality
import { useState, useEffect } from 'react'; // Importing hooks from React to manage state and lifecycle
import CartSummary from '../components/CartSummary'; // Importing CartSummary to display cart information

function BuyPage() {
  const navigate = useNavigate(); // Hook to navigate between pages
  const { bookName, bookID } = useParams(); // Extracting bookName and bookID from the URL params
  const { addToCart } = useCart(); // Destructuring addToCart method from CartContext
  const [price, setPrice] = useState<number>(0); // State to store the price of the book
  const [quantity, setQuantity] = useState<number>(1); // State to store the selected quantity, default is 1

  useEffect(() => {
    // Fetching the price of the book from the API using the bookID
    fetch(
      `https://mission13-serre-backend-fbcsaharftc4d4dq.eastus-01.azurewebsites.net/Book/GetBookPrice/${bookID}`
    )
      .then((res) => res.json()) // Parsing the response as JSON
      .then((data) => setPrice(data.price)) // Setting the fetched price in the state
      .catch((err) => console.error('Error fetching price:', err)); // Logging any errors
  }, [bookID]); // Re-fetch price whenever bookID changes

  const handleAddToCart = () => {
    // Adding the selected book to the cart with the specified quantity and price
    addToCart({
      bookID: Number(bookID), // Converting bookID to a number
      title: bookName || 'No Book Found', // Using bookName or a fallback string if not found
      price,
      quantity,
      subtotal: price * quantity, // Calculating the subtotal for the selected quantity
    });
    navigate('/cart'); // Navigating to the cart page after adding the item
  };

  return (
    <>
      <CartSummary /> {/* Displaying CartSummary component */}
      <WelcomeBand /> {/* Displaying WelcomeBand component */}
      <h2>Buy {bookName}</h2> {/* Displaying the book name */}
      <div>
        <h3>
          Price: ${price.toFixed(2)}{' '}
          {/* Showing the price of the book with two decimal places */}
        </h3>
        <label>
          Quantity:
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))} // Updating quantity based on user input
          />
        </label>
        <button onClick={handleAddToCart}>Add to Cart</button>{' '}
        {/* Button to add item to the cart */}
      </div>
      <button onClick={() => navigate(-1)}>Continue Shopping</button>{' '}
      {/* Button to go back to the previous page */}
    </>
  );
}

export default BuyPage; // Exporting the BuyPage component for use in other parts of the app
