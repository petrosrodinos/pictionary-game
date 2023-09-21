import { CSSProperties, FC } from "react";
import { PacmanLoader, ClipLoader } from "react-spinners";

interface SpinnerProps {
  loading: boolean;
  style?: CSSProperties;
  size?: number;
  variant?: "primary" | "secondary";
  color?: string;
}

const Spinner: FC<SpinnerProps> = ({
  loading,
  style,
  size = 40,
  variant = "primary",
  color = "#eac7c7",
}) => {
  const override: CSSProperties = {
    margin: "0 auto",
  };

  const Loader: any = {
    primary: PacmanLoader,
    secondary: ClipLoader,
  };

  const LoaderComponent = Loader[variant];

  return (
    <LoaderComponent
      color={color}
      loading={loading}
      cssOverride={{ ...override, ...style }}
      size={size}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Spinner;
