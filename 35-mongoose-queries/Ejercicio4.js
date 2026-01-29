const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({}, { strict: false });
const commentSchema = new mongoose.Schema({}, { strict: false });

const Movie = mongoose.model('Movie', movieSchema, 'movies');
const Comment = mongoose.model('Comment', commentSchema, 'comments');

async function getMovieWithComments(movieTitle) {
  try {
    const result = await Movie.aggregate([
      { $match: { title: movieTitle } },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'movie_id',
          as: 'comments'
        }
      },
      {
        $project: {
          title: 1,
          genres: 1,
          year: 1,
          rated: 1,
          type: 1,
          comments: 1
        }
      }
    ]).exec();
    
    return result[0];
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getAllMoviesWithCommentCount() {
  try {
    const result = await Movie.aggregate([
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'movie_id',
          as: 'comments'
        }
      },
      {
        $project: {
          title: 1,
          genres: 1,
          year: 1,
          rated: 1,
          type: 1,
          commentCount: { $size: '$comments' }
        }
      },
      { $sort: { commentCount: -1 } }
    ]).exec();
    
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = { getMovieWithComments, getAllMoviesWithCommentCount };
