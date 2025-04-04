import { useState } from 'react';
import { Book } from '../types/Book';
import { addBook } from '../api/BooksAPI';

// Props expected from the parent component
interface NewBookFormProps {
  onSuccess: () => void; // Triggered after a successful book addition
  onCancel: () => void; // Triggered when the user cancels the form
}

// Component to create a new book entry
const NewBookForm = ({ onSuccess, onCancel }: NewBookFormProps) => {
  // Local state for holding form input values
  const [formData, setFormData] = useState<Book>({
    bookID: 0,
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
  });

  // Handle changes in form fields and cast number inputs properly
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission and trigger addBook API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addBook(formData);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm mt-4">
      <h2 className="mb-4">Add New Book</h2>

      {/* Title Field */}
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      {/* Author Field */}
      <div className="mb-3">
        <label className="form-label">Author</label>
        <input
          type="text"
          name="author"
          className="form-control"
          value={formData.author}
          onChange={handleChange}
        />
      </div>

      {/* Publisher Field */}
      <div className="mb-3">
        <label className="form-label">Publisher</label>
        <input
          type="text"
          name="publisher"
          className="form-control"
          value={formData.publisher}
          onChange={handleChange}
        />
      </div>

      {/* ISBN Field */}
      <div className="mb-3">
        <label className="form-label">ISBN</label>
        <input
          type="text"
          name="isbn"
          className="form-control"
          value={formData.isbn}
          onChange={handleChange}
        />
      </div>

      {/* Classification Field */}
      <div className="mb-3">
        <label className="form-label">Classification</label>
        <input
          type="text"
          name="classification"
          className="form-control"
          value={formData.classification}
          onChange={handleChange}
        />
      </div>

      {/* Category Field */}
      <div className="mb-3">
        <label className="form-label">Category</label>
        <input
          type="text"
          name="category"
          className="form-control"
          value={formData.category}
          onChange={handleChange}
        />
      </div>

      {/* Page Count Field */}
      <div className="mb-3">
        <label className="form-label">Number of Pages</label>
        <input
          type="number"
          name="pageCount"
          className="form-control"
          value={formData.pageCount}
          onChange={handleChange}
        />
      </div>

      {/* Price Field */}
      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={formData.price}
          onChange={handleChange}
        />
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-end gap-2">
        <button type="submit" className="btn btn-success">
          Add Book
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NewBookForm;
