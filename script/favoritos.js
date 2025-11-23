const API_KEY = 'dbeb46854159cf7bfc9abd0754707431'; // Colocar chave Api

// Carregar filmes favoritos
async function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');

    if (favorites.length === 0) {
        document.getElementById('emptyMessage').style.display = 'block';
        document.getElementById('favoritesList').innerHTML = '';
        return;
    }

    document.getElementById('emptyMessage').style.display = 'none';
    document.getElementById('favoritesList').innerHTML = '';

    for (const movieId of favorites) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`);
            const movie = await response.json();

            const col = document.createElement('div');
            col.className = 'col-md-4';

            const posterPath = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750/cccccc/969696?text=Sem+Imagem';

            const releaseYear = movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : 'N/A';

            col.innerHTML = `
                        <div class="card movie-card">
                            <div class="position-relative">
                                <img src="${posterPath}" class="card-img-top movie-poster" alt="${movie.title}">
                                <div class="remove-btn" onclick="removeFavorite(${movie.id})">
                                    <i class="bi bi-x-lg text-danger"></i>
                                </div>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${movie.title}</h5>
                                <p class="card-text">
                                    <span class="badge bg-primary">${releaseYear}</span>
                                    <span class="badge bg-warning text-dark">
                                        <i class="bi bi-star-fill"></i> ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                                                                                
                                    </span>
                                </p>
                                <button class="btn btn-outline-primary btn-sm" onclick="viewDetails(${movie.id})">Ver Detalhes</button>
                            </div>
                        </div>
                    `;

            document.getElementById('favoritesList').appendChild(col);
        } catch (error) {
            console.error(`Erro ao carregar filme ${movieId}:`, error);
        }
    }
}

// Remover dos favoritos
function removeFavorite(movieId) {
    const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    const index = favorites.indexOf(movieId);

    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
        alert('Filme removido dos favoritos!');
        loadFavorites(); // Recarrega a lista
    }
}

// Ver detalhes do filme
function viewDetails(movieId) {
    localStorage.setItem('selectedMovie', movieId);
    window.location.href = 'detalhes.html';
}

// Carregar os favoritos quando a página for aberta
document.addEventListener('DOMContentLoaded', loadFavorites);

function getCurrentYear() {
    return new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("ano").textContent = getCurrentYear();
});