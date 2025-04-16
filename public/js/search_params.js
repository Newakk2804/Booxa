function getSelectedValue(name) {
  const input = document.querySelector(`input[name="${name}"]:checked`);
  return input ? input.value : '';
}

document.querySelectorAll('input').forEach((input) => {
  input.addEventListener('change', async () => {
    const genre = getSelectedValue('genre');
    const author = getSelectedValue('author');
    const publishingHouse = getSelectedValue('publishingHouse');
    const yearOfPublication = getSelectedValue('yearOfPublication');
    const language = getSelectedValue('language');

    const params = new URLSearchParams({
      ...(genre && { genre }),
      ...(author && { author }),
      ...(publishingHouse && { publishingHouse }),
      ...(yearOfPublication && { yearOfPublication }),
      ...(language && { language }),
    });

    try {
      const response = await fetch(`/search-by-params?${params.toString()}`);
      const books = await response.json();

      const container = document.getElementById('list-card');
      container.innerHTML = '';

      if (books.length === 0) {
        container.innerHTML = '<p>Нет книг по выбранным фильтрам.</p>';
        return;
      }

      books.forEach((book) => {
        const el = document.createElement('div');
        el.innerHTML = `
        <div class="card">
            <div class="card-img">
              <img src="${book.imageUrl}" alt="">
            </div>
            <div class="card-content">
              <div class="card-content-text">
                <div class="block-text-title">
                  <p class="text-card-title">
                    ${book.title}
                  </p>
                </div>
                <p class="text-card-description">
                  ${book.description}
                </p>
                <p class="text-card">автор: ${book.author}
                </p>
                <p class="text-card">жанр: ${book.genres}
                </p>
                <p class="text-card">издательство: ${book.publishingHouse}
                </p>
                <p class="text-card">год издания: ${book.yearOfPublication}
                </p>
                <p class="text-card">язык книги: ${book.language}
                </p>
                <p class="text-card">количество страниц: ${book.numberOfBooks}
                </p>
                <p class="text-card">цена: ${book.price} BYN</p>
              </div>
              <div class="card-content-button">
                <a href="#" class="button-card">
                  в корзину
                </a>
                <a href="detail_book.html" class="button-card">
                  подробнее
                </a>
              </div>
            </div>
          </div>`;
        container.appendChild(el);
      });
    } catch (err) {
      console.error('Ошибка при загрузке книг:', err);
    }
  });
});
