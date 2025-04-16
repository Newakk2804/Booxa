import { Router } from 'express';

const router = Router();

router.get('/delivery', (req, res) => {
  const locals = {
    title: 'Доставка',
  };
  res.render('delivery', locals);
});

export default router;
