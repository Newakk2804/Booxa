const button_add_item_in_basket = document.querySelectorAll('.add-item-basket');

button_add_item_in_basket.forEach((button) => {
  button.addEventListener('click', async () => {
    const id_item = button.dataset.id;

    try {
      const response = await fetch(`/basket/${id_item}`);
      if (response.ok) {
        console.log('Товар добавлен в корзину');
      } else {
        console.error('Ошибка при добавлении товара');
      }
    } catch (error) {
      console.error('Ошибка сети: ', error);
    }
  });
});

