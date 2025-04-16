import express from 'express';
import expressLayout from 'express-ejs-layouts';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import booksRouter from './server/routes/books.mjs';
import contactRouter from './server/routes/contact.mjs';
import aboutRouter from './server/routes/about.mjs';
import deliveryRouter from './server/routes/delivery.mjs';
import loginRouter from './server/routes/login.mjs';
import registerRouter from './server/routes/register.mjs';
import basketRouter from './server/routes/basket.mjs';
import connectDB from './server/config/db.mjs';
import multer from 'multer';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
  })
);

app.use(booksRouter);
app.use(contactRouter);
app.use(aboutRouter);
app.use(deliveryRouter);
app.use(loginRouter);
app.use(registerRouter);
app.use(basketRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
