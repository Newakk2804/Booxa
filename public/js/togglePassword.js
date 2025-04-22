const toggleOldPassword = document.getElementById('toggleOldPassword');
const toggleNewPassword = document.getElementById('toggleNewPassword');
const toggleAgainPassword = document.getElementById('toggleAgainPassword');
const oldPassword = document.getElementById('oldPassword');
const newPassword = document.getElementById('newPassword');
const againPassword = document.getElementById('againPassword');

toggleOldPassword.addEventListener('click', function () {
  // Сменить тип поля на text, если оно было password, иначе на password
  const type = oldPassword.type === 'password' ? 'text' : 'password';
  oldPassword.type = type;
  // Можете изменить иконку в зависимости от состояния
  this.textContent = type === 'password' ? '👁️' : '🙈'; 
});

toggleNewPassword.addEventListener('click', function () {
  // Сменить тип поля на text, если оно было password, иначе на password
  const type = newPassword.type === 'password' ? 'text' : 'password';
  newPassword.type = type;
  // Можете изменить иконку в зависимости от состояния
  this.textContent = type === 'password' ? '👁️' : '🙈'; 
});

toggleAgainPassword.addEventListener('click', function () {
  // Сменить тип поля на text, если оно было password, иначе на password
  const type = againPassword.type === 'password' ? 'text' : 'password';
  againPassword.type = type;
  // Можете изменить иконку в зависимости от состояния
  this.textContent = type === 'password' ? '👁️' : '🙈'; 
});