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
import { loginUser } from "../../../services/user";
import { UserLogin } from "../../../interfaces/typing";
import { toast } from "react-toastify";
import Toast from "../../../components/ui/Toast";
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

  const { mutate: loginMutation, isLoading } = useMutation(
    (user: UserLogin) => {
      return loginUser(user);
    }
  );

  const handleLogin = async (values: UserLogin) => {
    loginMutation(
      {
        username: values.username,
        password: values.password,
      },
      {
        onSuccess: (data: any) => {
          if (data?.token) {
            logIn({
              userId: data.id,
              username: data.username,
              token: data.token,
              level: data.level,
              xp: data.xp,
              avatar: data.avatar,
            });
            navigate("/home");
          } else {
            toast.error("Invalid username or password");
          }
        },
        onError: (error: any) => {
          if (error) {
            toast.error(error);
          } else {
            toast.error("Could not login, please try later");
          }
        },
      }
    );
  };

  return (
    <form className="login-page-container" onSubmit={handleSubmit(handleLogin)}>
      <Toast />
      <Typography variant="sub-header-main">Login</Typography>
      <Input
        label="Username"
        error={errors.username?.message}
        name="username"
        register={register}
        placeholder="@username"
      />
      <Input
        label="Password"
        error={errors.password?.message}
        name="password"
        register={register}
        placeholder="Password"
        type="password"
      />
      <Button
        type="submit"
        loading={isLoading}
        icon={BiLogIn}
        title="Login"
        variant="primary"
      />
    </form>
  );
};

export default Login;
