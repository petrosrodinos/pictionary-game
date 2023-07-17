import { FC } from "react";
import { trpc } from "../../../utils/trpc";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import { BiRegistered } from "react-icons/bi";
import Input from "../../../components/ui/Input";
//import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
//import {RegisterValidationSchema } from "../../../validation-schemas/user";
import { UserRegister } from "../../../types/user";
import { authStore } from "../../../store/authStore";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import Dropdown from "../../../components/ui/Dropdown";
import DatePicker from "../../../components/ui/DatePicker";

const Register: FC = () => {
  const { isLoading, mutate: registerMutation } = trpc.auth.register.useMutation();
  const { logIn } = authStore((state) => state);
  const navigate = useNavigate();

  const {
    register, //einai diko toy onoma den exei na kanei me to button 
    handleSubmit,// toy library
    formState: { errors },
    setValue
  } = useForm<UserRegister>({
    //resolver: yupResolver(RegisterValidationSchema),
    defaultValues: {
      username: "",
      password: "",
      passwordConfirmation: "",
      email: "",
      role: "",
      age: "",
    },
  });


  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setValue("role", e.target.value);


  }

  const handleAgeChange = (e: React.ChangeEvent<HTMLDataElement>) => {
    console.log(e.target.value);
    setValue("age", e.target.value);
  }

  const handleRegister = async (values: UserRegister) => {
    console.log("fae kaka" , values )
    registerMutation(
      {
        username: values.username,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
        email: values.email,
        role: values.role,
        age: values.age,
      },
      {
        onSuccess: (data: any) => {
          if (data.accessToken) {
            logIn({
              userId: data.id,
              username: data.username,
              token: data.accessToken,
              role: data.role,
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
  const options = [
  { value: 'Role', label: 'Role' },
  { value: 'Student', label: 'Student' },
  { value: 'Teacher', label: 'Teacher' },
  { value: 'Parent', label: 'Parent' },
];

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
        error={errors.passwordConfirmation?.message}
        name="paswwordConfirmation"
        register={register}
        placeholder="Confirm Password"
        type="password"
      />
      <Input
        error={errors.email?.message}
        name="email"
        register={register}
        placeholder="Email"
      />
      
      <Dropdown options={options}
        onChange={handleRoleChange}
      />
      <DatePicker
        onChange={handleAgeChange}
      />
      <Button type="submit" loading={isLoading} icon={BiRegistered} title="Register    " variant="primary" />
    </form>
  );
};


export default Register;
