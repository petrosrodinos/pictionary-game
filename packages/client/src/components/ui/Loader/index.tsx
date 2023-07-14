import { FC } from "react";
import "./style.scss";

interface LoaderProps {
  time: number;
}

const Loader: FC<LoaderProps> = () => {
  return <div className="loader-container"></div>;
};

export default Loader;
