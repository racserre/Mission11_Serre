// Import the Book type definition
import { Book } from '../types/Book';

// Define the expected shape of the response when fetching books
interface FetchBooksResponse {
  books: Book[]; // Array of book objects
  totalNumBooks: number; // Total number of books available (for pagination)
}

// Base URL for API calls related to books
const API_URL =
  'https://mission13-serre-backend-fbcsaharftc4d4dq.eastus-01.azurewebsites.net/Book';

// Fetch a paginated, optionally sorted and filtered list of books
export const fetchBooks = async (
  pageSize: number, // How many books to fetch per page
  pageNum: number, // The current page number
  selectedCategories: string[], // Optional list of categories to filter by
  sortEnabled: boolean, // Whether sorting is enabled
  sortOrder: string // Sort order ('asc' or 'desc')
): Promise<FetchBooksResponse> => {
  try {
    // Build query string for selected categories (if any)
    const categoryParams = selectedCategories
      .map((category) => `bookTypes=${encodeURIComponent(category)}`)
      .join('&');

    // Build the base URL with pagination and optional category filters
    let url = `${API_URL}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`;

    // Append sorting options if sorting is enabled
    if (sortEnabled) {
      url += `&sortBy=title&sortOrder=${sortOrder}`;
    }

    // Perform the API request
    const response = await fetch(url);

    // Throw an error if the request failed
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error('Error fetching books', error);
    throw error;
  }
};

// Send a new book to the backend to be added to the database
export const addBook = async (newBook: Book): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/AddBook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Send JSON data
      },
      body: JSON.stringify(newBook), // Convert book object to JSON
    });

    // Throw an error if the request failed
    if (!response.ok) {
      throw new Error('Failed to add book');
    }

    // Return the newly created book from the backend
    return await response.json();
  } catch (error) {
    console.error('Error adding book', error);
    throw error;
  }
};

// Update an existing book by its ID
export const updateBook = async (
  bookId: number, // The ID of the book to update
  updatedBook: Book // The updated book object
): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/UpdateBook/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBook),
    });

    // Return the updated book from the backend
    return await response.json();
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

// Delete a book by its ID
export const deleteBook = async (bookId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteBook/${bookId}`, {
      method: 'DELETE',
    });

    // Throw an error if the delete failed
    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
