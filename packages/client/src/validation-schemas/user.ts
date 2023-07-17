import * as yup from "yup";

export const LoginValidationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export const RegisterValidationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),   //na balw alpharithmitika klp
  
  password2: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match'),
  email: yup.string().email().required("Email is required"),
  // role: yup
  //   .string()
  //   .notOneOf(['1'], "Please select a valid user type")
  //   .required("User type is required"),
});