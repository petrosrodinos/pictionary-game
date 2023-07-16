import * as yup from "yup";

export const LoginValidationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export const RegisterValidationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),   //na balw alpharithmitika klp
  password2: yup.string().required("Password is gat"), 
  email: yup.string().email().required("Email is required"),
  // user_type: yup
  //   .string()
  //   .oneOf(['2', '3', '4'])
  //   .required("User type is required"),
  user_type: yup
    .string()
    .notOneOf(['1'], "Please select a valid user type")
    .required("User type is required"),
});