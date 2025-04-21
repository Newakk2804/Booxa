import { showToast } from './toast.js';

const deleteButtons = document.querySelectorAll('.delete-book-btn');
const modal = document.getElementById('delete-modal');
const confirmBtn = document.getElementById('confirm-delete');
const cancelBtn = document.getElementById('cancel-delete');

let selectedBookId = null;

deleteButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    selectedBookId = btn.dataset.id;
    modal.style.display = 'flex';
  });
});

cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  selectedBookId = null;
});

confirmBtn.addEventListener('click', async () => {
  if (!selectedBookId) return;
  try {
    const response = await fetch(`/delete-book/${selectedBookId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Можно показать toast
      showToast('Книга успешно удалена', 2000);
      // Перезагрузка или перенаправление
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } else {
      showToast('Ошибка при удалении книги', 2000);
    }
  } catch (err) {
    console.error(err);
    showToast('Серверная ошибка', 2000);
  } finally {
    modal.style.display = 'none';
  }
});
