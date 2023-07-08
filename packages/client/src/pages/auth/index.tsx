import { FC, useState } from "react";
import { Link } from "react-router-dom";
import Typography from "../../components/ui/Typography";
import "./style.scss";

interface AuthPageProps {
  children: React.ReactNode;
}

const AuthPage: FC<AuthPageProps> = ({ children }) => {
  const [selectedOption, setSelectedOption] = useState<string>("login");
  return (
    <div className="auth-page-container">
      <div className="auth-page-content">
        <Link
          className={`auth-option ${selectedOption == "login" ? "selected" : ""}`}
          onClick={() => setSelectedOption("login")}
          to="/user/login"
        >
          <Typography>LOGIN</Typography>
        </Link>
        <Link
          className={`auth-option ${selectedOption == "register" ? "selected" : ""}`}
          onClick={() => setSelectedOption("register")}
          to="/user/register"
        >
          <Typography>REGISTER</Typography>
        </Link>
      </div>
      {children}
    </div>
  );
};

export default AuthPage;
