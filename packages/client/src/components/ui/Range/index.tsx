import { FC, useState } from "react";
import { Range as RangePicker } from "react-range";
import "./style.scss";

interface RangeProps {
  min: number;
  max: number;
  step: number;
  values: number[];
  onChange: (values: number[]) => void;
}

const Range: FC<RangeProps> = ({ min, max, step, values, onChange }) => {
  const [rangeValues, setRangeValues] = useState(values);

  const handleChange = (values: number[]) => {
    setRangeValues(values);
    onChange(values);
  };
  return (
    <RangePicker
      step={step}
      min={min}
      max={max}
      values={rangeValues}
      onChange={handleChange}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          className="range-track"
          style={{
            ...props.style,
          }}
        >
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        <div
          {...props}
          className="range-thumb"
          style={{
            ...props.style,
          }}
        />
      )}
    />
  );
};

export default Range;
