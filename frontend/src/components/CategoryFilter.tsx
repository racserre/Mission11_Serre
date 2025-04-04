import { useEffect, useState } from 'react'; // Import React hooks for state and effects
import './CategoryFilter.css'; // Import styles for the component

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[]; // Currently selected categories
  setSelectedCategories: (categories: string[]) => void; // Function to update selected categories
}) {
  const [categories, setCategories] = useState<string[]>([]); // State to store all available book categories

  // Fetch categories from the backend when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://mission13-serre-backend-fbcsaharftc4d4dq.eastus-01.azurewebsites.net/Book/GetBookCategories' // API endpoint to fetch book categories
        );

        const data = await response.json(); // Parse the JSON response
        console.log('Fetched categories:', data); // Log fetched categories for debugging
        setCategories(data); // Update state with the fetched categories
      } catch (error) {
        console.error('Error fetching categories', error); // Log any errors that occur
      }
    };

    fetchCategories(); // Call the function to fetch categories
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  // Handles checkbox selection and updates the selected categories
  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((category) => category !== target.value) // Remove category if already selected
      : [...selectedCategories, target.value]; // Add category if not already selected

    setSelectedCategories(updatedCategories); // Update the selected categories state
  }

  return (
    <div className="category-filter">
      <h5>Book Categories</h5> {/* Title for the category filter */}
      <div className="category-list category-label">
        {categories.map((category) => (
          <div key={category} className="category-item">
            <input
              type="checkbox"
              id={category} // Unique ID for each checkbox
              value={category} // Checkbox value set to category name
              className="category-checkbox"
              onChange={handleCheckboxChange} // Call handler when checkbox is checked/unchecked
            />
            <label htmlFor={category}>{category}</label>{' '}
            {/* Label for checkbox */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
