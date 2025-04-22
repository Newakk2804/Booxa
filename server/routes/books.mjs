import { Router } from 'express';
import Book from '../models/Books.mjs';
import upload from '../utils/upload.mjs';
import path from 'path';
import fs from 'fs';

const router = Router();

router.get('/', async (req, res) => {
  const locals = { title: 'Главная' };

  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  try {
    const [
      allBooks,
      totalBooks,
      allGenres,
      allAuthors,
      allPublishingHouse,
      allYearOfPublication,
      allLanguages,
      popularBooks,
    ] = await Promise.all([
      Book.find().skip(skip).limit(limit),
      Book.countDocuments(),
      Book.distinct('genres'),
      Book.distinct('author'),
      Book.distinct('publishingHouse'),
      Book.distinct('yearOfPublication'),
      Book.distinct('language'),
      Book.find().sort({ numberOfViews: -1 }).limit(3),
    ]);

    const totalPages = Math.ceil(totalBooks / limit);

    const pagination = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pagination.push(i);
      }
    } else {
      pagination.push(1);

      if (page > 3) pagination.push('...');

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pagination.push(i);
      }

      if (page < totalPages - 2) pagination.push('...');

      pagination.push(totalPages);
    }

    res.render('books', {
      locals,
      allBooks,
      allGenres,
      allAuthors,
      allPublishingHouse,
      allYearOfPublication,
      allLanguages,
      popularBooks,
      currentPage: page,
      totalPages,
      pagination,
      notFound: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка сервера');
  }
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
    const { value, page = 1 } = req.query;
    const limit = 5;
    const currentPage = parseInt(page, 10);

    // Поисковый запрос
    const query = {
      $or: [
        { title: { $regex: value, $options: 'i' } },
        { description: { $regex: value, $options: 'i' } },
      ],
    };

    // Всего найдено
    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / limit);
    const skip = (currentPage - 1) * limit;

    const allBooks = await Book.find(query).skip(skip).limit(limit);

    const [allGenres, allAuthors, allPublishingHouse, allYearOfPublication, allLanguages] =
      await Promise.all([
        Book.distinct('genres'),
        Book.distinct('author'),
        Book.distinct('publishingHouse'),
        Book.distinct('yearOfPublication'),
        Book.distinct('language'),
      ]);
    const popularBooks = await Book.find().sort({ numberOfViews: -1 }).limit(3);

    const locals = {
      title: `Результаты поиска по "${value}"`,
    };

    res.render('books', {
      locals,
      allBooks,
      allGenres,
      allAuthors,
      allPublishingHouse,
      allYearOfPublication,
      allLanguages,
      popularBooks,
      notFound: allBooks.length === 0,
      currentPage,
      totalPages,
      pagination: Array.from({ length: totalPages }, (_, i) => i + 1),
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Ошибка при поиске книг' });
  }
});

export default router;
