import { Router } from 'express';

const router = Router();

router.get('/contact', (req, res) => {
  const locals = {
    title: 'Контакты',
  };
  res.render('contact.ejs', locals);
});

export default router;
