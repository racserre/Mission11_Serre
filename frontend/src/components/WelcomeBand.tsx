function WelcomeBand() {
  // The component renders a welcome message at the top of the page (sticky navbar style)
  return (
    <div className="row bg-success text-white navbar navbar-toggler sticky-top">
      {/* This is the heading for the book list, styled as a centered white text with margin at the bottom */}
      <h1 className="text-center mb-4">Book List</h1>
    </div>
  );
}

export default WelcomeBand;
