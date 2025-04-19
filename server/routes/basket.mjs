import { Router } from 'express';
import Book from '../models/Books.mjs';
import Basket from '../models/Basket.mjs';

const router = Router();

router.get('/basket', async (req, res) => {
  const userId = req.session.userId;

  try {
    const basket = await Basket.findOne({ owner: userId }).populate('items');

    if (!basket) {
      return res.send('Корзина не найдена');
    }

    let totalPrice = 0;

    basket.items.forEach((item) => {
      totalPrice += item.price;
    });

    const locals = {
      title: 'Корзина',
      items: basket.items,
      totalPrice: totalPrice,
    };
    res.render('basket', locals);
  } catch (error) {
    console.log(error);
    res.send('Ошибка получения корзины');
  }
});

router.get('/basket/:id', async (req, res) => {
  const userId = req.session.userId;
  const bookId = req.params.id;

  try {
    let basket = await Basket.findOne({ owner: userId });

    if (!basket) {
      basket = await Basket.create({ owner: userId, items: [bookId] });
    } else {
      if (!basket.items.includes(bookId)) {
        basket.items.push(bookId);
        await basket.save();
      }
    }

    res.send('Книга добавлена в корзину');
  } catch (error) {
    console.log(error);
    res.send('Ошибка добавления в корзину');
  }
});

export default router;
