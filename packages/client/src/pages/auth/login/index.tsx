import { FC } from "react";
import { trpc } from "../../../lib/trpc";

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
    <div>
      <h1>login</h1>
      {isLoading && <div>loading...</div>}
      <button onClick={handleLogin}>login</button>
    </div>
  );
};

export default Login;
