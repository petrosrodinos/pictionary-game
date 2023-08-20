import { CSSProperties, FC } from "react";
import { MoonLoader } from "react-spinners";

interface SpinnerProps {
  loading: boolean;
}

const Spinner: FC<SpinnerProps> = ({ loading }) => {
  const override: CSSProperties = {
    margin: "0 auto",
  };
  return (
    <MoonLoader
      color="#eac7c7"
      loading={loading}
      cssOverride={override}
      size={40}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Spinner;
