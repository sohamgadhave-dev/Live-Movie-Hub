// Mock movie data for simulating SSE events
const movieTitles = [
  'Galactic Odyssey',
  'The Last Algorithm',
  'Neon Shadows',
  'Quantum Drift',
  'Echoes of Tomorrow',
  'The Silent Protocol',
  'Crimson Horizon',
  'Midnight Circuit',
  'Stellar Collapse',
  'The Phantom Index',
  'Zero Gravity',
  'Binary Sunset',
  'The Turing Paradox',
  'Neural Storm',
  'Darkwave Rising',
  'The Hologram Heist',
  'Infinite Loop',
  'Cybernetic Dawn',
  'The Matrix Reborn',
  'Parallel Worlds',
];

const eventTypes = [
  'NEW_MOVIE',
  'TRENDING',
  'RATING_UPDATE',
  'NEW_REVIEW',
  'WATCHLIST_ADDED',
];

const genres = [
  'Action',
  'Sci-Fi',
  'Thriller',
  'Drama',
  'Comedy',
  'Horror',
  'Animation',
  'Documentary',
];

const generateRandomEvent = () => {
  const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const title = movieTitles[Math.floor(Math.random() * movieTitles.length)];
  const genre = genres[Math.floor(Math.random() * genres.length)];
  const rating = (Math.random() * 4 + 6).toFixed(1); // 6.0 - 10.0
  const time = new Date().toISOString();

  const eventData = { type, title, genre, time };

  switch (type) {
    case 'NEW_MOVIE':
      eventData.message = `🎬 New movie added: "${title}" in ${genre}`;
      break;
    case 'TRENDING':
      eventData.message = `🔥 "${title}" is now trending in ${genre}`;
      break;
    case 'RATING_UPDATE':
      eventData.message = `⭐ "${title}" rated ${rating}/10`;
      eventData.rating = rating;
      break;
    case 'NEW_REVIEW':
      eventData.message = `📝 New review posted for "${title}"`;
      break;
    case 'WATCHLIST_ADDED':
      eventData.message = `📋 "${title}" added to popular watchlists`;
      break;
    default:
      eventData.message = `📢 Update for "${title}"`;
  }

  return eventData;
};

module.exports = { generateRandomEvent };
