function togglePanel() {
  const panel = document.getElementById('slide-panel');
  panel.classList.toggle('active');
}

const btns = document.querySelectorAll('.button__catalog');
const content = document.getElementById('block');
const block_content = document.getElementById('block-content');
const block_hidden = document.getElementById('block-hidden');

btns.forEach((el) => {
  el.addEventListener('click', (e) => {
    const isActive = e.target.classList.contains('clicked');

    // Сбрасываем классы у всех кнопок и блоков
    btns.forEach((btn) => btn.classList.remove('clicked'));
    content.classList.remove('open');
    block_content.classList.remove('open-block');
    block_hidden.classList.remove('visible');

    // Если кнопка НЕ была активной — активируем её
    if (!isActive) {
      e.target.classList.add('clicked');
      content.classList.add('open');
      block_content.classList.add('open-block');
      block_hidden.classList.add('visible');
    }
    // Если была активной — ничего не делаем (всё уже сброшено)
  });
});
