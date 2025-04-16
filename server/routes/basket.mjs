import { Router } from 'express';

const router = Router();

router.get('/basket', (req, res) => {
  const locals = {
    title: 'Корзина',
  };
  res.render('basket.ejs', locals);
});

export default router;
