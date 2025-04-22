export const displayPageDelivery = (req, res) => {
  const locals = {
    title: 'Доставка',
  };
  res.render('delivery', locals);
};
