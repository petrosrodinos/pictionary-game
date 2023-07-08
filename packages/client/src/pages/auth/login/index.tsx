import { FC } from "react";
import { trpc } from "../../../lib/trpc";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import { BiLogIn } from "react-icons/bi";
import Input from "../../../components/ui/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LoginValidationSchema } from "../../../validation-schemas/user";
import { UserLogin } from "../../../types/user";
import { authStore } from "../../../store/authStore";
import { useNavigate } from "react-router-dom";
import "./style.scss";

const Login: FC = () => {
  const { isLoading, mutate: loginMutation } = trpc.auth.login.useMutation();
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

  const handleLogin = async (values: UserLogin) => {
    loginMutation(
      {
        username: values.username,
        password: values.password,
      },
      {
        onSuccess: (data: any) => {
          if (data.accessToken) {
            logIn({
              userId: data.id,
              username: data.username,
              token: data.accessToken,
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

  return (
    <div>
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
        />
        <Button type="submit" loading={isLoading} icon={BiLogIn} title="Login" variant="primary" />
      </form>
    </div>
  );
};

export default Login;
