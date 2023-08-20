import { FC, useState, useEffect } from "react";
import { useDraw } from "../../../hooks/useDraw";
import Typography from "../../../components/ui/Typography";
import "./style.scss";
import DrawingOptions from "./DrawingOptions";

interface CanvasProps {
  word: string;
  currentUserIsPlaying: boolean;
  socket: any;
  canvasData: any[];
}

const Canvas: FC<CanvasProps> = ({ word, currentUserIsPlaying, canvasData, socket }) => {
  const [color, setColor] = useState<string>("#000");
  const [canvasWidth, setCanvasWidth] = useState(1030);
  const [canvasHeight, setCanvasHeight] = useState(900);
  const { canvasRef, onMouseDown, clear, drawPixel } = useDraw({
    color,
    emitEvent,
    currentUserIsPlaying,
  });

  useEffect(() => {
    const updateCanvasSize = () => {
      const canvasElement = canvasRef.current?.parentNode as HTMLElement;
      if (canvasElement) {
        const { width, height } = canvasElement.getBoundingClientRect();
        setCanvasWidth(width);
        setCanvasHeight(height);
      }
    };

    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    if (!canvasData || canvasData.length == 0) {
      clear();
    }
    canvasData?.forEach((data) => {
      drawPixel(data);
    });
  }, [canvasData]);

  useEffect(() => {
    const handler = (delta: any) => {
      drawPixel(delta);
    };
    socket?.on("receive-changes", handler);

    return () => {
      socket?.off("receive-changes", handler);
    };
  }, [socket]);

  function emitEvent(data: any) {
    socket?.emit("send-changes", data);
  }

  const handleFingerDraw = () => {};

  return (
    <div className="canvas-panel-container">
      {currentUserIsPlaying && (
        <>
          <div className="word-container">
            <Typography variant="text-accent" className="word-label">
              WORD:
            </Typography>
            <Typography variant="small-text-main" className="word-text">
              {word}
            </Typography>
          </div>
          <DrawingOptions
            color={color}
            onColorChange={setColor}
            onClear={clear}
            onFingerDraw={handleFingerDraw}
          />
        </>
      )}

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
