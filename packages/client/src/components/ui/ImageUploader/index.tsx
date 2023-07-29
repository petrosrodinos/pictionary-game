import { FC, useState } from "react";
import "./style.scss";
import Typography from "../Typography";
import Avatar from "../Avatar";

interface ImageUploaderProps {
  value?: string;
  style?: React.CSSProperties;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
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
  const [avatarImage, setAvatarImage] = useState<any>("");

  const handleAvatarChange = async (e: any) => {
    const file: File = e.target?.files?.[0];
    console.log(file);
    const base64: any = await convertBase64(file);
    onChange && onChange(e);
    //console.log(base64);
    setAvatarImage(base64);
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
      <input
        name={name}
        className="inputFile"
        value={value}
        onChange={handleAvatarChange}
        type="file"
        id="file"
      />
      <Avatar image={avatarImage} />
      {error && <Typography className="avatar-error">{error}</Typography>}
    </div>
  );
};

export default ImageUploader;
// import { FC, useState, useRef } from "react";
// import styles from "./drop-zone.module.css";
// import Typography from "../Typography";
// import Avatar from "../Avatar";

// interface ImageUploaderProps {
//   value?: string;
//   style?: React.CSSProperties;
//   className?: string;
//   onChange: (files: FileList) => void;
//   error?: string;
// }

// const ImageUploader: FC<ImageUploaderProps> = ({
//   value,
//   style,
//   className = "",
//   onChange,
//   error,
// }) => {
//   const [avatarImage, setAvatarImage] = useState<string | ArrayBuffer | null>(
//     value || ""
//   );
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [isFileInputVisible, setFileInputVisible] = useState(true);

//   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file: File = e.target?.files?.[0];
//     console.log(file);

//     if (file) {
//       const base64: any = await convertBase64(file);
//       setAvatarImage(base64);
//       setFileInputVisible(false);
//     }

//     onChange && onChange(e.target.files);
//   };

//   const convertBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
//     return new Promise((resolve, reject) => {
//       const fileReader = new FileReader();
//       fileReader.readAsDataURL(file);
//       fileReader.onload = () => {
//         resolve(fileReader.result);
//       };
//       fileReader.onerror = (error) => {
//         reject(error);
//       };
//     });
//   };

//   const handleBannerClick = () => {
//     if (inputRef.current) {
//       inputRef.current.click();
//     }
//   };

//   const handleDrop = (files: FileList) => {
//     if (files.length > 0) {
//       handleAvatarChange({
//         target: { files },
//       } as React.ChangeEvent<HTMLInputElement>);
//     }
//   };

//   return (
//     <div className={`imageUploader ${className}`} style={style}>
//       <div className={styles.wrapper}>
//         <Banner onClick={handleBannerClick} onDrop={handleDrop} />
//         {isFileInputVisible && (
//           <input
//             className={`inputFile ${styles.input}`}
//             value={value}
//             onChange={handleAvatarChange}
//             type="file"
//             id="file"
//             ref={inputRef}
//           />
//         )}
//       </div>
//       {avatarImage && <Avatar image={avatarImage} />}
//       {error && <Typography className="input-error">{error}</Typography>}
//     </div>
//   );
// };

// export default ImageUploader;
