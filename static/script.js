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
                
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteMovie(movie.id);
                li.appendChild(deleteButton);
                
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.onclick = () => editMovie(movie);
                li.appendChild(editButton);

                moviesList.appendChild(li);
            });
        });
}

function addMovie() {
    const isbn = document.getElementById('isbn').value;
    
    // Validate ISBN
    if (!/^\d{13}$/.test(isbn)) {
        alert("Please enter a valid 13-digit ISBN.");
        return;
    }

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
        clearInputs();
    });
}
function deleteMovie(id) {
    fetch(`/movies/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchMovies());
}

function editMovie(movie) {
    document.getElementById('updateId').value = movie.id;
    document.getElementById('updateIsbn').value = movie.isbn;
    document.getElementById('updateTitle').value = movie.title;
    document.getElementById('updateDirectorFirstname').value = movie.director.firstname;
    document.getElementById('updateDirectorLastname').value = movie.director.lastname;

    document.getElementById('movieForm').style.display = 'none';
    document.getElementById('updateForm').style.display = 'block';
}

function updateMovie() {
    const id = document.getElementById('updateId').value;
    const isbn = document.getElementById('updateIsbn').value;
    const title = document.getElementById('updateTitle').value;
    const directorFirstname = document.getElementById('updateDirectorFirstname').value;
    const directorLastname = document.getElementById('updateDirectorLastname').value;

    const movie = {
        isbn: isbn,
        title: title,
        director: {
            firstname: directorFirstname,
            lastname: directorLastname
        }
    };

    fetch(`/movies/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movie)
    })
    .then(response => response.json())
    .then(() => {
        fetchMovies();
        cancelUpdate();
    });
}

function cancelUpdate() {
    document.getElementById('updateForm').style.display = 'none';
    document.getElementById('movieForm').style.display = 'block';
    clearUpdateInputs();
}

function clearInputs() {
    document.getElementById('isbn').value = '';
    document.getElementById('title').value = '';
    document.getElementById('directorFirstname').value = '';
    document.getElementById('directorLastname').value = '';
}

function clearUpdateInputs() {
    document.getElementById('updateId').value = '';
    document.getElementById('updateIsbn').value = '';
    document.getElementById('updateTitle').value = '';
    document.getElementById('updateDirectorFirstname').value = '';
    document.getElementById('updateDirectorLastname').value = '';
}

