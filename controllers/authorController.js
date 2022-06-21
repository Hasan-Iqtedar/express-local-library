var Author = require('../models/author');

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
  res.send('NOT IMPLEMENTED YET: Author Detail ' + req.params.id);
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
