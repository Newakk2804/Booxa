import Book from '../models/Books.mjs';
import path from 'path';
import fs from 'fs';

function generatePagination(currentPage, totalPages) {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

export const displayHomePage = async (req, res) => {
  try {
    const locals = { title: 'Главная' };
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const value = req.query.value || '';

    const selectedGenre = req.query.genre || '';
    const selectedAuthor = req.query.author || '';
    const selectedPublishingHouse = req.query.publishingHouse || '';
    const selectedYear = req.query.selectedYear || '';
    const selectedLanguage = req.query.selectedLanguage || '';

    let filter = {};
    if (selectedGenre) filter.genres = selectedGenre;
    if (selectedAuthor) filter.author = selectedAuthor;
    if (selectedPublishingHouse) filter.publishingHouse = selectedPublishingHouse;
    if (selectedYear) filter.yearOfPublication = selectedYear;
    if (selectedLanguage) filter.language = selectedLanguage;

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
      Book.find(filter).skip(skip).limit(limit),
      Book.countDocuments(filter),
      Book.distinct('genres'),
      Book.distinct('author'),
      Book.distinct('publishingHouse'),
      Book.distinct('yearOfPublication'),
      Book.distinct('language'),
      Book.find().sort({ numberOfViews: -1 }).limit(3),
    ]);

    const totalPages = Math.ceil(totalBooks / limit);
    const pagination = generatePagination(page, totalPages);

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
      notFound: allBooks.length === 0,
      value,
      filter,
      originalUrl: req.originalUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Ошибка при загрузке главной страницы' });
  }
};

export const displayPageNewBook = (req, res) => {
  const locals = {
    title: 'Добавление новой книги',
  };

  res.render('add_new_book', locals);
};

export const addNewBook_Ajax = async (req, res) => {
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
};

export const displayPageDetailBook = async (req, res) => {
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
};

export const displayPageEditBook = async (req, res) => {
  const bookId = req.params.id;

  const findBook = await Book.findById(bookId);
  const locals = {
    title: 'Редактирование книги',
    book: findBook,
  };

  res.render('edit_book', locals);
};

export const editBook_Ajax = async (req, res) => {
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
};

export const deleteBook_Ajax = async (req, res) => {
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
};

export const search = async (req, res) => {
  try {
    const { page = 1, genre, author, publishingHouse, year, language } = req.query;
    const limit = 5;
    const currentPage = parseInt(page, 10);
    const skip = (currentPage - 1) * limit;
    const value = req.query.value || '';

    const query = {};
    const searchQuery = value
      ? {
          $or: [
            { title: { $regex: value, $options: 'i' } },
            { description: { $regex: value, $options: 'i' } },
          ],
        }
      : {};

    if (genre) query.genres = genre;
    if (author) query.author = author;
    if (publishingHouse) query.publishingHouse = publishingHouse;
    if (year) query.yearOfPublication = year;
    if (language) query.language = language;

    const finalQuery = { ...query, ...searchQuery };

    const selectedGenre = query.genres || '';
    const selectedAuthor = query.author || '';
    const selectedPublishingHouse = query.publishingHouse || '';
    const selectedYear = query.yearOfPublication || '';
    const selectedLanguage = query.language || '';

    let filter = {};
    if (selectedGenre) filter.genres = selectedGenre;
    if (selectedAuthor) filter.author = selectedAuthor;
    if (selectedPublishingHouse) filter.publishingHouse = selectedPublishingHouse;
    if (selectedYear) filter.yearOfPublication = selectedYear;
    if (selectedLanguage) filter.language = selectedLanguage;

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
      Book.find(finalQuery).skip(skip).limit(limit),
      Book.countDocuments(finalQuery),
      Book.distinct('genres'),
      Book.distinct('author'),
      Book.distinct('publishingHouse'),
      Book.distinct('yearOfPublication'),
      Book.distinct('language'),
      Book.find().sort({ numberOfViews: -1 }).limit(3),
    ]);

    const totalPages = Math.ceil(totalBooks / limit);
    const pagination = generatePagination(currentPage, totalPages);

    const locals = {
      title: 'Результаты поиска',
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
      filter,
      notFound: allBooks.length === 0,
      currentPage,
      totalPages,
      pagination,
      value,
      genre,
      author,
      publishingHouse,
      year,
      language,
      originalUrl: req.originalUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Ошибка при поиске книг' });
  }
};
