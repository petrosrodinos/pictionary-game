import { FC } from "react";
import { trpc } from "../../../lib/trpc";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import { BsPerson } from "react-icons/bs";
import "./style.scss";

const Login: FC = () => {
  const { isLoading, mutate: registerMutation } = trpc.auth.register.useMutation();
  const trpcContext = trpc.useContext();

  const handleRegister = async () => {
    registerMutation(
      {
        password: "123456",
        username: "rodinos",
      },
      {
        onSuccess: (data: any) => {
          console.log("created user", data);
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
      <div className="login-container">
        <Typography variant="sub-header-main">Register</Typography>
        <Button onClick={handleRegister} icon={BsPerson} title="Register" variant="primary" />
      </div>
    </div>
  );
};

export default Login;
