import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: false,
    },
    surname: {
      type: mongoose.Schema.Types.String,
      required: false,
    },
    mail: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.String,
      required: false,
    },
    imageUrl: {
      type: mongoose.Schema.Types.String,
      required: false,
    },
    orders: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    basket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Basket',
    },
  },
  { timestamps: true }
);

export default mongoose.Model('User', UserSchema);

// таблица "пользователи" //
// имя
// фамилия
// электронная почта
// пароль
// адрес проживания
// фотография
