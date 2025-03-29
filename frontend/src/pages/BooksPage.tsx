import { useState } from 'react';
import BookList from '../components/BookList'; // Importing BookList component to display books
import CategoryFilter from '../components/CategoryFilter'; // Importing CategoryFilter component to filter books by category
import WelcomeBand from '../components/WelcomeBand'; // Importing WelcomeBand component for the header
import CartSummary from '../components/CartSummary'; // Importing CartSummary component to show the cart summary

function BooksPage() {
  // useState hook to manage the list of selected categories for filtering books
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <div className="container mt-4">
      {' '}
      {/* Container for the page content with top margin */}
      <CartSummary /> {/* Displaying the CartSummary component */}
      <WelcomeBand /> {/* Displaying the WelcomeBand component */}
      <div className="row">
        {' '}
        {/* Row to layout the filter and book list side by side */}
        <div className="col-md-3">
          {' '}
          {/* Column for the category filter */}
          <CategoryFilter
            selectedCategories={selectedCategories} // Pass selected categories to CategoryFilter
            setSelectedCategories={setSelectedCategories} // Pass setter function to update selected categories
          />
        </div>
        <div className="col-md-9">
          {' '}
          {/* Column for the book list */}
          <BookList selectedCategories={selectedCategories} />{' '}
          {/* Displaying the filtered list of books */}
        </div>
      </div>
    </div>
  );
}

export default BooksPage; // Exporting BooksPage as the default export for use in other parts of the app
