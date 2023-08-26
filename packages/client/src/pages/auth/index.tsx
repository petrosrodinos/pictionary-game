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
    navigate(`/${data.value}`);
  };

  const authOptions = [
    {
      label: "login",
      value: "login",
    },
    {
      label: "register",
      value: "register",
    },
  ];

  return (
    <Container className="auth-page-container">
      <TabMenu
        className="auth-tab-menu"
        selected={selectedOption}
        onChange={handleMenuChange}
        items={authOptions}
        name="auth"
      />
      <div className="auth-content-container">{children}</div>
    </Container>
  );
};

export default AuthPage;
