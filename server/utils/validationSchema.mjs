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

export const registerUserValidationSchema = {
  mail: {
    isEmail: {
      errorMessage: 'Введите корректный email',
    },
    notEmpty: {
      errorMessage: 'Поле почты не должно быть пустым',
    },
  },
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: 'Пароль должен содержать минимум 6 символов',
    },
    notEmpty: {
      errorMessage: 'Введите пароль',
    },
  },
  secondPassword: {
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Пароли не совпадают');
        }
        return true;
      },
    },
  },
};

