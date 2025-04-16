import { Router } from 'express';

const router = Router();

router.get('/about', (req, res) => {
  const locals = {
    title: 'О нас',
  };
  res.render('about.ejs', locals);
});

export default router;
