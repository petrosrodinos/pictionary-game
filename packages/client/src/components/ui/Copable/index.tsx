import { FC, useState } from "react";
import { Tooltip } from "react-tooltip";
import "./style.scss";

interface CopableProps {
  value: string;
  children: any;
}

const Copable: FC<CopableProps> = ({ value, children }) => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <span className="copable-item" data-tooltip-id="copable-tooltip" onClick={handleClick}>
      {children}
      <Tooltip id="copable-tooltip" place="bottom" content={copied ? "Copied!" : "Click to copy"} />
    </span>
  );
};

export default Copable;
