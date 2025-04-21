import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const cancelButtons = document.querySelectorAll('.button-profile-delete');
  const modal = document.getElementById('confirmModal');
  const confirmYes = document.getElementById('confirmYes');
  const confirmNo = document.getElementById('confirmNo');

  let currentOrderId = null;
  let currentOrderElement = null;
  let currentButton = null;

  cancelButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const orderElement = button.closest('.profile-item');
      currentOrderId = orderElement.dataset.orderId;
      currentOrderElement = orderElement;
      currentButton = button;
      modal.classList.remove('hidden');
    });
  });

  confirmNo.addEventListener('click', () => {
    modal.classList.add('hidden');
    currentOrderId = null;
    currentOrderElement = null;
    currentButton = null;
  });

  confirmYes.addEventListener('click', async () => {
    if (!currentOrderId) return;

    try {
      const response = await fetch(`/profile/${currentOrderId}/cancel`, {
        method: 'PATCH',
      });

      const result = await response.json();

      if (response.ok) {
        showToast(result.message || 'Заказ отменён', 2000);

        const statusElement = currentOrderElement.querySelectorAll('.text-profile-order');
        statusElement.forEach((el) => {
          if (el.textContent.trim().startsWith('статус:')) {
            el.textContent = 'статус: Отменен';
          }
        });

        currentButton.disabled = true;
        currentButton.classList.add('disabled');
      } else {
        showToast(result.message || 'Не удалось отменить заказ', 2000);
      }
    } catch (err) {
      console.error('Ошибка при отмене заказа:', err);
      showToast('Ошибка сервера. Попробуйте позже.', 2000);
    }

    modal.classList.add('hidden');
    currentOrderId = null;
    currentOrderElement = null;
    currentButton = null;
  });
});
