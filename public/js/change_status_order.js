import { showToast } from './toast.js';

document.querySelectorAll('.update-status-btn').forEach(button => {
  button.addEventListener('click', async (event) => {
    const form = event.target.closest('form');
    const orderId = form.dataset.id;
    const status = form.querySelector('.order-status').value;

    // Покажем модальное окно подтверждения
    const modal = document.getElementById('status-modal');
    const confirmBtn = document.getElementById('confirm-status-btn');
    const cancelBtn = document.getElementById('cancel-status-btn');
    let selectedSelect = form.querySelector('.order-status');

    modal.classList.remove('hidden');
    
    // Обработчик для подтверждения изменения статуса
    confirmBtn.addEventListener('click', async () => {
      try {
        const response = await fetch(`/update-order-status/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: status }),
        });

        const result = await response.json();
        if (response.ok) {
          showToast(result.message, 2000);
        } else {
          showToast(result.message, 2000);
        }
      } catch (err) {
        showToast('Произошла ошибка при обновлении статуса', 2000);
      }

      modal.classList.add('hidden');
    });

    // Отмена действия
    cancelBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  });
});