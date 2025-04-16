import { Router } from 'express';
import User from '../models/Users.mjs';
import bcrypt from 'bcrypt';

const router = Router();

router.get('/login', (req, res) => {
  const locals = {
    title: 'Вход',
  };
  res.render('login', locals);
});

router.post('/login', async (req, res) => {
  try {
    const { mail, password } = req.body;
    const user = await User.findOne({ mail });

    if (!user) return res.send({ msg: 'Проблема' });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
  }

    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

export default router;
