import mongoose from 'mongoose';

const BookSchema = mongoose.Schema(
  {
    title: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    description: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    imageUrl: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    genres: [{
      type: mongoose.Schema.Types.String,
      required: true,
    }],
    author: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    publishingHouse: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    yearOfPublication: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    language: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    numberOfBooks: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    price: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    numberOfViews: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Book', BookSchema);

// таблица "книга" //
// название
// изображение
// описание книги
// жанр
// автор
// издательство
// год выпуска
// язык книги
// количество страниц
// цена
// количетсво просмотров
