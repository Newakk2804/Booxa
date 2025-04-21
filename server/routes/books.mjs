import { Router } from 'express';
import Book from '../models/Books.mjs';
import upload from '../utils/upload.mjs';
import path from 'path';
import fs from 'fs';

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

router.get('/add-new-book', (req, res) => {
  const locals = {
    title: 'Добавление новой книги',
  };

  res.render('add_new_book', locals);
});

router.post('/add-new-book', upload.single('imageUrl'), async (req, res) => {
  try {
    const {
      title,
      description,
      genres,
      author,
      publishingHouse,
      yearOfPublication,
      language,
      numberOfBooks,
      price,
    } = req.body;

    const newBook = new Book({
      title,
      description,
      genres: genres.split(',').map((g) => g.trim()),
      author,
      publishingHouse,
      yearOfPublication: Number(yearOfPublication),
      language,
      numberOfBooks: Number(numberOfBooks),
      price: Number(price),
      imageUrl: req.file ? `uploads/${req.file.filename}` : '',
      numberOfViews: 0,
    });

    await newBook.save();
    res.json({ message: 'Книга успешно добавлена.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при добавлении книги' });
  }
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

router.get('/edit-book/:id', async (req, res) => {
  const bookId = req.params.id;

  const findBook = await Book.findById(bookId);
  const locals = {
    title: 'Редактирование книги',
    book: findBook,
  };

  res.render('edit_book', locals);
});

router.post('/edit-book/:id', upload.single('imageUrl'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      genres,
      author,
      publishingHouse,
      yearOfPublication,
      language,
      numberOfBooks,
      price,
    } = req.body;

    const updateData = {
      title,
      description,
      genres: genres.split(',').map((g) => g.trim()),
      author,
      publishingHouse,
      yearOfPublication: Number(yearOfPublication),
      language,
      numberOfBooks: Number(numberOfBooks),
      price: Number(price),
    };

    if (req.file) {
      updateData.imageUrl = 'uploads/' + req.file.filename;
    }

    await Book.findByIdAndUpdate(id, updateData);

    res.json({ message: 'Книга успешно обновлена.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении книги' });
  }
});

router.delete('/delete-book/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }
    if (book.imageUrl) {
      const filePath = path.join(process.cwd(), 'public', book.imageUrl);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Ошибка при удалении изображения:', err.message);
        }
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Книга удалена' });
  } catch (error) {
    console.error('Ошибка при удалении книги:', error);
    res.status(500).json({ message: 'Ошибка при удалении' });
  }
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
