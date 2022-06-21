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

exports.bookInstance_detail = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: BookInstance Detail ' + req.params.id);
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
