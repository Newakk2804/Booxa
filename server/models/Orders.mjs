import mongoose from 'mongoose';

const OrderSchema = mongoose.Schema(
  {
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
      },
    ],
    price: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    status: {
      type: mongoose.Schema.Types.String,
      enum: ['В обработке', 'Собирается на складе', 'В пути до получателя', 'Доставлен', 'Отменен'],
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', OrderSchema);

// таблица "заказы" //
// дата
// количество товаров
// стоимость
// статус
// кому принадлежит заказ
