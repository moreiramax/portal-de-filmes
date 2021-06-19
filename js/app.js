const log = console.log;

const searchButton = document.querySelector('#search');
const searchInput = document.querySelector('#exampleInputEmail1');
const moviesContainer = document.querySelector('#movies-container');
const moviesSearchable = document.querySelector('#movies-searchable');

function createImageContainer(imageUrl, id, title, overview, vote_average) {
    const tempDiv = document.createElement('div');
    tempDiv.setAttribute('class', 'imageContainer');
    tempDiv.setAttribute('data-id', id);

    const movieElement = `
    <div class="card movie_card">
    <a href="https://www.themoviedb.org/movie/${id}" target="_blank"><img src="${imageUrl}" class="card-img-top" alt="" data-movie-id="${id}"></a>
    <div class="card-body movie_card_body" style="background-color: black; border-radius: 5px">
      <p class="card-title" style="color: white">${title}</p>
      <span class="movie_info float-right" style="color:white"><i class="fas fa-star"></i> ${vote_average} / 10</span>
      <p style="color:white">${overview}</p>    
    </div>
  </div>
    `;
    tempDiv.innerHTML = movieElement;

    return tempDiv;
}

function resetInput() {
    searchInput.value = '';
}

function handleGeneralError(error) {
    log('Error: ', error.message);
    alert(error.message || 'Internal Server');
}

function createIframe(video) {
    const videoKey = (video && video.key) || 'No key found!!!';
    const iframe = document.createElement('iframe');
    iframe.src = `http://www.youtube.com/embed/${videoKey}`;
    iframe.width = 360;
    iframe.height = 315;
    iframe.allowFullscreen = true;
    return iframe;
}

function insertIframeIntoContent(video, content) {
    const videoContent = document.createElement('div');
    const iframe = createIframe(video);

    videoContent.appendChild(iframe);
    content.appendChild(videoContent);
}


function createVideoTemplate(data) {
    const content = this.content;
    content.innerHTML = '<p id="content-close">X</p>';

    const videos = data.results || [];

    if (videos.length === 0) {
        content.innerHTML = `
            <p id="content-close">X</p>
            <p>No Trailer found for this video id of ${data.id}</p>
        `;
        return;
    }

    for (let i = 0; i < 4; i++) {
        const video = videos[i];
        insertIframeIntoContent(video, content);
    }
}

function createSectionHeader(title) {
    const header = document.createElement('h2');
    header.innerHTML = title;

    return header;
}

function renderMovies(data) {
    const moviesBlock = generateMoviesBlock(data);
    const header = createSectionHeader(this.title);
    moviesBlock.insertBefore(header, moviesBlock.firstChild);
    moviesContainer.appendChild(moviesBlock);
}

function renderSearchMovies(data) {
    moviesSearchable.innerHTML = '<h2>Resultados da Pesquisa</h2>';
    const moviesBlock = generateMoviesBlock(data);
    moviesSearchable.appendChild(moviesBlock);
}

function generateMoviesBlock(data) {
    const movies = data.results;
    const section = document.createElement('section');
    section.setAttribute('class', 'section');

    for (let i = 0; i < movies.length; i++) {
        const { poster_path, title, overview, vote_average, id } = movies[i];

        if (poster_path) {
            const imageUrl = MOVIE_DB_IMAGE_ENDPOINT + poster_path;

            const imageContainer = createImageContainer(imageUrl, id, title, overview, vote_average);
            section.appendChild(imageContainer);
        }
    }
    const movieSectionAndContent = createMovieContainer(section);
    return movieSectionAndContent;
}

function createMovieContainer(section) {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie');

    const template = `
        <div class="content">
            <p id="content-close">X</p>
        </div>
    `;

    movieElement.innerHTML = template;
    movieElement.insertBefore(section, movieElement.firstChild);
    return movieElement;
}

searchButton.onclick = function (event) {
    event.preventDefault();
    const value = searchInput.value

    if (value) {
        searchMovie(value);
    }
    resetInput();
}

document.onclick = function (event) {
    log('Event: ', event);
    const { tagName, id } = event.target;
    if (tagName.toLowerCase() === 'img') {
        const movieId = event.target.dataset.movieId;
        const section = event.target.parentElement.parentElement;
        const content = section.nextElementSibling;
        content.classList.add('content-display');
        getVideosByMovieId(movieId, content);
    }

    if (id === 'content-close') {
        const content = event.target.parentElement;
        content.classList.remove('content-display');
    }
}

searchUpcomingMovies();
getTopRatedMovies();
searchPopularMovie();
getTrendingMovies();
