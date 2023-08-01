import { FC, useState, useEffect } from "react";
import { useDraw } from "../../../hooks/useDraw";
import { useParams } from "react-router-dom";
import Typography from "../../../components/ui/Typography";
import { useSocket } from "../../../hooks/socket";
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
  const { canvasRef, onMouseDown, clear, drawPixel } = useDraw({ color, emitEvent });
  const { socket } = useSocket();

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
      {currentUserIsPlaying && (
        <div className="word-container">
          <Typography variant="text-accent" className="word-label">
            WORD:
          </Typography>
          <Typography variant="small-text-main" className="word-text">
            {word}
          </Typography>
        </div>
      )}
      <div className="canvas-tools">
        <div className="canvas-tools-content"></div>
      </div>
      <canvas
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasRef}
        onMouseDown={onMouseDown}
        className="canvas"
      ></canvas>
    </div>
  );
};

export default Canvas;
