export const loginUserValidationSchema = {
  mail: {
    isEmail: {
      errorMessage: 'Введите корректный email',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'Введите пароль',
    },
  },
};
