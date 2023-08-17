import * as yup from "yup";

export const LoginValidationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export const RegisterValidationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
  role: yup.string().required("Role is required"),
  age: yup.string().required("Age is required"),
  avatar: yup.string().required("Avatar is required"),
});

export const EditProfileValidationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string(),
  role: yup.string().required("Role is required"),
  age: yup.string().required("Age is required"),
  avatar: yup.string().required("Avatar is required"),
});
