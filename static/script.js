document.addEventListener('DOMContentLoaded', function() {
    fetchMovies();
});

function fetchMovies() {
    fetch('/movies')
        .then(response => response.json())
        .then(data => {
            const moviesList = document.getElementById('movies');
            moviesList.innerHTML = '';
            data.forEach(movie => {
                const li = document.createElement('li');
                li.textContent = `${movie.title} (ISBN: ${movie.isbn}) - Directed by ${movie.director.firstname} ${movie.director.lastname}`;
                moviesList.appendChild(li);
            });
        });
}

function addMovie() {
    const isbn = document.getElementById('isbn').value;
    const title = document.getElementById('title').value;
    const directorFirstname = document.getElementById('directorFirstname').value;
    const directorLastname = document.getElementById('directorLastname').value;

    const movie = {
        isbn: isbn,
        title: title,
        director: {
            firstname: directorFirstname,
            lastname: directorLastname
        }
    };

    fetch('/movies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movie)
    })
    .then(response => response.json())
    .then(() => {
        fetchMovies();
        // Clear input fields
        document.getElementById('isbn').value = '';
        document.getElementById('title').value = '';
        document.getElementById('directorFirstname').value = '';
        document.getElementById('directorLastname').value = '';
    });
}
