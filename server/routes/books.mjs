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

router.get('/detail-book/:id', async (req, res) => {
  const idBook = req.params.id;
  const findBook = await Book.findByIdAndUpdate(
    idBook,
    { $inc: { numberOfViews: 1 } },
    { new: true }
  );
  const bookGenres = await Book.find({
    genres: { $in: findBook.genres },
    _id: { $ne: findBook._id },
  })
    .sort({ numberOfViews: -1 })
    .limit(3);
  const bookPublishingHouse = await Book.find({
    publishingHouse: { $in: findBook.publishingHouse },
    _id: { $ne: findBook._id },
  })
    .sort({ numberOfViews: -1 })
    .limit(3);
  const bookAuthor = await Book.find({
    author: { $in: findBook.author },
    _id: { $ne: findBook._id },
  })
    .sort({ numberOfViews: -1 })
    .limit(3);

  const locals = {
    title: findBook.title,
    book: findBook,
    bookGenres,
    bookPublishingHouse,
    bookAuthor,
  };

  res.render('detail_book', locals);
});

router.get('/search-by-params', async (req, res) => {
  try {
    const { genre, author, publishingHouse, yearOfPublication, language } = req.query;

    const query = {};

    if (genre) query.genres = genre;
    if (author) query.author = author;
    if (publishingHouse) query.publishingHouse = publishingHouse;
    if (yearOfPublication) {
      query.yearOfPublication = Number(yearOfPublication);
    }
    if (language) query.language = language;

    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при поиске книг' });
  }
});

router.get('/search-by-search-field', async (req, res) => {
  try {
    const { value } = req.query;
    console.log(value);

    const books = await Book.find({
      $or: [
        { title: { $regex: value, $options: 'i' } },
        { description: { $regex: value, $options: 'i' } },
      ],
    });
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при поиске книг' });
  }
});

export default router;
