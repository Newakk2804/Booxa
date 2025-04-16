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
      required: false,
    },
    basket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Basket',
      required: false,
    },
    role: {
      type: mongoose.Schema.Types.String,
      enum: ['user', 'admin'],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);

// таблица "пользователи" //
// имя
// фамилия
// электронная почта
// пароль
// адрес проживания
// фотография
