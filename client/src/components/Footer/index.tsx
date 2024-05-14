import { FC } from "react";
import Typography from "../ui/Typography";
import "./style.scss";

const Footer: FC = () => {
  return (
    <div className="footer-container">
      <Typography>
        Developed by Rodinos Petros and Tsoudanis Eleftherios as bachelor thesis for Nile lab.
      </Typography>
    </div>
  );
};
export default Footer;
