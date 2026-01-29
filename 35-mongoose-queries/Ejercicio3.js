const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({}, { strict: false });
const movieSchema = new mongoose.Schema({}, { strict: false });

const Comment = mongoose.model('Comment', commentSchema, 'comments');
const Movie = mongoose.model('Movie', movieSchema, 'movies');

async function getCommentWithMovie(commentId) {
  try {
    const comment = await Comment.findById(commentId)
      .populate({
        path: 'movie_id',
        select: 'title genres year rated type',
        model: 'Movie'
      })
      .exec();
    
    return comment;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getAllCommentsWithMovies() {
  try {
    const comments = await Comment.find()
      .populate({
        path: 'movie_id',
        select: 'title genres year rated type',
        model: 'Movie'
      })
      .exec();
    
    return comments;
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = { getCommentWithMovie, getAllCommentsWithMovies };
