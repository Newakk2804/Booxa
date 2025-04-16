import { Router } from 'express';

const router = Router();

router.get('/login', (req, res) => {
  const locals = {
    title: 'Вход',
  };
  res.render('login.ejs', locals);
});

export default router;
