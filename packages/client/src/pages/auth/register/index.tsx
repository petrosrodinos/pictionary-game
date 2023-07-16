import { FC } from "react";
import { trpc } from "../../../utils/trpc";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import { BiRegistered } from "react-icons/bi";
import Input from "../../../components/ui/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {RegisterValidationSchema } from "../../../validation-schemas/user";
import { UserRegister } from "../../../types/user";
//import { authStore } from "../../../store/authStore";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import Dropdown from "../../../components/ui/Dropdown";

const Register: FC = () => {
  const { isLoading, mutate: RegisterMutation } = trpc.auth.register.useMutation();
  //const { Register } = authStore((state) => state);
  const navigate = useNavigate();

  const {
    register, //einai diko toy onoma den exei na kanei me to button 
    handleSubmit,// toy library
    formState: { errors },
  } = useForm<UserRegister>({
    resolver: yupResolver(RegisterValidationSchema),
    defaultValues: {
      username: "",
      password: "",
      password2: "",
      email: "",
      user_type: "",
    },
  });

  const handleRegister = async (values: UserRegister) => {
    RegisterMutation(
      {
        username: values.username,
        password: values.password,
        password2: values.password2,
        email: values.email,
        user_type: values.user_type,
      },
      {
        onSuccess: (data: any) => {
          if (data.accessToken) {
            Register({
              userId: data.id,
              username: data.username,
              token: data.accessToken,
              user_type: data.user_type,
            });
            navigate("/home");
          }
        },
        onError: (error: any) => {
          alert(error.message);
        },
      }
    );
  };

  //edw bazw ta props 
  return (
    <form className="register-page-container" onSubmit={handleSubmit(handleRegister)}>
      <Typography variant="sub-header-main">Register</Typography>
      <Input
        error={errors.username?.message}
        name="username"
        register={register}
        placeholder="Username"
      />
      
      <Input
        error={errors.password?.message}
        name="password"
        register={register}
        placeholder="Password"
        type="password"
      />
      <Input
        error={errors.password2?.message}
        name="confirm-password"
        register={register}
        placeholder="Confirm Password"
        type="password"
      />
      <Input
        error={errors.email?.message}
        name="email"
        register={register}
        placeholder="email"
      />
      <Dropdown
        error={errors.user_type?.message}
        // register={register}
      />
      <Button type="submit" loading={isLoading} icon={BiRegistered} title="Register    " variant="primary" />
    </form>
  );
};


export default Register;
