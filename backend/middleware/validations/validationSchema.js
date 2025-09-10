import * as z from 'zod';

// قائمة بالـ domains المسموحة
const allowedDomains = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'icloud.com',
  'me.com',
  'mac.com',
  // يمكنك إضافة domains أخرى حسب الحاجة
];

// Custom email validation with domain check
const emailValidation = z
  .string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Please enter a valid email address' })
  .refine(
    (email) => {
      const domain = email.split('@')[1];
      return allowedDomains.includes(domain);
    },
    {
      message:
        'Email domain is not allowed. Please use Gmail, Yahoo, Hotmail, or Outlook',
    }
  );

const UserValidation = z.object({
  userName: z
    .string()
    .min(3, {
      message: 'Username must be at least 3 characters',
    })
    .max(50, {
      message: 'Username must be less than 50 characters',
    })
    .regex(/^[A-Za-z\u0600-\u06FF\s]+$/, {
      message: 'Username can only contain letters and spaces',
    }),

  email: emailValidation,

  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters',
    })
    .max(50, {
      message: 'Password must be less than 50 characters',
    })
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, {
      message:
        'Password must contain at least 1 uppercase letter, 1 number, and 1 special character',
    }),
});

const UserUpdateValidation = UserValidation.partial();

const UpdatePasswordValidation = z
  .object({
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
      })
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, {
        message:
          'Password must contain at least 1 uppercase letter, 1 number, and 1 special character',
      }),
    newPasswordConfirm: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters',
      })
      .max(50, {
        message: 'Too long',
      }),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: 'Passwords do not match',
    path: ['newPasswordConfirm'],
  });

const ForgotPasswordValidation = z.object({
  email: emailValidation,
});

const SigninValidation = z.object({
  email: emailValidation,
  password: z.string().min(1, { message: 'Password is required' }),
});

// OTP Validation
const OTPValidation = z.object({
  email: emailValidation,
  otp: z
    .string()
    .length(6, { message: 'OTP must be 6 digits' })
    .regex(/^\d{6}$/, { message: 'OTP must contain only numbers' }),
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
  OTPValidation,
  TourValidation,
};

export default validationSchema;
