import { FC, useState, useEffect, useRef } from "react";
import Typography from "../../../components/ui/Typography";
import DrawingOptions from "./DrawingOptions";
import { useTranslation } from "react-i18next";
import CanvasDraw from "react-canvas-draw";
import { BrushSizes } from "../../../constants/game";
import * as handTrack from "handtrackjs";
import "./style.scss";

const modelParams = {
  flipHorizontal: true,
  maxNumBoxes: 1,
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
  const ref = useRef<any>(null);
  const { t } = useTranslation();
  const [color, setColor] = useState<string>("#000");
  const [lineWidth, setLineWidth] = useState<number>(BrushSizes[0]);
  const videoRef = useRef<any>(null);
  let isDrawing = false;
  let model: any = null;
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

  // useEffect(() => {
  //   const video = videoRef.current;
  //   const canvas: any = ref.current;
  //   if (!canvas) return;
  //   const context = canvas.getContext("2d");

  //   handTrack.load(modelParams).then((loadedModel: any) => {
  //     model = loadedModel;

  //     handTrack.startVideo(video).then((status: any) => {
  //       if (status) {
  //         const drawLoop = () => {
  //           model.detect(video).then((predictions: any) => {
  //             if (predictions.length > 0) {
  //               const hand = predictions[0].bbox;
  //               const [x, y, width, height] = hand;
  //               console.log("x", x, "y", y, width, height);
  //               // drawPixel({ x: x + width / 2, y: y + height / 2 });
  //             } else {
  //               isDrawing = false;
  //             }
  //             requestAnimationFrame(drawLoop);
  //           });
  //         };

  //         drawLoop();
  //       }
  //     });
  //   });

  //   return () => {
  //     if (video && video.srcObject) {
  //       video.pause();
  //       video.srcObject.getTracks().forEach((track: any) => track.stop());
  //     }
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
      <video ref={videoRef} width="1030" height="900" style={{ display: "none" }}></video>
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
