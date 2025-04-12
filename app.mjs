import express from 'express';
import expressLayout from 'express-ejs-layouts';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import booksRouter from './server/routes/books.mjs';
import connectDB from './server/config/db.mjs';

dotenv.config();

const app = express();

connectDB();

app.use(express.static('public'));

app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use(booksRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});