var async = require('async');
var Book = require('../models/book');
var Genre = require('../models/genre');

exports.genre_list = function (req, res, next) {
  Genre.find({})
    .sort({ name: 1 })
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      res.render('genre_list', { title: 'Genre List', genre_list: results });
    });
};

exports.genre_detail = function (req, res, next) {
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books: function (callback) {
        Book.find({ genre: req.params.id }).sort({ title: 1 }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render('genre_detail', {
        title: 'Genre Details',
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

exports.genre_create_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Genre Create Get');
};

exports.genre_create_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Genre Create Post');
};

exports.genre_delete_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Genre Delete Get');
};

exports.genre_delete_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Genre Delete Post');
};

exports.genre_update_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Genre Update Get');
};

exports.genre_update_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Genre Update Post');
};
