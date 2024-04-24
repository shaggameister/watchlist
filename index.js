let watchlistArray = JSON.parse(localStorage.getItem("watchlistArray")) || [];

const searchText = document.getElementById("search-text");
const movieContainer = document.getElementById("movie-container");
const error = `<div class="error-text">
                  <p>Unable to find what you're looking for ?</p>
                  <p>Please try again.</p>
                </div>`;

async function getMovies() {
  // checks to see if the search field doesn't have value
  if (!searchText.value) {
    // clears movie container
    movieContainer.innerHTML = "";
    // enters error message into movie container
    movieContainer.innerHTML = error;
    // clears search field
    searchText.value = "";
    // checks to see if the search field has value
  } else if (searchText.value) {
    // retrieves movie list from IMDB API based on search criteria
    const res = await fetch(
      `https://www.omdbapi.com/?i=tt3896198&apikey=3030792e&s=${searchText.value}`
    );
    const data = await res.json();
    // checks to see if a movie list was not retrieved
    if (data.Response === "False") {
      // clears movie container
      movieContainer.innerHTML = "";
      // displays error massage if a movie list could not be retrieved
      movieContainer.innerHTML = error;
      // clears search field
      searchText.value = "";
      // checks to see if a movie list was retrieved
    } else if (data.Response === "True") {
      // runs renderMovies function
      renderMovies(data.Search);
    }
  }
}

async function renderMovies(movies) {
  // clears movie container
  movieContainer.innerHTML = "";
  // iterates through movie list using the for loop
  for (let i = 0; i < movies.length; i++) {
    // gets individual objects from iterated movie list
    const res = await fetch(
      `https://www.omdbapi.com/?i=${movies[i].imdbID}&apikey=3030792e`
    );
    const data = await res.json();
    // inserts movie list object data into HTML and enters it into the movie-container in the index.html
    document.getElementById("body").style.height = "100%";
    movieContainer.innerHTML += `
        <div class="container" data-imdbID="${data.imdbID}">
          <img src="${
            data.Poster !== "N/A" ? data.Poster : "/images/missing.png"
          }" class="poster">
          <div class="info">
            <div class="top-info">
              <h2 class="title">${data.Title}</h2>
              <div class="stars">
                <img src="/images/star.png">
                <p>${data.imdbRating}</p>
              </div>
            </div>
            <div class="sub-info">
              <p class="runtime"> ${data.Runtime} </p>
              <p> ${data.Genre} </p>
              <div id="button" class="add-btn" data-add="${data.imdbID}">
                <img src="/images/plus.png">
                <p>Watchlist</p>
              </div>
              <span class="added-text">Added</span>
            </div>
            <p>${data.Plot}</p>
          </div>
        </div>
        `;
    // checks if movie is already entered in the watchlistArray
    const isAlreadyAdded = watchlistArray.some(
      (movie) => movie.imdbID === data.imdbID
    );
    toggleButtonState(data.imdbID, isAlreadyAdded);
  }

  // clears search field
  searchText.value = "";
}

// if already added marks it as added
function toggleButtonState(imdbID, added) {
  const movieContainer = document.querySelector(`[data-imdbID="${imdbID}"]`);
  const addButton = movieContainer.querySelector(".add-btn");
  const addedText = movieContainer.querySelector(".added-text");

  // hides/displays + watchlist and added based on state
  if (added) {
    addButton.style.display = "none";
    addedText.style.display = "inline";
  } else {
    addButton.style.display = "flex";
    addedText.style.display = "none";
  }
}

// enters clicked on movies to be entered into watchlistArray and marks as added
async function handleAddClick(dataImdbID) {
  const res = await fetch(
    `https://www.omdbapi.com/?i=${dataImdbID}&apikey=3030792e`
  );
  const data = await res.json();

  const isAlreadyAdded = watchlistArray.some(
    (movie) => movie.imdbID === data.imdbID
  );

  if (!isAlreadyAdded) {
    watchlistArray.push(data);
    let string = JSON.stringify(watchlistArray);
    localStorage.setItem("watchlistArray", string);
    toggleButtonState(data.imdbID, true);
  }
}

searchText.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getMovies();
  }
});

// listens for clicks on targets

// document.addEventListener("click", function (e) {
//   if (e.target.id === "search-btn") {
//     getMovies(e);
//   } else if (e.target.dataset.add) {
//     console.log("clicked");
//     handleAddClick(e.target.dataset.add);
//   }
// });

document.addEventListener("click", function (e) {
  const addTarget = e.target?.closest("[data-add]");
  if (e.target.id === "search-btn") {
    getMovies(e);
  } else if (addTarget) {
    console.log("clicked");
    handleAddClick(addTarget.dataset.add);
  }
});
