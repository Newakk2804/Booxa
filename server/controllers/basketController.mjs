import Basket from '../models/Basket.mjs';
import Order from '../models/Orders.mjs';
import User from '../models/Users.mjs';

export const displayUserBasket = async (req, res) => {
  const userId = req.session.userId;
  let basket;
  try {
    basket = await Basket.findOne({ owner: userId }).populate('items');

    if (!basket) {
      basket = await Basket.create({ owner: userId, items: [] });
    }

    const locals = {
      title: 'Корзина',
      items: basket.items,
    };

    res.render('basket', locals);
  } catch (error) {
    console.log(error);
    res.send('Ошибка получения корзины');
  }
};

export const countItemInBasket_Ajax = async (req, res) => {
  try {
    const userId = req.session.userId;
    const basket = await Basket.findOne({ owner: userId });
    const count = basket ? basket.items.length : 0;
    res.json({ count });
  } catch (err) {
    res.status(500).json({ count: 0 });
  }
};

export const totalPriceForBasket_Ajax = async (req, res) => {
  try {
    const userId = req.session.userId;
    const basket = await Basket.findOne({ owner: userId }).populate('items');

    if (!basket) return res.json({ total: 0 });

    const total = basket.items.reduce((sum, item) => sum + item.price, 0);
    res.json({ total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при подсчете общей стоимости' });
  }
};

export const placingAnOrder_Ajax = async (req, res) => {
  const userId = req.session.userId;
  const basket = await Basket.findOne({ owner: userId }).populate('items');
  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).json({ message: 'Пользователь не найден.' });
  }

  if (!basket) {
    return res.status(400).json({ message: 'Корзина пуста.' });
  }

  const totalPrice = basket.items.reduce((sum, item) => sum + item.price, 0);

  if (!user.address) {
    return res.json({
      message: 'Для оформления заказа, введите в своем личном кабинете адрес проживания.',
      success: false,
    });
  }

  try {
    const order = await Order.create({
      items: basket.items.map((book) => book._id),
      owner: userId,
      price: totalPrice,
      status: 'В обработке',
    });

    basket.items = [];
    await basket.save();

    res.json({ message: 'Заказ оформлен.', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при оформлении заказа.', success: false });
  }
};

export const deleteItemInBasket_Ajax = async (req, res) => {
  const userId = req.session.userId;
  const bookId = req.params.id;

  try {
    const basket = await Basket.findOne({ owner: userId });

    basket.items = basket.items.filter((item) => item.toString() !== bookId);

    await basket.save();
    return res.json({ message: 'Товар удален из корзины' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const addItemInBasket_Ajax = async (req, res) => {
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
      } else {
        return res.json({ message: 'Такая книга уже есть в корзине.' });
      }
    }

    res.json({ message: 'Книга добавлена в корзину.' });
  } catch (error) {
    console.log(error);
    res.send('Ошибка добавления в корзину');
  }
};
