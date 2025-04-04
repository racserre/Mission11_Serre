import { useState } from 'react';
import { Book } from '../types/Book';
import { updateBook } from '../api/BooksAPI';

// Props interface for the edit form
interface EditBookFormProps {
  book: Book; // The book to be edited
  onSuccess: () => void; // Callback to trigger when update is successful
  onCancel: () => void; // Callback to cancel editing
}

// Functional component for editing a book
const EditBookForm = ({ book, onSuccess, onCancel }: EditBookFormProps) => {
  // Local state to manage form inputs, initialized from the book prop
  const [formData, setFormData] = useState<Book>({ ...book });

  // Handle input changes and update the corresponding field in formData
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit handler to call updateBook API and trigger success callback
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBook(formData.bookID, formData);
    onSuccess();
  };

  // Render the form
  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm mt-4">
      <h2 className="mb-4">Edit Book</h2>

      {/* Each field is grouped using Bootstrap classes for styling */}
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

      {/* Form action buttons */}
      <div className="d-flex justify-content-end gap-2">
        <button type="submit" className="btn btn-success">
          Update Book
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditBookForm;
