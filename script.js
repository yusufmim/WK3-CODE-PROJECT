document.addEventListener("DOMContentLoaded", () => {
    const movieList = document.getElementById("films");  // Movie list section
    const title = document.getElementById("title");      // Movie title in details section
    const poster = document.getElementById("poster");    // Movie poster in details section
    const runtime = document.getElementById("runtime");  // Movie runtime in details section
    const showtime = document.getElementById("showtime"); // Movie showtime in details section
    const tickets = document.getElementById("tickets");  // Tickets available in details section
    const description = document.getElementById("description"); // Movie description in details section
    const buyTicketBtn = document.getElementById("buy-ticket");  // Buy ticket button
    const deleteMovieBtn = document.getElementById("delete-movie"); // Delete movie button
    const movieForm = document.getElementById("movie-form"); // Movie form

    const API_URL = "http://localhost:3000/films";  // URL of the JSON server

    // Fetch and display all movies
    function fetchMovies() {
        fetch(API_URL)
            .then(res => res.json())
            .then(movies => {
                movieList.innerHTML = ""; // Clear existing movie list

                // Loop through movies and create list items
                movies.forEach(movie => {
                    const li = document.createElement("li");
                    li.textContent = movie.title;
                    li.dataset.id = movie.id;  // Set movie ID as data attribute
                    li.addEventListener("click", () => displayMovie(movie));  // Add event to display movie details
                    movieList.appendChild(li);  // Append movie title to the list
                });

                // Display the first movie by default (if movies exist)
                if (movies.length > 0) {
                    displayMovie(movies[0]);
                }
            })
            .catch(err => console.error("Error fetching movies:", err));  // Handle errors
    }

    // Display selected movie details
    function displayMovie(movie) {
        title.textContent = movie.title;  // Set movie title
        poster.src = movie.poster;        // Set movie poster image
        poster.alt = `${movie.title} Poster`;  // Set alt text for accessibility
        runtime.textContent = `Runtime: ${movie.runtime} minutes`; // Set runtime
        showtime.textContent = `Showtime: ${movie.showtime}`; // Set showtime
        description.textContent = movie.description; // Set description

        // Calculate available tickets
        const availableTickets = movie.capacity - movie.tickets_sold;
        tickets.textContent = availableTickets > 0 ? `Tickets Available: ${availableTickets}` : "Sold Out";
        buyTicketBtn.disabled = availableTickets <= 0;  // Disable buy button if sold out
        buyTicketBtn.dataset.id = movie.id;  // Set movie ID on the buy button
        deleteMovieBtn.dataset.id = movie.id; // Set movie ID on the delete button
    }

    // Buy a ticket functionality
    buyTicketBtn.addEventListener("click", () => {
        const movieId = buyTicketBtn.dataset.id;

        fetch(`${API_URL}/${movieId}`)
            .then(res => res.json())
            .then(movie => {
                if (movie.tickets_sold < movie.capacity) {
                    const updatedTickets = movie.tickets_sold + 1;

                    fetch(`${API_URL}/${movieId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ tickets_sold: updatedTickets })
                    })
                    .then(() => fetchMovies());  // Re-fetch movies to update ticket count
                }
            })
            .catch(err => console.error("Error buying ticket:", err));
    });

    // Delete a movie functionality
    deleteMovieBtn.addEventListener("click", () => {
        const movieId = deleteMovieBtn.dataset.id;

        fetch(`${API_URL}/${movieId}`, { method: "DELETE" })
            .then(() => fetchMovies())  // Re-fetch movies after deletion
            .catch(err => console.error("Error deleting movie:", err));
    });

    // Add a new movie
    movieForm.addEventListener("submit", (event) => {
        event.preventDefault();  // Prevent form submission

        const newMovie = {
            title: document.getElementById("new-title").value,
            runtime: document.getElementById("new-runtime").value,
            showtime: document.getElementById("new-showtime").value,
            capacity: document.getElementById("new-capacity").value,
            tickets_sold: 0,
            poster: document.getElementById("new-poster").value,
            description: document.getElementById("new-description").value
        };

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMovie)
        })
        .then(() => {
            movieForm.reset();  // Reset form fields
            fetchMovies();      // Re-fetch movies to show new movie in the list
        })
        .catch(err => console.error("Error adding movie:", err));
    });

    // Initial fetch of movies
    fetchMovies();
});
