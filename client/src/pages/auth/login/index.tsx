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
import { useTranslation } from "react-i18next";
import "./style.scss";

const Login: FC = () => {
  const { t } = useTranslation();
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
          if (data?.token) {
            logIn({
              userId: data._id,
              username: data.username,
              token: data.token,
              level: data.level,
              xp: data.xp,
              avatar: data.avatar,
              role: data.role,
            });
            navigate("/home");
          } else {
            toast.error(t("invalid-username"));
          }
        },
        onError: (error: any) => {
          if (error) {
            toast.error(error);
          } else {
            toast.error(t("could-not-login"));
          }
        },
      }
    );
  };

  return (
    <form className="login-page-container" onSubmit={handleSubmit(handleLogin)}>
      <Toast />
      <Typography variant="sub-header-main">{t("login-label")}</Typography>
      <Input
        label={t("username")}
        error={errors.username?.message}
        name="username"
        register={register}
        placeholder={t("@username")}
      />
      <Input
        label={t("password")}
        error={errors.password?.message}
        name="password"
        register={register}
        placeholder={t("password")}
        type="password"
      />
      <Button
        type="submit"
        loading={isLoading}
        icon={BiLogIn}
        title={t("login-label")}
        variant="primary"
      />
    </form>
  );
};

export default Login;
