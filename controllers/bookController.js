var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookInstance');

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
      if (err) {
        console.log(err);
      }
      res.render('index', {
        title: 'Local Library Home',
        error: err,
        data: results,
      });
    }
  );
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
