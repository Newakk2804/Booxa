import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const orderButton = document.getElementById('make-order');
  const basketCounter = document.getElementById('basket-counter');

  if (orderButton) {
    orderButton.addEventListener('click', async () => {
      try {
        const res = await fetch('/basket/order');
        const data = await res.json();

        showToast(data.message, 3000);

        if (data.success) {
          const countResponse = await fetch('/basket/count');
          const countData = await countResponse.json();
          basketCounter.textContent = countData.count;

          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        }
      } catch (error) {
        console.error('Ошибка при оформлении заказа', error);
        showToast('Произошла ошибка при оформлении заказа. Попробуйте позже.');
      }
    });
  }
});
