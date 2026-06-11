export const validationRules = {
  email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
  password: (value: string) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
  confirmPassword: (value: string, values: { password: string }) => 
    (value === values.password ? null : 'Passwords do not match'),
};

export const formInitialValues = {
  login: {
    email: '',
    password: '',
  },
  signup: {
    email: '',
    password: '',
    confirmPassword: '',
  },
};
