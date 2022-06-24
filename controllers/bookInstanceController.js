var async = require('async');
var BookInstance = require('../models/bookInstance');
var Book = require('../models/book');
var { body, validationResult } = require('express-validator');

exports.bookInstance_list = function (req, res, next) {
  BookInstance.find({})
    .populate('book')
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      res.render('bookInstance_list', {
        title: 'Book Instance List',
        bookInstances_list: results,
      });
    });
};

// Display detail page for a specific BookInstance.
exports.bookInstance_detail = function (req, res, next) {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) {
        return next(err);
      }
      if (bookinstance == null) {
        // No results.
        var err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('bookInstance_detail', {
        title: 'Copy: ' + bookinstance.book.title,
        bookinstance: bookinstance,
      });
    });
};

exports.bookInstance_create_get = function (req, res, next) {
  Book.find({}, 'title')
    .sort({ title: 1 })
    .exec(function (err, result) {
      if (err) {
        return next(err);
      }
      res.render('bookInstance_form', {
        title: 'Create Book Instance',
        book_list: result,
      });
    });
};

exports.bookInstance_create_post = [
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status').escape(),
  body('due_back', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    var bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      Book.find({}, 'title')
        .sort({ title: 1 })
        .exec(function (err, results) {
          if (err) {
            return next(err);
          }
          res.render('bookInstance_form', {
            title: 'Create Book Instance',
            book_list: results,
            selected_book: bookInstance.book._id,
            status: bookInstance.status,
            errors: errors.array(),
            bookInstance: bookInstance,
          });
        });
      return;
    }

    bookInstance.save(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect(bookInstance.url);
    });
  },
];

exports.bookInstance_delete_get = function (req, res, next) {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, result) {
      if (err) {
        return next(err);
      }
      res.render('bookInstance_delete', {
        title: 'Delete Book Instance',
        bookInstance: result,
      });
    });
};

exports.bookInstance_delete_post = function (req, res, next) {
  BookInstance.findByIdAndRemove(req.body.bookInstanceId, function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/catalog/bookInstances');
  });
};

exports.bookInstance_update_get = function (req, res, next) {
  async.parallel(
    {
      books: function (callback) {
        Book.find({}).sort({ title: 1 }).exec(callback);
      },
      bookInstance: function (callback) {
        BookInstance.findById(req.params.id).populate('book').exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render('bookInstance_form', {
        title: 'Update Book Instance',
        book_list: results.books,
        bookInstance: results.bookInstance,
        selected_book: results.bookInstance.book._id,
        status: results.bookInstance.status,
      });
    }
  );
};

exports.bookInstance_update_post = [
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status').escape(),
  body('due_back', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    var bookInstance = new BookInstance({
      _id: req.params.id,
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      Book.find({})
        .sort({ title: 1 })
        .exec(function (err, result) {
          if (err) {
            return next(err);
          }
          res.render('bookInstance_form', {
            title: 'Update Book Instance',
            book_list: result,
            bookInstance: bookInstance,
            selected_book: bookInstance.book._id,
            status: bookInstance.status,
          });
        });
      return;
    }
    BookInstance.findByIdAndUpdate(
      req.params.id,
      bookInstance,
      {},
      function (err, updatedBookInstance) {
        if (err) {
          return next(err);
        }
        res.redirect(updatedBookInstance.url);
      }
    );
  },
];
