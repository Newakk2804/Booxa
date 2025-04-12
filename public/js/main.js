function togglePanel() {
  const panel = document.getElementById('slide-panel');
  panel.classList.toggle('active');
}

const content = document.getElementById('block');
const block_content = document.getElementById('block-content');

const allButtons = document.querySelectorAll('.button__catalog');
const allBlocks = {
  genre: document.getElementById('block-hidden-genre'),
  author: document.getElementById('block-hidden-author'),
  publishing: document.getElementById('block-hidden-publishing'),
  yearOfPublication: document.getElementById('block-hidden-yearOfPublication'),
  language: document.getElementById('block-hidden-language'),
};

allButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.id.replace('button_', '');
    const isActive = btn.classList.contains('clicked');

    allButtons.forEach((b) => b.classList.remove('clicked'));
    block_content.classList.remove('open-block');
    content.classList.remove('open');
    Object.values(allBlocks).forEach((block) => {
      if (block) block.classList.remove('visible');
    });

    if (!isActive) {
      btn.classList.add('clicked');
      block_content.classList.add('open-block');
      content.classList.add('open');
      if (allBlocks[target]) {
        allBlocks[target].classList.add('visible');
      }
    }
  });
});

let lastChecked = null;

function toggleRadio(radio) {
  if (lastChecked === radio) {
    radio.checked = false;
    lastChecked = null;
  } else {
    lastChecked = radio;
  }
}
