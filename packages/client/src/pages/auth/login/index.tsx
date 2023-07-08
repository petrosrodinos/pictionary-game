import { FC } from "react";
import { trpc } from "../../../lib/trpc";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import { BiLogIn } from "react-icons/bi";

import "./style.scss";
import Input from "../../../components/ui/Input";

const Login: FC = () => {
  const { isLoading, mutate: loginMutation } = trpc.auth.login.useMutation();

  const handleLogin = async () => {
    loginMutation(
      {
        email: "petros@gmail.com",
        password: "123456",
      },
      {
        onSuccess: (data: any) => {
          console.log("login user", data);
          // trpcContext.auth.invalidate();
        },
        onError: (error: any) => {
          console.log("error", error.message);
        },
      }
    );
  };

  return (
    <div className="login-page-container">
      <Typography variant="sub-header-main">Login</Typography>
      <Input name="username" placeholder="@username" />
      <Input disabled={true} name="password" placeholder="Password" />
      <Button icon={BiLogIn} title="Login" variant="primary" />
    </div>
  );
};

export default Login;
