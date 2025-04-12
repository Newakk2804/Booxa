import { Router } from 'express';
import Book from '../models/Books.mjs';

const router = Router();

router.get('/', async (req, res) => {
  const locals = {
    title: 'Главная',
  };

  const allBooks = await Book.find();
  const [allGenres, allAuthors, allPublishingHouse, allYearOfPublication, allLanguages] =
    await Promise.all([
      Book.distinct('genres'),
      Book.distinct('author'),
      Book.distinct('publishingHouse'),
      Book.distinct('yearOfPublication'),
      Book.distinct('language'),
    ]);
  const popularBooks = await Book.find().sort({ numberOfViews: -1 }).limit(3);

  res.render('books', {
    locals,
    allBooks,
    allGenres,
    allAuthors,
    allPublishingHouse,
    allYearOfPublication,
    allLanguages,
    popularBooks,
  });
});

router.get('/search-by-params', async (req, res) => {
  try {
    const { genre, author, publishingHouse, yearOfPublication, language } = req.query;

    const query = {};

    if (genre) query.genres = genre;
    if (author) query.author = author;
    if (publishingHouse) query.publishingHouse = publishingHouse;
    if (yearOfPublication) {
      query.yearOfPublication = Number(yearOfPublication); // 🔧 преобразуем в число
    }
    if (language) query.language = language;

    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при поиске книг' });
  }
});

export default router;
