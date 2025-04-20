import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', async () => {
  const basketCounter = document.getElementById('basket-counter');

  try {
    const response = await fetch('/basket/count');
    if (response.ok) {
      const data = await response.json();
      basketCounter.textContent = data.count;
    } else {
      console.error('Не удалось получить количество товаров в корзине');
    }
  } catch (error) {
    console.log('Ошибка при получении количества товаров: ', error);
  }

  const buttonsAddToBasket = document.querySelectorAll('.add-item-basket');
  buttonsAddToBasket.forEach((button) => {
    button.addEventListener('click', async () => {
      const id_item = button.dataset.id;

      try {
        const response = await fetch(`/basket/${id_item}`);
        const data = await response.json();
        if (response.ok) {
          const countResponse = await fetch('/basket/count');
          const count = await countResponse.json();
          basketCounter.textContent = count.count;
          showToast(data.message, 1500);
        } else {
          showToast('Ошибка при добавлении товара. Попробуйте позже.', 3000);
        }
      } catch (error) {
        console.error('Ошибка сети: ', error);
      }
    });
  });
});
