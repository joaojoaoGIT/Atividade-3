const moviesContainer = document.getElementById("moviesContainer");
const searchInput = document.getElementById("searchInput");

let movies = [];
const placeholderImg = "https://via.placeholder.com/400x600?text=Sem+Imagem";

// CARREGAR JSON (arquivo filmes.json)
async function loadMovies() {
  try {
    const response = await fetch("filmes.json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    movies = await response.json();
  } catch (err) {
    console.error("Erro ao carregar filmes:", err);
    movies = [];
  }

  displayMovies(movies);
}

// Escapa texto para inserir com segurança no HTML
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// MOSTRAR FILMES
function displayMovies(movieList) {
  moviesContainer.innerHTML = "";

  if (!movieList || movieList.length === 0) {
    const p = document.createElement("p");
    p.className = "no-results";
    p.textContent = "Nenhum filme encontrado.";
    moviesContainer.appendChild(p);
    return;
  }

  movieList.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    const imgSrc = movie.image || placeholderImg;

    const tagsHtml = (movie.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
    const imdbRuntime = movie.imdb && movie.imdb.runtime ? movie.imdb.runtime : '';
    const imdbVotes = movie.imdb && movie.imdb.votes ? movie.imdb.votes : '';
    const imdbUrl = movie.imdb && movie.imdb.url ? movie.imdb.url : '';

    card.innerHTML = `
      <img src="${imgSrc}" alt="${escapeHtml(movie.title)}" loading="lazy" onerror="this.onerror=null;this.src='${placeholderImg}';">

      <div class="movie-content">

        <h2 class="movie-title">${escapeHtml(movie.title)}</h2>

        <div class="movie-meta">
          <div class="movie-info">
            <span>${escapeHtml(movie.genre)}</span>
          </div>
          <div class="movie-rating">⭐ ${escapeHtml(movie.rating)}</div>
        </div>

        ${tagsHtml ? `<div class="movie-tags">${tagsHtml}</div>` : ''}

        <div class="movie-imdb">
          ${imdbRuntime ? `<span>⏱ ${escapeHtml(imdbRuntime)}</span>` : ''}
          ${imdbVotes ? `<span>👥 ${escapeHtml(imdbVotes)}</span>` : ''}
          ${imdbUrl ? `<a href="${imdbUrl}" target="_blank" rel="noopener noreferrer">IMDb</a>` : ''}
        </div>

        <p class="movie-synopsis">
          ${escapeHtml(movie.synopsis)}
        </p>

        ${movie.notes ? `<p class="movie-note">Nota: ${escapeHtml(movie.notes)}</p>` : ''}

      </div>
    `;

    moviesContainer.appendChild(card);
  });
}

// BUSCA com debounce e pesquisa em título, gênero e sinopse
let searchTimeout;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      displayMovies(movies);
      return;
    }

    const filtered = movies.filter((movie) => {
      const hay = `${movie.title} ${movie.genre} ${movie.synopsis} ${movie.rating} ${(movie.tags||[]).join(' ')} ${movie.notes || ''} ${movie.imdb && movie.imdb.runtime ? movie.imdb.runtime : ''} ${movie.imdb && movie.imdb.votes ? movie.imdb.votes : ''}`.toLowerCase();
      return hay.includes(q);
    });

    displayMovies(filtered);
  }, 200);
});

// INICIAR
loadMovies();