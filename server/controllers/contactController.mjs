export const displayPageContact = (req, res) => {
  const locals = {
    title: 'Контакты',
  };
  res.render('contact', locals);
}