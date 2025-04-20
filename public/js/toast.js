export function showToast(message) {
  const backdrop = document.getElementById('toast-backdrop');
  const toast = document.getElementById('toast');
  const messageContainer = document.getElementById('toast-message');

  messageContainer.textContent = message;
  backdrop.classList.remove('hidden');

  // Показ
  setTimeout(() => {
    backdrop.classList.add('show');
  }, 10);

  // Скрытие через 3 секунды
  setTimeout(() => {
    backdrop.classList.remove('show');
    setTimeout(() => {
      backdrop.classList.add('hidden');
    }, 300);
  }, 3000);
}