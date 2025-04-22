import { Router } from 'express';
import upload from '../utils/upload.mjs';
import {
  addNewBook_Ajax,
  deleteBook_Ajax,
  displayHomePage,
  displayPageDetailBook,
  displayPageEditBook,
  displayPageNewBook,
  editBook_Ajax,
  search,
} from '../controllers/booksController.mjs';

const router = Router();

router.get('/', displayHomePage);
router.get('/add-new-book', displayPageNewBook);
router.post('/add-new-book', upload.single('imageUrl'), addNewBook_Ajax);
router.get('/detail-book/:id', displayPageDetailBook);
router.get('/edit-book/:id', displayPageEditBook);
router.post('/edit-book/:id', upload.single('imageUrl'), editBook_Ajax);
router.delete('/delete-book/:id', deleteBook_Ajax);
router.get('/search', search);

export default router;
