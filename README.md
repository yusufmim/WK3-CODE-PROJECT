# WK3-CODE-PROJECT
Here’s a more concise summary without the code:

### **Summary of the Code for the Movie Ticket Booking App**

This movie ticket booking web app is structured using HTML, styled with CSS, and made interactive using JavaScript. It uses a mock database in `db.json` to store movie data.

1. **HTML**: The structure consists of three main sections:
   - A header displaying the app's title.
   - A movie list section that displays a list of films fetched from the database.
   - A movie details section that shows more information about a selected movie.
   - An add movie form that allows users to input new movie details.

2. **CSS**: The app is designed with a dark theme for readability. Flexbox is used for layout, ensuring the content is responsive and properly spaced across different screen sizes. The styling of the movie list includes hover effects to enhance user interaction, while the movie posters are displayed without distortion using `object-fit`.

3. **JavaScript**: The functionality is driven by JavaScript. The app fetches movie data from the `db.json` file and dynamically populates the movie list. Clicking on a movie in the list displays detailed information about it. Users can also add new movies through a form, which sends the data to the backend.

4. **db.json**: This file acts as a mock database, storing film details such as title, runtime, showtime, description, and poster. It allows the app to dynamically interact with the movie data, providing a simple backend for development purposes.

The overall design ensures that the app is user-friendly, with an easy-to-navigate layout and interactive features for movie selection and addition.