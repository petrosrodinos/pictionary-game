import { FC, useState } from "react";
import "./style.scss";
import Typography from "../Typography";
import Avatar from "../Avatar";

interface ImageUploaderProps {
  style?: React.CSSProperties;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  name?: string;
}

const ImageUploader: FC<ImageUploaderProps> = ({
  style,
  className = "",
  onChange,
  error,
  name,
}) => {
  const [avatarImage, setAvatarImage] = useState<any>(""); // Δινω στο label την εικονα που εχει το Avatar
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

    onChange({
      ...e,
      target: {
        ...e.target,
        value: base64,
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

  const handleAvatarClick = () => {
    console.log("clicked");
  };

  return (
    <div className={`imageUploader ${className}`} style={style}>
      <label
        htmlFor="file"
        className={`avatar-label ${avatarImage ? "" : "hidden"}`}
        onClick={handleAvatarClick}
      >
        <Avatar image={avatarImage} />
      </label>
      {/* {!isInputHidden && ( */}
      <input
        type="file"
        name={name}
        className={`inputFile ${avatarImage ? "hidden" : ""}`}
        onChange={handleAvatarChange}
        id="file"
        title=""
      />
      {/* )} */}
      {error && <Typography className="avatar-error">{error}</Typography>}
    </div>
  );
};

export default ImageUploader;
