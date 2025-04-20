document.addEventListener('DOMContentLoaded', () => {
  const basketCounter = document.getElementById('basket-counter');
  const basketTotal = document.getElementById('basket-total');

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

        if (response.ok) {
          const itemElement = document.querySelector(`.basket-item[data-id="${bookId}"]`);
          if (itemElement) itemElement.remove();

          updateBasketCount();
          updateBasketTotal();
        } else {
          console.error('Не удалось удалить товар из корзины');
        }
      } catch (error) {
        console.error('Ошибка при удалении: ', error);
      }
    });
  });
});
