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

    const API_URL = "http://localhost:3000/films";

    // Fetch and display all movies
    function fetchMovies() {
        fetch(API_URL)
            .then(res => res.json())
            .then(movies => {
                movieList.innerHTML = ""; // Clear list
                movies.forEach(movie => {
                    const li = document.createElement("li");
                    li.textContent = movie.title;
                    li.dataset.id = movie.id;
                    li.addEventListener("click", () => displayMovie(movie));
                    movieList.appendChild(li);
                });

                // Display first movie by default
                if (movies.length > 0) {
                    displayMovie(movies[0]);
                }
            });
    }

    // Display selected movie details
    function displayMovie(movie) {
        title.textContent = movie.title;
        poster.src = movie.poster;
        runtime.textContent = movie.runtime;
        showtime.textContent = movie.showtime;
        description.textContent = movie.description;
        const availableTickets = movie.capacity - movie.tickets_sold;
        tickets.textContent = availableTickets > 0 ? availableTickets : "Sold Out";
        buyTicketBtn.disabled = availableTickets <= 0;
        buyTicketBtn.dataset.id = movie.id;
        deleteMovieBtn.dataset.id = movie.id;
    }

    // Buy a ticket
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
                    .then(() => fetchMovies());
                }
            });
    });

    // Delete a movie
    deleteMovieBtn.addEventListener("click", () => {
        const movieId = deleteMovieBtn.dataset.id;

        fetch(`${API_URL}/${movieId}`, { method: "DELETE" })
            .then(() => fetchMovies());
    });

    // Add a new movie
    movieForm.addEventListener("submit", (event) => {
        event.preventDefault();

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
            movieForm.reset();
            fetchMovies();
        });
    });

    // Initial fetch
    fetchMovies();
});
