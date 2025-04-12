import mongoose from 'mongoose';

const OrderSchema = mongoose.Schema(
  {
    numberOfItems: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    price: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    status: {
      type: mongoose.Schema.Types.String,
      enum: ['В обработке', 'собирается на складе', 'в пути до получателя', 'доставлен'],
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.Model('Order', OrderSchema);

// таблица "заказы" //
// дата
// количество товаров
// стоимость
// статус
// кому принадлежит заказ
