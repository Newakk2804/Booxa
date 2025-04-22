export const displayPageAbout = (req, res) => {
  const locals = {
    title: 'О нас',
  };
  res.render('about', locals);
}