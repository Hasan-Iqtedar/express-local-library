var BookInstance = require('../models/bookInstance');

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
  res.send('NOT IMPLEMENTED YET: BookInstance Create Get');
};

exports.bookInstance_create_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: BookInstance Create Post');
};

exports.bookInstance_delete_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: BookInstance Delete Get');
};

exports.bookInstance_delete_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: BookInstance Delete Post');
};

exports.bookInstance_update_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: BookInstance Update Get');
};

exports.bookInstance_update_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: BookInstance Update Post');
};
