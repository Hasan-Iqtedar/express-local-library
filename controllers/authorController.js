var Author = require('../models/author');
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
  res.send('NOT IMPLEMENTED YET: Author Create Get');
};

exports.author_create_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Author Create Post');
};

exports.author_delete_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Author Delete Get');
};

exports.author_delete_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Author Delete Post');
};

exports.author_update_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Author Update Get');
};

exports.author_update_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Author Update Post');
};
