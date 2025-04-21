import { showToast } from './toast.js';

const form = document.querySelector('.form-edit-book');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      showToast(result.message, 2000);

      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } else {
      showToast(result.message || 'Произошла ошибка. Попробуйте еще раз.', 2000);
    }
  } catch (error) {
    console.error('Ошибка при отправке формы:', error);
    showToast('Ошибка при отправке данных.', 2000);
  }
});
