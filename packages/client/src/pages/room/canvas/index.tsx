import { FC, useState, useEffect, useRef } from "react";
import { useDraw } from "../../../hooks/useDraw";
import Typography from "../../../components/ui/Typography";
import DrawingOptions from "./DrawingOptions";
import "./style.scss";
import * as handTrack from "handtrackjs";

const modelParams = {
  flipHorizontal: true,
  maxNumBoxes: 1, // only one hand will be tracked for drawing
  iouThreshold: 0.5,
  scoreThreshold: 0.7,
};

interface CanvasProps {
  word: string;
  currentUserIsPlaying: boolean;
  socket: any;
  canvasData: any[];
}

const Canvas: FC<CanvasProps> = ({ word, currentUserIsPlaying, canvasData, socket }) => {
  const [color, setColor] = useState<string>("#000");
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [canvasWidth, setCanvasWidth] = useState(1030);
  const [canvasHeight, setCanvasHeight] = useState(900);
  const videoRef = useRef<any>(null);
  let isDrawing = false;
  let model: any = null;

  const { canvasRef, onMouseDown, clear, drawPixel } = useDraw({
    color,
    lineWidth,
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
    const video = videoRef.current;
    const canvas: any = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");

    handTrack.load(modelParams).then((loadedModel: any) => {
      model = loadedModel;

      handTrack.startVideo(video).then((status: any) => {
        if (status) {
          const drawLoop = () => {
            model.detect(video).then((predictions: any) => {
              if (predictions.length > 0) {
                const hand = predictions[0].bbox;
                const [x, y, width, height] = hand;
                console.log("x", x, "y", y, width, height);
                drawPixel({ x: x + width / 2, y: y + height / 2 });
              } else {
                isDrawing = false;
              }
              requestAnimationFrame(drawLoop);
            });
          };

          drawLoop();
        }
      });
    });

    return () => {
      if (video && video.srcObject) {
        video.pause();
        video.srcObject.getTracks().forEach((track: any) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const handler = (data: any) => {
      if (data == null) {
        clear();
      } else {
        drawPixel(data);
      }
    };
    socket?.on("receive-changes", handler);

    return () => {
      socket?.off("receive-changes", handler);
    };
  }, [socket]);

  function emitEvent(data: any) {
    socket?.emit("send-changes", data);
  }

  const clearCanvas = () => {
    socket?.emit("send-changes", null);
    clear();
  };

  const handleFingerDraw = () => {};

  return (
    <div className="canvas-panel-container">
      {true && (
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
            brushSize={lineWidth}
            onColorChange={setColor}
            onBrashSizeChange={setLineWidth}
            onClear={clearCanvas}
            onFingerDraw={handleFingerDraw}
          />
        </>
      )}
      <video ref={videoRef} width="1030" height="900" style={{ display: "none" }}></video>
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
