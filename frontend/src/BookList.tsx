import { useEffect, useState } from 'react';
import { Book } from './types/Book';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch('https://localhost:5000/Book/AllBooks');
      const data = await response.json();
      setBooks(data);
    };

    fetchBooks();
  }, []);

  return (
    <>
      <h1>Book List</h1>
      <br />
      {books.map((book) => (
        <div id="bookCard" key={book.bookID}>
          <h3>{book.title}</h3>

          <ul>
            <li>Author: {book.author}</li>
            <li>Publisher: {book.publisher}</li>
            <li>ISBN: {book.isbn}</li>
            <li>
              Classification/Category: {book.classification}/{book.category}
            </li>
            <li>Category: {book.category}</li>
            <li>Number of Pages: {book.pageCount}</li>
            <li>Price: {book.price}</li>
          </ul>
        </div>
      ))}
    </>
  );
}

export default BookList;
