import { FC, useState, useRef, useEffect } from "react";
import Avatar from "../Avatar";
import Typography from "../Typography";
import { CiCamera } from "react-icons/ci";
import "./style.scss";
import { convertBase64 } from "../../../utils/image";

interface ImageUploaderProps {
  style?: React.CSSProperties;
  className?: string;
  onChange: ({ image, file }: ImagePickerOnChange) => void;
  name?: string;
  label?: string;
  value?: File | string;
}

export interface ImagePickerOnChange {
  image: string;
  file: File;
}

const ImagePicker: FC<ImageUploaderProps> = ({
  style,
  className = "",
  onChange,
  name,
  label,
  value,
}) => {
  const [avatarImage, setAvatarImage] = useState<string>();
  const inputFile = useRef<any>();

  useEffect(() => {
    if (value && typeof value == "object") {
      convertBase64(value).then((res) => {
        setAvatarImage(res);
      });
    } else if (value && typeof value == "string") {
      setAvatarImage(value);
    }
  }, [value]);

  const handleAvatarChange = async (e: any) => {
    const file: File = e.target?.files?.[0];
    const base64: any = await convertBase64(file);
    setAvatarImage(base64);
    onChange({
      image: base64,
      file,
    });
  };

  const handleImageClick = () => {
    inputFile?.current?.click();
  };

  return (
    <div className={`image-upload-container ${className}`} style={style}>
      <Typography variant="text-main" className="input-label avatar-label">
        {label}
      </Typography>
      {!avatarImage && (
        <div onClick={handleImageClick} className="image-picker">
          <CiCamera />
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

export default ImagePicker;
