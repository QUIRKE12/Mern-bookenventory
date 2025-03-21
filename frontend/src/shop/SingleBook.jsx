import { useLoaderData } from "react-router-dom";

const SingleBook = () => {
    const book = useLoaderData();
    console.log(book)
    async ({ params }) => {
        console.log("Fetching data for ID:", params.id);  // Debugging log
      
        const res = await fetch(`http://localhost:5000/books/${params.id}`);
      
        if (!res.ok) {
          console.error("Response status:", res.status); // Log HTTP status code
          throw new Error("Failed to load book data");
        }
      
        return res.json();
      }
      
    return (
      <div className='mt-28 px-4 lg:px-24'>
        <h2>{book?.bookTitle}</h2> {/* Use optional chaining to prevent errors */}
      </div>
    );
}

export default SingleBook;
