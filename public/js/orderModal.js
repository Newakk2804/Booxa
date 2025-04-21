document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('order-modal');
  const closeModal = document.getElementById('close-modal');
  const booksList = document.getElementById('order-books-list');

  document.querySelectorAll('.open-order-details').forEach((button) => {
    button.addEventListener('click', async () => {
      const orderId = button.dataset.id;
      try {
        const res = await fetch(`/profile/${orderId}/books`);
        const data = await res.json();

        booksList.innerHTML = '';
        data.books.forEach(book => {
          const li = document.createElement('li');
          li.classList.add('book-list-item');
        
          li.innerHTML = `
            <img src="${book.imageUrl}" alt="${book.title}" class="book-cover" />
            <div class="book-info">
              <p class="book-title">${book.title}</p>
              <p class="book-price">${book.price} BYN</p>
            </div>
          `;
        
          booksList.appendChild(li);
        });

        modal.classList.remove('hidden');
      } catch (err) {
        console.error('Ошибка при получении книг:', err);
      }
    });
  });

  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
});
