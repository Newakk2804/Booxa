import { Router } from 'express';
import { authMiddleware } from '../utils/middlewares/auth.mjs';
import {
  checkUserValidationSchema,
  changePasswordValidationSchema,
} from '../utils/validationSchema.mjs';
import upload from '../utils/upload.mjs';

import { validate } from '../utils/middlewares/validate.mjs';
import {
  changePassword,
  changeStatusForOrder_Ajax,
  checkUser,
  displayPageAllOrders,
  displayPageChangePassword,
  displayPageCheckUser,
  displayPageProfile,
  getAllBooksOrderForUser_Ajax,
  updateAddress_Ajax,
  updateName_Ajax,
  updatePhoto,
  updateStatusForOrderUser_Ajax,
  updateSurname_Ajax,
} from '../controllers/profileController.mjs';

const router = Router();

router.get('/profile', authMiddleware, displayPageProfile);
router.get('/updateSurnameProfile', updateSurname_Ajax);
router.get('/updateNameProfile', updateName_Ajax);
router.get('/updateAddressProfile', updateAddress_Ajax);
router.post('/profile/photo', upload.single('imageUrl'), updatePhoto);
router.get('/profile/check-user', displayPageCheckUser);
router.post(
  '/profile/check-user',
  validate(checkUserValidationSchema, 'check_user', 'Проверка пользователя'),
  checkUser
);
router.get('/profile/change-password', displayPageChangePassword);
router.post(
  '/profile/change-password',
  validate(changePasswordValidationSchema, 'change_password', 'Изменение пароля'),
  changePassword
);
router.get('/all-orders', displayPageAllOrders);
router.patch('/update-order-status/:id', changeStatusForOrder_Ajax);
router.get('/profile/:id/books', getAllBooksOrderForUser_Ajax);
router.patch('/profile/:id/cancel', updateStatusForOrderUser_Ajax);

export default router;
