import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import { useLocation } from "react-router-dom";
import TabMenu from "../../components/ui/TabMenu";
import "./style.scss";

interface AuthPageProps {
  children: React.ReactNode;
}

const AuthPage: FC<AuthPageProps> = ({ children }) => {
  const { pathname } = useLocation();
  const [selectedOption, setSelectedOption] = useState<string>("login");
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname.includes("register")) {
      setSelectedOption("register");
    } else {
      setSelectedOption("login");
    }
  }, []);

  const handleMenuChange = (data: { name: string; value: string }) => {
    setSelectedOption(data.value);
    navigate(`/user/${data.value}`);
  };

  return (
    <Container className="auth-page-container">
      <TabMenu
        selected={selectedOption}
        onChange={handleMenuChange}
        items={["login", "register"]}
        name="auth"
      />
      <div className="auth-content-container">{children}</div>
    </Container>
  );
};

export default AuthPage;
