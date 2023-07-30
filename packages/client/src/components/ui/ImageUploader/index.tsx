// import { FC, useState } from "react";
// import "./style.scss";
// import Typography from "../Typography";
// import Avatar from "../Avatar";

// interface ImageUploaderProps {
//   value?: string;
//   style?: React.CSSProperties;
//   className?: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   error?: string;
//   name?: string;
// }

// const ImageUploader: FC<ImageUploaderProps> = ({
//   value,
//   style,
//   className = "",
//   onChange,
//   error,
//   name,
// }) => {
//   const [avatarImage, setAvatarImage] = useState<any>("");

//   const handleAvatarChange = async (e: any) => {
//     const file: File = e.target?.files?.[0];
//     console.log(file);
//     const base64: any = await convertBase64(file);
//     onChange && onChange(e);
//     //console.log(base64);
//     setAvatarImage(base64);
//   };

//   const convertBase64 = (file: File): Promise<any> => {
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

//   return (
//     <div className={`imageUploader ${className}`} style={style}>
//       <input
//         name={name}
//         className="inputFile"
//         value={value}
//         onChange={handleAvatarChange}
//         type="file"
//         id="file"
//       />
//       <Avatar image={avatarImage} />
//       {error && <Typography className="avatar-error">{error}</Typography>}
//     </div>
//   );
// };

// export default ImageUploader;

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
  const [avatarImage, setAvatarImage] = useState<any>(value || ""); // Set the initial value of avatarImage to the provided value prop

  const handleAvatarChange = async (e: any) => {
    const file: File = e.target?.files?.[0];
    console.log(file);
    const base64: any = await convertBase64(file);
    onChange && onChange(e);
    setAvatarImage(base64);

    // Update the value prop with the base64 value
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
