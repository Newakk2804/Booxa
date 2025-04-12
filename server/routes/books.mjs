import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  const locals = {
    title: 'Главная',
  };

  res.render('books', { locals });
});

export default router;