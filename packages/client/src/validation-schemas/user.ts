import * as yup from "yup";

export const LoginValidationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export const RegisterValidationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),   //na balw alpharithmitika klp
  email: yup.string().email().required("Email is required"),
 passwordConfirmation: yup
  .string()
  .required("Password confirmation is required")
  .oneOf([yup.ref("password")], "Passwords must match")
    //.nullable()
  ,
  role: yup.string().required("Role is required"),
  age: yup.string().required("Age is required"),
});