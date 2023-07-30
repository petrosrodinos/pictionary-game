import { FC, useState, useEffect } from "react";
import { useDraw } from "../../../hooks/useDraw";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { API_BASE_URL } from "../../../constants";
import Typography from "../../../components/ui/Typography";
import "./style.scss";

interface CanvasProps {
  word: string;
  currentUserIsPlaying: boolean;
}

const Canvas: FC<CanvasProps> = ({ word, currentUserIsPlaying }) => {
  const [color, setColor] = useState<string>("#000");
  const [canvasWidth, setCanvasWidth] = useState(1030);
  const [canvasHeight, setCanvasHeight] = useState(900);
  const { id: roomId } = useParams();
  const [socket, setSocket] = useState<any>();
  const { canvasRef, onMouseDown, clear, drawPixel } = useDraw({ color, emitEvent });

  useEffect(() => {
    const updateCanvasSize = () => {
      const canvasElement = canvasRef.current?.parentNode as HTMLElement;
      if (canvasElement) {
        const { width, height } = canvasElement.getBoundingClientRect();
        setCanvasWidth(width);
        setCanvasHeight(height * 0.96);
      }
    };

    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    const s = io(`${API_BASE_URL}`);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   if (socket == null) return;

  //   socket.emit("join-room", documentId);
  // }, [socket, documentId]);

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

  return (
    <div className="canvas-panel-container">
      {/* {currentUserIsPlaying && (
        <div className="word-container">
          <Typography variant="text-accent" className="word-label">
            WORD:
          </Typography>
          <Typography variant="small-text-main" className="word-text">
            {word}
          </Typography>
        </div>
      )} */}
      {/* <div className="canvas-tools">
        <div className="canvas-tools-content"></div>
      </div> */}
      {/* <div className="canvas-container"> */}
      <div
        // width={canvasWidth}
        // height={canvasHeight}
        ref={canvasRef}
        onMouseDown={onMouseDown}
        className="canvas"
      ></div>
    </div>
  );
};

export default Canvas;
