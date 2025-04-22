import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const basketCounter = document.getElementById('basket-counter');
  const basketTotal = document.getElementById('basket-total');
  const basketList = document.querySelector('.basket-list');

  async function updateBasketCount() {
    try {
      const response = await fetch('/basket/count');
      const data = await response.json();
      basketCounter.textContent = data.count;
    } catch (error) {
      console.error('Ошибка при обновлении счетчика: ', error);
    }
  }

  async function updateBasketTotal() {
    try {
      const response = await fetch('/basket/total');
      const data = await response.json();
      basketTotal.textContent = data.total;
    } catch (error) {
      console.error('Ошибка при обновлении стоимости: ', error);
    }
  }

  updateBasketCount();
  updateBasketTotal();

  const deleteButtons = document.querySelectorAll('.button-basket-delete');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const bookId = button.dataset.id;

      try {
        const response = await fetch(`/basket/${bookId}`, { method: 'DELETE' });
        const data = await response.json();

        if (response.ok) {
          const itemElement = document.querySelector(`.basket-item[data-id="${bookId}"]`);
          if (itemElement) itemElement.remove();

          showToast(data.message, 2000);

          updateBasketCount();
          updateBasketTotal();
        } else {
          showToast('Не удалось удалить товар из корзины', 2000);
          console.error('Не удалось удалить товар из корзины');
        }
      } catch (error) {
        console.error('Ошибка при удалении: ', error);
      }
    });
  });
});
