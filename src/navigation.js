let page = 1
let infiniteScroll;

searchFormBtn.addEventListener('click', () => {
  location.hash = '#search=' + searchFormInput.value;
});

trendingBtn.addEventListener('click', () => {
  location.hash = '#trends=';
});

arrowBtn.addEventListener('click', () => {
  history.back();
  // location.hash = '#home';
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false)

function navigator() {
  console.log(location.hash);

  if(infiniteScroll){
    window.removeEventListener('scroll', infiniteScroll, {passive: false})
    infiniteScroll = undefined
  }
  
  const hashes = {
    '#trends=': ()=> trendsPage(),
    '#search=': ()=> searchPage(),
    '#movie=': ()=> movieDetailsPage(),
    '#category=': ()=> categoriesPage()
  }

  for (const key in hashes) {
    if(location.hash.startsWith(key)){
        hashes[key]()
        return
    }
  }

  homePage()


  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  if(infiniteScroll){
    window.addEventListener('scroll', infiniteScroll, {passive: false})
  }
}

function homePage() {
  titlePage.classList.remove('inactive')
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.add('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.remove('inactive');
  iconHome.classList.remove('inactive')
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.remove('inactive');
  categoriesPreviewSection.classList.remove('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.add('inactive');
  
  getTrendingMoviesPreview();
  getCategegoriesPreview();
}

function categoriesPage() {
  console.log('categories!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  iconHome.classList.add('inactive')
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  titlePage.classList.add('inactive')

  // ['#category', 'id-name']
  const [_, categoryData] = location.hash.split('=');
  const [categoryId, categoryName] = categoryData.split('-');

  headerCategoryTitle.innerHTML = decodeURI(categoryName);
  
  getMoviesByCategory(categoryId);
}

function movieDetailsPage() {
  
  headerSection.classList.add('header-container--long');
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.add('header-arrow--white');
  headerTitle.classList.add('inactive');
  iconHome.classList.add('inactive')
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.remove('inactive');

  titlePage.classList.add('inactive')

  const [_, movieId] = location.hash.split('=');
  getMovieById(movieId);
}

function searchPage() {
  
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  iconHome.classList.add('inactive')
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  titlePage.classList.add('inactive')

  // ['#search', 'platzi']
  const [_, query] = location.hash.split('=');
  getMoviesBySearch(query);
}

function trendsPage() {
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  iconHome.classList.add('inactive')
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  titlePage.classList.add('inactive')

  headerCategoryTitle.innerHTML = 'Tendencias';

  getTrendingMovies();
  infiniteScroll = getPaginatedTrendingMovies
}


