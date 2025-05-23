# 📚 Booxa

**Booxa** — это веб-приложение для управления коллекцией книг, позволяющее пользователям просматривать, добавлять и редактировать информацию о книгах через удобный интерфейс.

## ⚙️ Реализованный функционал

### 👥 Пользователи
- Регистрация и вход с использованием `express-session` для управления сессиями.
- Роли пользователей: гость, клиент, администратор.
- Хранение зашифрованных паролей с использованием `bcrypt`.
- Сессии и авторизация через cookies с помощью `express-session` и `cookie-parser`.
- Возможность просматривать книги без регистрации.
- Администратор использует ту же панель, что и пользователь.

### 📦 Заказы
- Добавление книг в корзину.
- Оформление заказа через корзину (без онлайн-оплаты).
- Отслеживание статуса заказа:
  - `В обработке`
  - `Собирается на складе`
  - `В пути до получателя`
  - `Доставлен`
- Отмена заказа возможна только на стадии "в обработке".

### 🛒 Корзина
- Привязана к конкретному пользователю.
- Книги можно редактировать в корзине до оформления заказа.

### 📖 Каталог книг
- Поиск и фильтрация книг по жанрам, авторам, издательствам и другим параметрам.
- Просмотр описаний книг, характеристик, языка, количества страниц.
- Жанры указаны на русском языке.
- Изображения обложек загружаются на сервер и хранятся локально с использованием `multer`.

## 🛠 Используемые технологии и библиотеки

### 📌 Backend:
- Node.js + Express.js — серверное приложение
- Mongoose — работа с MongoDB
- bcrypt — хэширование паролей
- express-session — управление сессиями
- express-validator — валидация данных на сервере
- multer — загрузка изображений
- dotenv — переменные окружения
- cookie-parser — парсинг cookies

### 🖥️ Frontend:
- HTML + CSS + JavaScript (без фреймворков)
- Серверный рендеринг с использованием EJS
- Страницы: главная, каталог книг, корзина, заказы, форма входа/регистрации, страница добавления/редактирования книг (для админа)

## 🧱 Архитектура проекта

Проект построен по принципу **MVC (Model-View-Controller)**:

- **Models**: описаны с использованием Mongoose (User, Book, Order, Basket)
- **Views**: шаблоны EJS, разбиты по функциональным разделам
- **Controllers/Routes**: логика обработки маршрутов, middleware, проверок авторизации и прав доступа

## 📥 Установка

1. Склонируйте репозиторий:
   ```bash
   git clone https://github.com/Newakk2804/Booxa.git
   cd Booxa
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Создайте файл `.env` в корне проекта и укажите переменные:
   ```env
   PORT=3000
   SESSION_SECRET=your_session_secret
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Запустите сервер:
   ```bash
   npm start
   ```

5. Перейдите в браузере:
   ```
   http://localhost:3000
   ```

## 🔒 Безопасность и валидация

- Пароли хранятся в зашифрованном виде с использованием `bcrypt`.
- Авторизация осуществляется через сессии и cookies с помощью `express-session` и `cookie-parser`.
- Валидация данных при регистрации, входе, добавлении/редактировании книг и заказов с использованием `express-validator`.

## 📈 Возможности для расширения

- Отдельная админ-панель
- Онлайн-оплата
- История заказов и уведомления

## 📃 Лицензия

Проект распространяется под лицензией **MIT**.
