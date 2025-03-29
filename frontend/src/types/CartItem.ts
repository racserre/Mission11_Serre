export interface CartItem {
  // Each individual book in the cart
  bookID: number;
  title: string;
  price: number; // Price per book
  quantity: number; // How many of this book in cart
  subtotal: number; // price * quantity (for one book type)
}
