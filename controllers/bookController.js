var Book = require('../models/book');

exports.index = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Site Home Page');
};

exports.book_list = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: book List');
};

exports.book_detail = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Book Detail ' + req.params.id);
};

exports.book_create_get = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Book Create Get');
};

exports.book_create_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED YET: Book Create Post');
};

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
