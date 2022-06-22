var Author = require('../models/author');
var { body, validationResult } = require('express-validator');
var Book = require('../models/book');
var BookInstance = require('../models/bookInstance');
var Genre = require('../models/genre');

var async = require('async');

exports.index = function (req, res, next) {
  async.parallel(
    {
      book_count: function (callback) {
        Book.countDocuments({}, callback);
      },
      book_instance_count: function (callback) {
        BookInstance.find({}, callback).count();
      },
      book_instance_available_count: function (callback) {
        BookInstance.find()
          .where('status')
          .equals('Available')
          .count()
          .exec(callback);
      },
      author_count: function (callback) {
        Author.countDocuments({}, callback);
      },
      genre_count: function (callback) {
        Genre.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render('index', {
        title: 'Local Library Home',
        error: err,
        data: results,
      });
    }
  );
};

exports.book_list = function (req, res, next) {
  Book.find({}, 'title author')
    .sort({ title: 1 })
    .populate('author')
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      res.render('book_list', { title: 'Books List', book_list: results });
    });
};

exports.book_detail = function (req, res, next) {
  async.parallel(
    {
      book: function (callback) {
        Book.findById(req.params.id)
          .populate('author')
          .populate('genre')
          .exec(callback);
      },
      book_instance: function (callback) {
        BookInstance.find({ book: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        // No results.
        var err = new Error('Book not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('book_detail', {
        title: results.book.title,
        book: results.book,
        book_instances: results.book_instance,
      });
    }
  );
};

exports.book_create_get = function (req, res, next) {
  async.parallel(
    {
      authors: function (callback) {
        Author.find({}).sort({ first_name: 1 }).exec(callback);
      },
      genres: function (callback) {
        Genre.find({}).sort({ name: 1 }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render('book_form', {
        title: 'Create Book',
        authors: results.authors,
        genres: results.genres,
      });
    }
  );
};

exports.book_create_post = [
  (req, res, next) => {
    if (!req.body.genre instanceof Array) {
      if (typeof req.body.genre === undefined) {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }

    next();
  },

  body('title', 'Please provide book title')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('author', 'Please provide book Author')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Please provide book summary')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('isbn', 'Please provide book ISBN').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          authors: function (callback) {
            Author.find({}).sort({ first_name: 1 }).exec(callback);
          },
          genres: function (callback) {
            Genre.find({}).sort({ name: 1 }).exec(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]) > -1) {
              results.genres[i].checked = 'true';
            }
          }
          res.render('book_form', {
            title: 'Create Book',
            authors: results.authors,
            genres: results.genres,
          });
        }
      );
      return;
    } else {
      book.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect(book.url);
      });
    }
  },
];

exports.book_delete_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Book Delete Get');
};

exports.book_delete_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Book Delete Post');
};

exports.book_update_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Book Update Get');
};

exports.book_update_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Book Update Post');
};
