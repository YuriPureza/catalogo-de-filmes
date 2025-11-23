        // Variáveis globais
        const API_KEY = 'cc4d99b241fd797ba458bdbc49684ee4'; // Colocar chave Api
        let currentPage = 1;
        let totalPages = 1;
        let allMovies = [];
        let filteredMovies = [];

        // Inicialização
        document.addEventListener('DOMContentLoaded', function() {
            loadGenres();
            loadMovies();
        });

        // Carregar gêneros
        async function loadGenres() {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pt-BR`);
                const data = await response.json();
                
                const genreSelect = document.getElementById('genreFilter');
                data.genres.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre.id;
                    option.textContent = genre.name;
                    genreSelect.appendChild(option);
                });
            } catch (error) {
                console.error('Erro ao carregar gêneros:', error);
            }
        }

        // Carregar filmes
        async function loadMovies() {
            document.getElementById('loading').style.display = 'block';
            document.getElementById('moviesList').innerHTML = '';
            
            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${currentPage}`);
                const data = await response.json();
                
                allMovies = data.results;
                filteredMovies = allMovies;
                totalPages = data.total_pages;
                
                displayMovies(filteredMovies);
                document.getElementById('loading').style.display = 'none';
            } catch (error) {
                console.error('Erro ao carregar filmes:', error);
                document.getElementById('loading').style.display = 'none';
                document.getElementById('moviesList').innerHTML = `
                    <div class="col-12 text-center">
                        <p>Erro ao carregar filmes. Tente novamente.</p>
                    </div>
                `;
            }
        }

        // Buscar filmes
        async function searchMovies() {
            const query = document.getElementById('searchInput').value;
            if (!query) {
                loadMovies();
                return;
            }
            
            document.getElementById('loading').style.display = 'block';
            document.getElementById('moviesList').innerHTML = '';
            
            try {
                const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&page=${currentPage}&query=${encodeURIComponent(query)}`);
                const data = await response.json();
                
                allMovies = data.results;
                filteredMovies = allMovies;
                totalPages = data.total_pages;
                
                displayMovies(filteredMovies);
                document.getElementById('loading').style.display = 'none';
            } catch (error) {
                console.error('Erro na busca:', error);
                document.getElementById('loading').style.display = 'none';
                document.getElementById('moviesList').innerHTML = `
                    <div class="col-12 text-center">
                        <p>Erro ao buscar filmes. Tente novamente.</p>
                    </div>
                `;
            }
        }

        // Filtrar filmes por gênero
        function filterMovies() {
            const genreId = document.getElementById('genreFilter').value;
            
            if (!genreId) {
                filteredMovies = allMovies;
            } else {
                filteredMovies = allMovies.filter(movie => 
                    movie.genre_ids.includes(parseInt(genreId))
                );
            }
            
            displayMovies(filteredMovies);
        }

        // Ordenar filmes
        function sortMovies() {
            const sortBy = document.getElementById('sortFilter').value;
            
            if (sortBy === 'popular') {
                filteredMovies.sort((a, b) => b.popularity - a.popularity);
            } else if (sortBy === 'rating') {
                filteredMovies.sort((a, b) => b.vote_average - a.vote_average);
            } else if (sortBy === 'new') {
                filteredMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            }
            
            displayMovies(filteredMovies);
        }

        // Exibir filmes
        function displayMovies(movies) {
            const moviesList = document.getElementById('moviesList');
            moviesList.innerHTML = '';
            
            if (movies.length === 0) {
                moviesList.innerHTML = `
                    <div class="col-12 text-center">
                        <p>Nenhum filme encontrado.</p>
                    </div>
                `;
                return;
            }
            
            movies.forEach(movie => {
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
                            <div class="favorite-btn" onclick="toggleFavorite(${movie.id})">
                                <i class="bi ${isFavorite(movie.id) ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
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
                
                moviesList.appendChild(col);
            });
        }

        // Mudar página
        function changePage(direction) {
            if (direction === 'prev' && currentPage > 1) {
                currentPage--;
            } else if (direction === 'next' && currentPage < totalPages) {
                currentPage++;
            } else {
                return;
            }
            
            if (document.getElementById('searchInput').value) {
                searchMovies();
            } else {
                loadMovies();
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
            displayMovies(filteredMovies); // Atualiza os corações
        }

        // Ver detalhes do filme
        function viewDetails(movieId) {
            // Salva o ID do filme para a página de detalhes
            localStorage.setItem('selectedMovie', movieId);
            // Abre a página de detalhes
            window.location.href = 'detalhes.html';
        }