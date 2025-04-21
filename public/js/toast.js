export function showToast(message, time) {
  const backdrop = document.getElementById('toast-backdrop');
  const toast = document.getElementById('toast');
  const messageContainer = document.getElementById('toast-message');

  messageContainer.textContent = message;
  backdrop.classList.remove('hidden');

  setTimeout(() => {
    backdrop.classList.add('show');
  }, 10);

  setTimeout(() => {
    backdrop.classList.remove('show');
    setTimeout(() => {
      backdrop.classList.add('hidden');
    }, 300);
  }, time);
}
