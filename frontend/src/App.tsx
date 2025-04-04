import './App.css'; // Importing CSS file for global styles
import BooksPage from './pages/BooksPage'; // Importing BooksPage component for displaying the list of books
import BuyPage from './pages/BuyPage'; // Importing BuyPage component for handling individual book purchase
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importing React Router components for page navigation
import CartPage from './pages/CartPage'; // Importing CartPage component for displaying the cart and managing cart items
import { CartProvider } from './context/CartContext'; // Importing CartProvider to provide cart data throughout the app
import AdminBooksPage from './pages/AdminBooksPage';

function App() {
  return (
    <>
      <CartProvider>
        {' '}
        {/* Wrapping the entire app in CartProvider to make cart context available */}
        <Router>
          {' '}
          {/* Setting up routing for the app */}
          <Routes>
            {' '}
            {/* Defining routes for different pages */}
            <Route path="/" element={<BooksPage />} />{' '}
            {/* Default route to display BooksPage */}
            <Route path="/buy/:bookName/:bookID" element={<BuyPage />} />{' '}
            {/* Route to handle book purchase */}
            <Route path="/books" element={<BooksPage />} />{' '}
            {/* Route to view the list of books */}
            <Route path="/cart" element={<CartPage />} />{' '}
            {/* Route to view the shopping cart */}
            <Route path="/adminbooks" element={<AdminBooksPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App; // Exporting the App component for use in other parts of the application
