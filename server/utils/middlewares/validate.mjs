import { validationResult, checkSchema } from 'express-validator';

export const validate = (schema, view, title) => [
  checkSchema(schema),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const mappedErrors = errors.mapped();
      return res.status(400).render(view, {
        errors: mappedErrors,
        formData: req.body,
        userId: req.session.TempUserId || req.session.userId,
        title: title,
      });
    }
    next();
  },
];
