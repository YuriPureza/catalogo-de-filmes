const API_KEY = 'cc4d99b241fd797ba458bdbc49684ee4'; // Colocar chave Api

// Carregar detalhes do filme
async function loadMovieDetails() {
    const movieId = localStorage.getItem('selectedMovie');

    if (!movieId) {
        document.getElementById('movieDetails').innerHTML = `
                    <div class="col-12 text-center">
                        <p>Nenhum filme selecionado.</p>
                        <a href="index.html" class="btn btn-primary">Voltar para a lista</a>
                    </div>
                `;
        document.getElementById('loading').style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`);
        const movie = await response.json();

        document.getElementById('loading').style.display = 'none';

        const backdropPath = movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
            : 'https://via.placeholder.com/800x400/cccccc/969696?text=Sem+Imagem';

        const posterPath = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750/cccccc/969696?text=Sem+Imagem';

        const releaseDate = movie.release_date
            ? new Date(movie.release_date).toLocaleDateString('pt-BR')
            : 'Data não disponível';

        const runtime = movie.runtime
            ? `${movie.runtime} minutos`
            : 'Duração não disponível';

        const budget = movie.budget
            ? `$${movie.budget.toLocaleString('en-US')}`
            : 'Não disponível';

        const revenue = movie.revenue
            ? `$${movie.revenue.toLocaleString('en-US')}`
            : 'Não disponível';

        const genres = movie.genres
            ? movie.genres.map(genre => genre.name).join(', ')
            : 'Gêneros não disponíveis';

        document.getElementById('movieDetails').innerHTML = `
                    <div class="col-md-4">
                        <img src="${posterPath}" class="movie-poster" alt="${movie.title}">
                        <div class="d-grid gap-2 mt-3">
                            <button class="btn btn-${isFavorite(movie.id) ? 'danger' : 'outline-primary'}" onclick="toggleFavorite(${movie.id})">
                                <i class="bi ${isFavorite(movie.id) ? 'bi-heart-fill' : 'bi-heart'}"></i>
                                ${isFavorite(movie.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                            </button>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <h2>${movie.title}</h2>
                        <p class="text-muted">${movie.tagline || ''}</p>
                        
                        <img src="${backdropPath}" class="movie-backdrop mb-4" alt="${movie.title}">
                        
                        <h4>Sinopse</h4>
                        <p>${movie.overview || 'Sinopse não disponível.'}</p>
                        
                        <div class="row mt-4">
                            <div class="col-md-6">
                                <p><strong>Data de Lançamento:</strong> ${releaseDate}</p>
                                <p><strong>Duração:</strong> ${runtime}</p>
                                <p><strong>Gêneros:</strong> ${genres}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Avaliação:</strong> ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10</p>
                                <p><strong>Orçamento:</strong> ${budget}</p>
                                <p><strong>Receita:</strong> ${revenue}</p>
                            </div>
                        </div>
                    </div>
                `;
    } catch (error) {
        console.error('Erro ao carregar detalhes do filme:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('movieDetails').innerHTML = `
                    <div class="col-12 text-center">
                        <p>Erro ao carregar detalhes do filme. Tente novamente.</p>
                        <a href="index.html" class="btn btn-primary">Voltar para a lista</a>
                    </div>
                `;
    }
}

// Verificar se filme é favorito
function isFavorite(movieId) {
    const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    return favorites.includes(movieId);
}

// Alternar favorito
function toggleFavorite(movieId) {
    const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    const index = favorites.indexOf(movieId);

    if (index === -1) {
        favorites.push(movieId);
        alert('Filme adicionado aos favoritos!');
    } else {
        favorites.splice(index, 1);
        alert('Filme removido dos favoritos!');
    }

    localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
    loadMovieDetails(); // Recarrega a página para atualizar o botão
}

// Carregar os detalhes quando a página for aberta
document.addEventListener('DOMContentLoaded', loadMovieDetails);

function getCurrentYear() {
    return new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("ano").textContent = getCurrentYear();
});