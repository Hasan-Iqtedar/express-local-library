var async = require('async');
var { body, validationResult } = require('express-validator');
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
  res.render('genre_form', { title: 'Create Genre' });
};

exports.genre_create_post = [
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    var genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render('genre_form', {
        title: 'Create Genre',
        genre: genre,
        errors: errors.array(),
      });
      return;
    }

    //Checking if genre already exists.
    Genre.findOne({ name: genre.name }).exec(function (err, result) {
      if (err) {
        return next(err);
      }
      if (result) {
        res.redirect(result.url);
      } else {
        genre.save(function (err) {
          if (err) {
            return next(err);
          }
          res.redirect(genre.url);
        });
      }
    });
  },
];

exports.genre_delete_get = function (req, res, next) {
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books: function (callback) {
        Book.find({ genre: { $elemMatch: { $eq: req.params.id } } })
          .sort({ title: 1 })
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render('genre_delete', {
        title: 'Delete Genre',
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

exports.genre_delete_post = function (req, res, next) {
  Genre.findByIdAndRemove(req.body.genreId, function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/catalog/genres');
  });
};

exports.genre_update_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Genre Update Get');
};

exports.genre_update_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Genre Update Post');
};
