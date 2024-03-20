const watchlist = document.getElementById("watchlist");
let watchlistArray = JSON.parse(localStorage.getItem("watchlistArray")) || [];

function renderWatchlist() {
  // if there are no movies in the watchlistArray displays message and link to take you back to the search page
  if (watchlistArray.length === 0) {
    watchlist.innerHTML = `
        <div class="empty">
          <h2>Your watchlist is looking empty</h2>
          <div class="link">
            <a href="index.html"><img src="/images/plus.png"></i></a>
            <p>Let's add some movies</p>
          </div>
        </div>`;

    // iterates through watchlistArray and enters data from objects into HTML
  } else {
    watchlistArray.forEach(function displayMovies(data) {
      watchlist.innerHTML += `
        <div class="container" data-imdbID="${data.imdbID}">
          <img src="${
            data.Poster !== "N/A" ? data.Poster : "/images/missing.png"
          }" class="poster">
          <div class="info">
            <div class="sub-info">
              <h2 class="title">${data.Title}</h2>
              <div class="stars">
                <img src="/images/star.png">
                <p>${data.imdbRating}</p>
              </div>
            </div>
            <div class="sub-info">
                <p>${data.Runtime} </p>
                <p>${data.Genre} </p>
                <div class="remove-btn" >
                    <img src="/images/minus.png" data-remove="${data.imdbID}">
                    <p>Remove</p>
                </div>
            </div>
            <p>${data.Plot}</p>
          </div>
        </div>
        `;
    });
  }
}

// Displays page in browser
renderWatchlist();

// listens for remove click and runs removeMovieFromWatchlist if clicked
document.addEventListener("click", function (e) {
  if (e.target.dataset.remove) {
    const imdbID = e.target.dataset.remove;
    removeMovieFromWatchlist(imdbID);
  }
});

// Removes movie from watchlistArray and reloads the page
function removeMovieFromWatchlist(imdbID) {
  watchlistArray = watchlistArray.filter((movie) => movie.imdbID !== imdbID);
  localStorage.setItem("watchlistArray", JSON.stringify(watchlistArray));
  location.reload(true);
}
