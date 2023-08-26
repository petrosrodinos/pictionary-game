import { FC } from "react";
import { ToastContainer } from "react-toastify";

const Toast: FC = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      draggable
      theme="colored"
    />
  );
};

export default Toast;
