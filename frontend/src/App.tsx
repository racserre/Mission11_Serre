import './App.css';
import BooksPage from './pages/BooksPage';
import BuyPage from './pages/BuyPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<BooksPage />} />
            <Route path="/buy/:bookName/:bookID" element={<BuyPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App; // Exports the App component
