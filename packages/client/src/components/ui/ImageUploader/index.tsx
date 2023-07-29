import { FC,useState } from "react";
import "./style.scss";
import Typography from "../Typography";
import Avatar   from "../Avatar";

interface ImageUploaderProps {
    value?: string;
    style?: React.CSSProperties;
    className?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    Image: string;
}


const ImageUploader: FC<ImageUploaderProps> = ({
    value,
    style,
    className = '',
    onChange,
    error,
    //Image,
  


}) => {
    const [avatarImage, setAvatarImage] = useState<any>('');
  

    const handleAvatarChange = async (e: any ) => {
      
      //setValue("avatar", e.target.value);
      const file : File = e.target?.files?.[0];
      console.log(file);
        const base64: any = await convertBase64(file)
        onChange && onChange(e);
      console.log(base64);
      //setValue(base64,e.target.image)
      setAvatarImage(base64);
    };

  const convertBase64 = (file : File) : Promise<any> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (() => {
        resolve(fileReader.result);
      });
      fileReader.onerror = ((error) => {
        reject(error);
      });
    });
  };
  
    return (
        <div className={`imageUploader ${className}`} style={style}> 
            <input
                value={value}
                onChange={handleAvatarChange}
                type="file" id="file" />
            {/* <img src={Image } className="avatar-image"></img> */}
            <Avatar image={avatarImage} />
            {error && <Typography className="input-error">{error}</Typography>}
        </div>


    );


}

export default ImageUploader;