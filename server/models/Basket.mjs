import mongoose from 'mongoose';

const BasketSchema = mongoose.Schema(
  {
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.Model('Basket', BasketSchema);

// таблица "корзина" //
// список товаров
// владелец корзины
