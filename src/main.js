const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  params: {
    'api_key': API_KEY,
    "language": "es-ES"
  },
});

//Utils

//let lastMovieInterception
/* window.addEventListener('scroll', getPaginatedTrendingMovies) */
let observador = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if(entry.isIntersecting){
      const urlImag = entry.target.getAttribute('data-src')
      entry.target.setAttribute('src', urlImag)
      entry.target.classList.add('fadeIn')
    }
  })
});

//Infinity scroll con IntersectionObserver
/* let observadorMoreMovies = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if(entry.isIntersecting){
      page++
      getTrendingMovies()
    }
  })
}, {
  rootMargin: '0px 0px 200px 0px',
  threshold: 1.0
}) */



function skeletonLoadingMovies(){
  for (let index = 1; index < 7; index++) {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container')
    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img', 'skeleton')
    movieContainer.append(movieImg)
    trendingMoviesPreviewList.append(movieContainer)
  }
}

function createMovies(
  movies, 
  container, 
  {
    lazyLoad = false, 
    clean = true
  } = {},
  ){
  if(clean){
    container.innerHTML = '';
  }
  movies.forEach((movie)=>{
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container')
    movieContainer.addEventListener('click', () => {
      location.hash = '#movie=' + movie.id;
    });
    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img')
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute(
      lazyLoad ? 'data-src': 'src',
      'https://image.tmdb.org/t/p/w300' + movie.poster_path,
    );

    const p = document.createElement('p')
    movieImg.addEventListener('error', ()=>{
      movieImg.classList.add('inactive')
      p.innerText = movie.title
      p.style.cssText = 'text-align: center;;color: var(--purple-dark-1);font-size: 1.6rem;font-weight: 500;'
      movieContainer.style.cssText = 'aspect-ratio: 2/3;background: var(--yellow);border-radius: 4px;display: grid;place-items: center;'
      movieContainer.append(p)
    })

    if(lazyLoad){
      observador.observe(movieImg)
    }

    movieContainer.append(movieImg);
    container.appendChild(movieContainer);
  })
  /* if(lastMovieInterception){
    observadorMoreMovies.unobserve(lastMovieInterception)
  }
  
  const listMovies = document.querySelectorAll('.movie-img')
  lastMovieInterception = listMovies[listMovies.length-1]
  observadorMoreMovies.observe(lastMovieInterception) */

 
}

function createCategories(categories, container) {
  container.innerHTML = "";
  categories.forEach(category => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');
    
    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', 'id' + category.id);
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
  
}


// Llamados a la API

async function getTrendingMoviesPreview() {
  skeletonLoadingMovies()
  const { data } = await api('trending/movie/day');
  const movies = data.results;
  createMovies(movies, trendingMoviesPreviewList, {lazyLoad:true, clean:true})
}

async function getCategegoriesPreview() {
  const { data } = await api('genre/movie/list');
  const categories = data.genres;

  createCategories(categories, categoriesPreviewList)  ;
}

async function getMoviesByCategory(id) {
  const { data } = await api('discover/movie', {
    params: {
      with_genres: id,
      
    },
  });
  const movies = data.results;
  createMovies(movies, genericSection, {lazyLoad:true, clean:true});
}

async function getMoviesBySearch(query) {
  const { data } = await api('search/movie', {
    params: {
      query,
    },
  });
  const movies = data.results;

  createMovies(movies, genericSection, {lazyLoad:true, clean:false});
}

async function getTrendingMovies() {
  /* const skeleton = document.querySelector('.skeleton-generic')
  skeleton.style.display = 'none' */
  const { data } = await api('trending/movie/day', {
    params: {
      page
    }
  });
  const movies = data.results;

  createMovies(movies, genericSection, {lazyLoad:true, clean:true});
}

async function getPaginatedTrendingMovies(){
  const {scrollTop, clientHeight, scrollHeight} = document.documentElement

  const scrollIsBotton = (scrollTop + clientHeight) >= (scrollHeight - 20)
  if(scrollIsBotton){
    page++

    /* const skeleton = document.querySelector('.skeleton-generic')
    skeleton.style.display = 'none' */
    const { data } = await api('trending/movie/day', {
      params: {
        page
      }
    });
    const movies = data.results;
  
    createMovies(movies, genericSection, {lazyLoad:true, clean:false});
  }
}

async function getMovieById(id) {
  const { data: movie } = await api('movie/' + id);

  const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
  headerSection.style.background = `
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 19.27%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl})
  `;
  
  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average.toFixed(1);

  createCategories(movie.genres, movieDetailCategoriesList);

  getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer, {lazyLoad:true, clean:true});
}
