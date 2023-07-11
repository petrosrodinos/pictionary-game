import { FC, useState, useEffect } from "react";
import { useDraw } from "../../../hooks/useDraw";
import { ChromePicker } from "react-color";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "./style.scss";
import { API_URL } from "../../../constants";

interface CanvasProps {}

const Canvas: FC<CanvasProps> = ({}) => {
  const [color, setColor] = useState<string>("#000");
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState<any>();
  const { canvasRef, onMouseDown, clear, drawPixel } = useDraw({ color, emitEvent });

  useEffect(() => {
    const s = io(`${API_URL}`);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null) return;

    const handler = (delta: any) => {
      drawPixel(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket]);

  function emitEvent(data: any) {
    if (!socket) return;
    socket.emit("send-changes", data);
  }

  useEffect(() => {
    if (socket == null) return;

    socket.emit("get-document", documentId);
  }, [socket, documentId]);

  // useEffect(() => {
  //   if (socket == null) return;

  //   const interval = setInterval(() => {
  //     socket.emit("save-document", "");
  //   }, 5000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [socket]);

  return (
    <div className="canvas-container">
      {/* <div className="canvas-color-picker"> */}
      {/* <ChromePicker color={color} onChange={(e) => setColor(e.hex)} /> */}
      {/* </div> */}
      <canvas
        width={840}
        height={700}
        ref={canvasRef}
        onMouseDown={onMouseDown}
        className="canvas"
      />
    </div>
  );
};

export default Canvas;
