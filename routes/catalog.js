var express = require('express');
var router = express.Router();

var bookController = require('../controllers/bookController');
var authorController = require('../controllers/authorController');
var bookInstanceController = require('../controllers/bookInstanceController');
var genreController = require('../controllers/genreController');

/**  Book Routes */
router.get('/', bookController.index);
router.get('/book/create', bookController.book_create_get);
router.post('/book/create', bookController.book_create_post);

router.get('/book/:id/delete', bookController.book_delete_get);
router.post('/book/:id/delete', bookController.book_delete_post);

router.get('/book/:id/update', bookController.book_update_get);
router.post('/book/:id/update', bookController.book_update_post);

router.get('/book/:id', bookController.book_detail);
router.get('/books', bookController.book_list);

/**  Author Routes */
router.get('/author/create', authorController.author_create_get);
router.post('/author/create', authorController.author_create_post);

router.get('/author/:id/delete', authorController.author_delete_get);
router.post('/author/:id/delete', authorController.author_delete_post);

router.get('/author/:id/update', authorController.author_update_get);
router.post('/author/:id/update', authorController.author_update_post);

router.get('/author/:id', authorController.author_detail);
router.get('/authors', authorController.author_list);

/**  BookInstance Routes */
router.get(
  '/bookInstance/create',
  bookInstanceController.bookInstance_create_get
);
router.post(
  '/bookInstance/create',
  bookInstanceController.bookInstance_create_post
);

router.get(
  '/bookInstance/:id/delete',
  bookInstanceController.bookInstance_delete_get
);
router.post(
  '/bookInstance/:id/delete',
  bookInstanceController.bookInstance_delete_post
);

router.get(
  '/bookInstance/:id/update',
  bookInstanceController.bookInstance_update_get
);
router.post(
  '/bookInstance/:id/update',
  bookInstanceController.bookInstance_update_post
);

router.get('/bookInstance/:id', bookInstanceController.bookInstance_detail);
router.get('/bookInstances', bookInstanceController.bookInstance_list);

/**  Genre Routes */
router.get('/genre/create', genreController.genre_create_get);
router.post('/genre/create', genreController.genre_create_post);

router.get('/genre/:id/delete', genreController.genre_delete_get);
router.post('/genre/:id/delete', genreController.genre_delete_post);

router.get('/genre/:id/update', genreController.genre_update_get);
router.post('/genre/:id/update', genreController.genre_update_post);

router.get('/genre/:id', genreController.genre_detail);
router.get('/genres', genreController.genre_list);

module.exports = router;
