import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import { BiLogIn } from "react-icons/bi";
import Input from "../../../components/ui/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LoginValidationSchema } from "../../../validation-schemas/user";
import { authStore } from "../../../store/authStore";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { loginUser } from "../../../services/auth";
import "./style.scss";

const Login: FC = () => {
  const { logIn } = authStore((state) => state);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLogin>({
    resolver: yupResolver(LoginValidationSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate: loginMutation, isLoading } = useMutation((user: UserLogin) => {
    return loginUser(user);
  });

  const handleLogin = async (values: UserLogin) => {
    loginMutation(
      {
        username: values.username,
        password: values.password,
      },
      {
        onSuccess: (data: any) => {
          console.log(data);
          if (data?.token) {
            logIn({
              userId: data.id,
              username: data.username,
              token: data.token,
              level: data.level,
              points: data.points,
            });
            navigate("/home");
          } else {
            alert("Invalid username or password");
          }
        },
        onError: (error: any) => {
          alert(error.message);
        },
      }
    );
  };

  return (
    <form className="login-page-container" onSubmit={handleSubmit(handleLogin)}>
      <Typography variant="sub-header-main">Login</Typography>
      <Input
        error={errors.username?.message}
        name="username"
        register={register}
        placeholder="@username"
      />
      <Input
        error={errors.password?.message}
        name="password"
        register={register}
        placeholder="Password"
        type="password"
      />
      <Button type="submit" loading={isLoading} icon={BiLogIn} title="Login" variant="primary" />
    </form>
  );
};

export default Login;
