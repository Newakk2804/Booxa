import { Router } from 'express';

const router = Router();

router.get('/login', (req, res) => {
  const locals = {
    title: 'Вход',
  };
  res.render('login', locals);
});

export default router;
