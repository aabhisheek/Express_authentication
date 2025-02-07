const express = require('express');
const moviesController = require('./../Controllers/moviesController');
const authController=require('./../Controllers/authController');
const router = express.Router();

//router.param('id', moviesController.checkId)

router.route('/highest-rated').get(moviesController.getHighestRated, moviesController.getAllMovies)

router.route('/movie-stats').get(moviesController.getMovieStats);

router.route('/movies-by-genre/:genre').get(moviesController.getMovieByGenre);

router.route('/')
    .get(authController.protect,moviesController.getAllMovies)   //protecting the get response 
    // .get(moviesController.getAllMovies)
    .post(moviesController.createMovie)


router.route('/:id')
    // .get((authController.protect),(moviesController.getMovie))
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie)
//  .delete(authController.protect,authController.restrict('admin','test1'),moviesController.deleteMovie)
     
module.exports = router;