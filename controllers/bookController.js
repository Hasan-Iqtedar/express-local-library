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
    console.log(book.genre);
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
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = 'true';
            }
          }
          res.render('book_form', {
            title: 'Create Book',
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array(),
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
  async.parallel(
    {
      book: function (callback) {
        Book.findById(req.params.id).exec(callback);
      },
      bookInstances: function (callback) {
        BookInstance.find({ book: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        res.redirect('/catalog/books');
      }
      res.render('book_delete', {
        title: 'Delete Book',
        book: results.book,
        bookInstances: results.bookInstances,
      });
    }
  );
};

exports.book_delete_post = function (req, res, next) {
  // res.send('NOT IMPLEMENTED YET: Book Delete Post');

  Book.findByIdAndRemove(req.body.bookId, function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/catalog/books');
  });
};

exports.book_update_get = function (req, res, next) {
  async.parallel(
    {
      book: function (callback) {
        Book.findById(req.params.id)
          .populate('author')
          .populate('genre')
          .exec(callback);
      },
      authors: function (callback) {
        Author.find({}).sort({ title: 1 }).exec(callback);
      },
      genres: function (callback) {
        Genre.find({}).sort({ name: 1 }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        var error = new Error('Book not found');
        error.status = 404;
        return next(error);
      }
      for (var i = 0; i < results.genres.length; i++) {
        for (var j = 0; j < results.book.genre.length; j++) {
          if (
            results.genres[i]._id.toString() ===
            results.book.genre[j]._id.toString()
          ) {
            results.genres[i].checked = 'true';
          }
        }
      }
      res.render('book_form', {
        title: 'Update Book',
        authors: results.authors,
        genres: results.genres,
        book: results.book,
      });
    }
  );
};

exports.book_update_post = [
  (req, res, next) => {
    if (!req.body.genre instanceof Array) {
      if (req.body.genre === undefined) {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  body('title', 'Title must be provided').trim().isLength({ min: 1 }).escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === 'undefined' ? [] : req.body.genre,
      _id: req.params.id, //So that new id is not generated.
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          authors: function (callback) {
            Author.find({}).sort({ title: 1 }).exec(callback);
          },
          genres: function (callback) {
            Genre.find({}).exec(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = 'true';
            }
          }
          res.render('book_form', {
            title: 'Update Book',
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      Book.findByIdAndUpdate(
        req.params.id,
        book,
        {},
        function (err, updateBook) {
          if (err) {
            return next(err);
          }
          res.redirect(updateBook.url);
        }
      );
    }
  },
];
