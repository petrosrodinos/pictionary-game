import { FC, useState } from "react";
import "./style.scss";
import Typography from "../Typography";
import Avatar from "../Avatar";

interface ImageUploaderProps {
  value: string;
  style?: React.CSSProperties;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  name?: string;
}

const ImageUploader: FC<ImageUploaderProps> = ({
  value,
  style,
  className = "",
  onChange,
  error,
  name,
}) => {
  const [avatarImage, setAvatarImage] = useState<any>(value || ""); // Δινω στο label την εικονα που εχει το Avatar
  const [isInputHidden, setIsInputHidden] = useState(false); // Τσεκαρω input και το κανω disable

  const handleAvatarChange = async (e: any) => {
    const file: File = e.target?.files?.[0];
    console.log(file);
    const base64: any = await convertBase64(file);

    setAvatarImage(base64);
    console.log(base64);

    // Τσεκαρω αν εχω input το κανω disable
    if (!isInputHidden) {
      setIsInputHidden(true);
    }

    const valueBase64 = base64.split(",")[1]; // Extract only the base64 part after the comma
    onChange({
      ...e,
      target: {
        ...e.target,
        value: valueBase64,
      },
    });
  };

  const convertBase64 = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <div className={`imageUploader ${className}`} style={style}>
      <label
        htmlFor="file"
        className={`avatar-label ${isInputHidden ? "" : "hidden"}`} //δινω αναλογο className αν εχω input η οχι για το css
      >
        <Avatar image={avatarImage} />
      </label>
      {!isInputHidden && (
        <input
          type="file"
          name={name}
          className={`inputFile `}
          value={value}
          onChange={handleAvatarChange}
          id="file"
          title=""
        />
      )}
      {error && <Typography className="avatar-error">{error}</Typography>}
    </div>
  );
};

export default ImageUploader;
