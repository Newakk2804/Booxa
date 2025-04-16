import express from 'express';
import expressLayout from 'express-ejs-layouts';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import booksRouter from './server/routes/books.mjs';
import contactRouter from './server/routes/contact.mjs';
import aboutRouter from './server/routes/about.mjs';
import deliveryRouter from './server/routes/delivery.mjs';
import loginRouter from './server/routes/login.mjs';
import registerRouter from './server/routes/register.mjs';
import connectDB from './server/config/db.mjs';
import multer from 'multer';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

connectDB();

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use(booksRouter);
app.use(contactRouter);
app.use(aboutRouter);
app.use(deliveryRouter);
app.use(loginRouter);
app.use(registerRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
