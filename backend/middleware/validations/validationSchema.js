import * as z from 'zod';

const UserValidation = z.object({
  // name: z
  //   .string()
  //   .min(2, {
  //     message: 'Too short',
  //   })
  //   .max(50, {
  //     message: 'Too long',
  //   }),
  userName: z
    .string()
    .min(2, {
      message: 'Too short',
    })
    .max(50, {
      message: 'Too long',
    }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters',
    })
    .max(50, {
      message: 'Too long',
    }),
});
const UserUpdateValidation = UserValidation.partial();

const UpdatePasswordValidation = z.object({
  oldPassword: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters',
    })
    .max(50, {
      message: 'Too long',
    }),
  newPassword: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters',
    })
    .max(50, {
      message: 'Too long',
    }),
  newPasswordConfirm: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters',
    })
    .max(50, {
      message: 'Too long',
    }),
});

const ForgotPasswordValidation = z.object({
  email: z.string().email(),
});
const SigninValidation = z.object({
  email: z.string().email(),
  // password: z
  //   .string()
  //   .min(8, {
  //     message: 'Password must be at least 8 characters',
  //   })
  //   .max(50, {
  //     message: 'Too long',
  //   }),
});

const TourValidation = z.object({
  title: z
    .string()
    .min(2, {
      message: 'Too short',
    })
    .max(50, {
      message: 'Too long',
    }),
  description: z
    .string()
    .min(2, {
      message: 'Too short',
    })
    .max(50, {
      message: 'Too long',
    }),
  price: z.number().min(1, {
    message: 'Price must be at least 1',
  }),
  duration: z.number().min(1, {
    message: 'Duration must be at least 1',
  }),
  maxGroupSize: z.number().min(1, {
    message: 'Max group size must be at least 1',
  }),
  difficulty: z
    .string()
    .min(2, {
      message: 'Too short',
    })
    .max(50, {
      message: 'Too long',
    }),
  ratingsAverage: z.number().min(1, {
    message: 'Ratings average must be at least 1',
  }),
  ratingsQuantity: z.number().min(1, {
    message: 'Ratings quantity must be at least 1',
  }),
});
const validationSchema = {
  UserValidation,
  UserUpdateValidation,
  UpdatePasswordValidation,
  ForgotPasswordValidation,
  SigninValidation,
  TourValidation,
};

export default validationSchema;
