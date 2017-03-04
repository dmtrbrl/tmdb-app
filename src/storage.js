let storage = {
  apiKey: 'a70dbfe19b800809dfdd3e89e8532c9e',
  sessionId: localStorage.getItem('session_id') || null,
  userId: localStorage.getItem('user_id') || null,
  pageTitlePostfix: ' — ' + document.title,
  listTypes: [
    {
      title: 'Popular Movies',
      shortTitle: 'Popular',
      query: 'popular',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Top Rated Movies',
      shortTitle: 'Top Rated',
      query: 'top_rated',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Upcoming Movies',
      shortTitle: 'Upcoming',
      query: 'upcoming',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Now Playing Movies',
      shortTitle: 'Now Playing',
      query: 'now_playing',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Search Results',
      query: 'search',
      isCategory: false
    },
    {
      title: 'Your Favorite Movies',
      query: 'favorite',
      isCategory: false
    }
  ],
  categories: {},
  // For Browser History
  backTitle: '',
  moviePath: '',
  createMoviePopup: false,
  moviePopupOnHistory: false
};

// Create categories titles
storage.listTypes.forEach(function(listType){
  storage.categories[listType.query] = listType.title;
});

export default storage;
