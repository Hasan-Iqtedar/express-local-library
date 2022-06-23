var Author = require('../models/author');
var { body, validationResult } = require('express-validator');
var async = require('async');
var Book = require('../models/book');

exports.author_list = function (req, res, next) {
  Author.find({})
    .sort({ family_name: 1 })
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      res.render('author_list', { title: 'Author List', author_list: results });
    });
};

exports.author_detail = function (req, res, next) {
  async.parallel(
    {
      author: function (callback) {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books: function (callback) {
        Book.find({ author: req.params.id }, 'title summary').exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      } // Error in API usage.
      if (results.author == null) {
        // No results.
        var err = new Error('Author not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('author_detail', {
        title: 'Author Detail',
        author: results.author,
        author_books: results.authors_books,
      });
    }
  );
};

exports.author_create_get = function (req, res, next) {
  res.render('author_form', { title: 'Create Author' });
};

exports.author_create_post = [
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name must be specified')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters'),
  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Family name must be specified')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters'),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body('date_of_death', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  (req, res, next) => {
    var errors = validationResult(req);

    var author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      res.render('author_form', {
        title: 'Create Author',
        author: author,
        errors: errors.array(),
      });
      return;
    }

    author.save(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect(author.url);
    });
  },
];

exports.author_delete_get = function (req, res, next) {
  async.parallel(
    {
      author: function (callback) {
        Author.findById(req.params.id).exec(callback);
      },
      author_books: function (callback) {
        Book.find({ author: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        res.redirect('/catalog/authors');
      }
      res.render('author_delete', {
        title: 'Delete Author',
        author: results.author,
        author_books: results.author_books,
      });
    }
  );
};

exports.author_delete_post = function (req, res, next) {
  async.parallel(
    {
      author: function (callback) {
        Author.findById(req.body.authorId).exec(callback);
      },
      author_books: function (callback) {
        Book.find({ author: req.body.authorId }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.author_books.length > 0) {
        res.render('author_delete', {
          title: 'Delete Author',
          author: results.author,
          author_books: results.author_books,
        });
        return;
      } else {
        Author.findByIdAndRemove(req.body.authorId, function (err) {
          if (err) {
            return next(err);
          }
          res.redirect('/catalog/authors');
        });
      }
    }
  );
};

exports.author_update_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Author Update Get');
};

exports.author_update_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Author Update Post');
};
