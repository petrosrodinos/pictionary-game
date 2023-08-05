import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Typography from "../../components/ui/Typography";
import Container from "../../components/Container";
import { useLocation } from "react-router-dom";
import "./style.scss";

interface AuthPageProps {
  children: React.ReactNode;
}

const AuthPage: FC<AuthPageProps> = ({ children }) => {
  const { pathname } = useLocation();
  const [selectedOption, setSelectedOption] = useState<string>("login");

  useEffect(() => {
    if (pathname.includes("register")) {
      setSelectedOption("register");
    } else {
      setSelectedOption("login");
    }
  }, []);

  return (
    <Container className="auth-page-container">
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
    </Container>
  );
};

export default AuthPage;
