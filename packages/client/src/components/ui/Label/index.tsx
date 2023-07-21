import { FC } from "react";
import "./style.scss";
import Typography from "../Typography";

interface LabelProps {
    value?: string;
    className?: string;
    style?: React.CSSProperties;
}

const Label: FC<LabelProps> = ({
    value,
    className = '',
    style
}) => {
    return (
        <div className={`label ${className}`} style={style}>
            <Typography variant="h1" className="labelTypo">{value}</Typography>
            
        </div>
    )
}

export default Label;