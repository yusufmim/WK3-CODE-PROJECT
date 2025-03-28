document.addEventListener("DOMContentLoaded", () => {
    const movieList = document.getElementById("films");
    const title = document.getElementById("title");
    const poster = document.getElementById("poster");
    const runtime = document.getElementById("runtime");
    const showtime = document.getElementById("showtime");
    const tickets = document.getElementById("tickets");
    const description = document.getElementById("description");
    const buyTicketBtn = document.getElementById("buy-ticket");
    const deleteMovieBtn = document.getElementById("delete-movie");
    const movieForm = document.getElementById("movie-form");

    const API_URL = "http://localhost:4000/films";
    fetch('http://localhost:4000/films')


    // Fetch and display all movies
    function fetchMovies() {
        console.log("Fetching movies...");
        fetch(API_URL)
            .then(res => res.json())
            .then(movies => {
                console.log("Movies fetched:", movies); // Log movies fetched

                movieList.innerHTML = ""; // Clear existing movie list

                movies.forEach(movie => {
                    const li = document.createElement("li");
                    li.textContent = movie.title;
                    li.dataset.id = movie.id;
                    li.addEventListener("click", () => displayMovie(movie));
                    movieList.appendChild(li);
                });

                // Display the first movie by default
                if (movies.length > 0) {
                    displayMovie(movies[0]);
                }
            })
            .catch(err => console.error("Error fetching movies:", err));
    }

    // Display selected movie details
    function displayMovie(movie) {
        console.log("Displaying movie:", movie); // Log the movie being displayed
        title.textContent = movie.title;
        poster.src = movie.poster;
        poster.alt = `${movie.title} Poster`;
        runtime.textContent = `Runtime: ${movie.runtime} minutes`;
        showtime.textContent = `Showtime: ${movie.showtime}`;
        description.textContent = movie.description;

        const availableTickets = movie.capacity - movie.tickets_sold;
        tickets.textContent = availableTickets > 0 ? `Tickets Available: ${availableTickets}` : "Sold Out";
        buyTicketBtn.disabled = availableTickets <= 0;

        buyTicketBtn.dataset.id = movie.id;
        deleteMovieBtn.dataset.id = movie.id;
    }

    // Buy a ticket
    buyTicketBtn.addEventListener("click", () => {
        const movieId = buyTicketBtn.dataset.id;
        console.log(`Buying ticket for movie ID: ${movieId}`); // Log ticket purchase attempt

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
                    .then(() => {
                        // Update UI instead of refetching everything
                        const availableTickets = movie.capacity - updatedTickets;
                        tickets.textContent = availableTickets > 0 ? `Tickets Available: ${availableTickets}` : "Sold Out";
                        buyTicketBtn.disabled = updatedTickets >= movie.capacity;
                    })
                    .catch(err => console.error("Error updating ticket count:", err));
                }
            })
            .catch(err => console.error("Error fetching movie data:", err));
    });

    // Delete a movie
    deleteMovieBtn.addEventListener("click", () => {
        const movieId = deleteMovieBtn.dataset.id;
        console.log(`Deleting movie with ID: ${movieId}`); // Log movie deletion attempt

        fetch(`${API_URL}/${movieId}`, { method: "DELETE" })
            .then(() => {
                // Remove from UI without refetching
                document.querySelector(`li[data-id='${movieId}']`).remove();

                // Clear movie details section
                title.textContent = "";
                poster.src = "";
                runtime.textContent = "";
                showtime.textContent = "";
                description.textContent = "";
                tickets.textContent = "";
                buyTicketBtn.disabled = true;
            })
            .catch(err => console.error("Error deleting movie:", err));
    });

    // Add a new movie
    movieForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newMovie = {
            id: Date.now(), // Generate a unique ID
            title: document.getElementById("new-title").value,
            runtime: parseInt(document.getElementById("new-runtime").value, 10),
            showtime: document.getElementById("new-showtime").value,
            capacity: parseInt(document.getElementById("new-capacity").value, 10),
            tickets_sold: 0,
            poster: document.getElementById("new-poster").value,
            description: document.getElementById("new-description").value
        };

        console.log("Adding new movie:", newMovie); // Log the new movie being added

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMovie)
        })
        .then(() => {
            movieForm.reset();
            fetchMovies(); // Refresh movie list after adding new movie
        })
        .catch(err => console.error("Error adding movie:", err));
    });

    // Initial fetch of movies
    fetchMovies();
});
