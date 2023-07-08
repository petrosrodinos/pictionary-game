import { FC } from "react";
import { trpc } from "../../../lib/trpc";
import "./style.scss";
import Typography from "../../../components/ui/Typography";

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
        onError: (error) => {
          console.log("error", error.message);
        },
      }
    );
  };

  return (
    <div className="login-page-container">
      <Typography variant="sub-header-main">Login</Typography>
      {isLoading && <div>loading...</div>}
      <button onClick={handleLogin}>login</button>
    </div>
  );
};

export default Login;
