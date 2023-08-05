import { FC, useState, useRef } from "react";
import Avatar from "../Avatar";
import Typography from "../Typography";
import { BsPersonAdd } from "react-icons/bs";
import "./style.scss";

interface ImageUploaderProps {
  style?: React.CSSProperties;
  className?: string;
  onChange: (image: string) => void;
  name?: string;
  label?: string;
}

const ImageUploader: FC<ImageUploaderProps> = ({
  style,
  className = "",
  onChange,
  name,
  label,
}) => {
  const [avatarImage, setAvatarImage] = useState<any>("");
  const inputFile = useRef<any>();

  const handleAvatarChange = async (e: any) => {
    const file: File = e.target?.files?.[0];
    const base64: any = await convertBase64(file);
    setAvatarImage(base64);
    onChange(base64);
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

  const handleImageClick = () => {
    inputFile?.current?.click();
  };

  return (
    <div className={`image-upload-container ${className}`} style={style}>
      <Typography className="avatar-label">{label}</Typography>
      {!avatarImage && (
        <div onClick={handleImageClick} className="image-picker">
          <BsPersonAdd />
        </div>
      )}
      {avatarImage && (
        <Avatar onClick={handleImageClick} className="image-preview" image={avatarImage} />
      )}
      <input
        ref={inputFile}
        type="file"
        name={name}
        className="inputFile"
        onChange={handleAvatarChange}
      />
    </div>
  );
};

export default ImageUploader;
