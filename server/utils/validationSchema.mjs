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

export const checkUserValidationSchema = {
  checkUser: {
    isEmail: {
      errorMessage: 'Введите корректный email',
    },
    notEmpty: {
      errorMessage: 'Поле не должно быть пустым',
    },
  },
};

export const changePasswordValidationSchema = {
  oldPassword: {
    notEmpty: {
      errorMessage: 'Введите старый пароль',
    },
  },
  newPassword: {
    notEmpty: {
      errorMessage: 'Введите новый пароль',
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'Пароль должен содержать минимум 6 символов',
    },
  },
  againPassword: {
    notEmpty: {
      errorMessage: 'Повторите новый пароль',
    },
    custom: {
      options: (value, { req }) => value === req.body.newPassword,
      errorMessage: 'Пароли не совпадают',
    },
  },
};