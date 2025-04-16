import { Router } from 'express';

const router = Router();

router.get('/register', (req, res) => {
  const locals = {
    title: 'Регистрация',
  };
  res.render('register.ejs', locals);
});

export default router;
