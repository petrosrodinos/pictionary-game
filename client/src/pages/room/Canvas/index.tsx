import { FC, useState, useEffect, useRef } from "react";
import Typography from "../../../components/ui/Typography";
import DrawingOptions from "./DrawingOptions";
import { useTranslation } from "react-i18next";
import CanvasDraw from "react-canvas-draw";
import { BrushSizes } from "../../../constants/game";
import "./style.scss";

interface CanvasProps {
  word: string;
  currentUserIsPlaying: boolean;
  socket: any;
  canvasData: any[];
}

const Canvas: FC<CanvasProps> = ({ word, currentUserIsPlaying, canvasData, socket }) => {
  const ref = useRef<any>(null);
  const { t } = useTranslation();
  const [color, setColor] = useState<string>("#000");
  const [lineWidth, setLineWidth] = useState<number>(BrushSizes[0]);
  // const [saveData, setSaveData] = useState<any>(null);
  // const [canvasWidth, setCanvasWidth] = useState<number>(700);
  // const [canvasHeight, setCanvasHeight] = useState<number>(600);

  // useEffect(() => {
  //   const updateCanvasSize = () => {
  //     const canvasElement = ref.current?.parentNode as HTMLElement;
  //     if (canvasElement) {
  //       const { width, height } = canvasElement.getBoundingClientRect();
  //       setCanvasWidth(width);
  //       setCanvasHeight(height);
  //     }
  //   };

  //   window.addEventListener("resize", updateCanvasSize);
  //   updateCanvasSize();

  //   return () => {
  //     window.removeEventListener("resize", updateCanvasSize);
  //   };
  // }, []);

  useEffect(() => {
    ref.current?.clear();
  }, []);

  useEffect(() => {
    if (!canvasData || canvasData.length == 0) {
      ref.current?.clear();
    } else {
      ref.current?.loadSaveData(canvasData, true);
    }
  }, [canvasData]);

  useEffect(() => {
    const handler = (data: any) => {
      if (currentUserIsPlaying) return;
      if (data == null) {
        ref.current?.clear();
      } else {
        // setSaveData(data);
        ref.current?.loadSaveData(data, true);
      }
    };
    socket?.on("receive-changes", handler);

    return () => {
      socket?.off("receive-changes", handler);
    };
  }, [socket, currentUserIsPlaying]);

  const clearCanvas = () => {
    ref.current?.clear();
    socket?.emit("send-changes", null);
  };

  const handleChange = (canvas: any) => {
    // if (!currentUserIsPlaying) return;
    const data = canvas?.getSaveData();
    console.log(JSON.parse(data));
    socket?.emit("send-changes", data);
  };

  const handleFingerDraw = () => {};

  return (
    <div className="canvas-panel-container">
      {currentUserIsPlaying && (
        <>
          <div className="word-container">
            <Typography variant="text-accent" className="word-label">
              {t("word")}:
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
            onUndo={() => ref.current?.undo()}
          />
        </>
      )}
      {/*fucking bug on the component so i am doing it that way */}
      {currentUserIsPlaying ? (
        <CanvasDraw
          ref={ref}
          // saveData={saveData}
          hideGrid={true}
          brushRadius={lineWidth}
          backgroundColor="white"
          brushColor={color}
          className="canvas"
          canvasWidth={700}
          canvasHeight={600}
          onChange={handleChange}
        />
      ) : (
        <CanvasDraw
          ref={ref}
          // saveData={saveData}
          catenaryColor="white"
          disabled={true}
          hideGrid={true}
          brushRadius={0}
          backgroundColor="white"
          className="canvas"
          canvasWidth={700}
          canvasHeight={600}
        />
      )}
    </div>
  );
};

export default Canvas;
