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

type Point = {
  x: number;
  y: number;
};

type Line = {
  brushColor: string;
  brushRadius: number;
  points: Point[];
};

const Canvas: FC<CanvasProps> = ({ word, currentUserIsPlaying, canvasData, socket }) => {
  const ref = useRef<any>(null);
  const { t } = useTranslation();
  const [color, setColor] = useState<string>("#000");
  const [lineWidth, setLineWidth] = useState<number>(BrushSizes[0]);
  const [fingerDrawing, setFingerDrawing] = useState<boolean>(false);
  const currentLine = useRef<Line>({
    brushColor: color,
    brushRadius: lineWidth,
    points: [],
  });
  const videoRef = useRef<any>(null);
  let isDrawing = false;
  let model: any = null;
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
    currentLine.current = {
      ...currentLine.current,
      brushColor: color,
      brushRadius: lineWidth,
    };
  }, [color, lineWidth]);

  useEffect(() => {
    const video = videoRef.current;
    if (!fingerDrawing) {
      if (video && video.srcObject) {
        video.pause();
        video.srcObject.getTracks().forEach((track: any) => track.stop());
      }
      return;
    }
    const canvas: any = ref.current;
    if (!canvas || !video) return;

    handTrack.load(modelParams).then((model: any) => {
      handTrack.startVideo(video).then((status: any) => {
        if (status) {
          const drawLoop = () => {
            model.detect(video).then((predictions: any) => {
              if (predictions.length > 0) {
                const hand = predictions[0].bbox;
                const [x, y, width, height] = hand;
                if (height < 500) {
                  isDrawing = true;
                  console.log(x + width / 2, y + height / 2);
                  currentLine.current = {
                    ...currentLine.current,
                    points: [
                      ...currentLine.current.points,
                      { x: x + width / 2, y: y + height / 2 },
                    ],
                  };
                  // const existingData = JSON.parse(ref.current.getSaveData());
                  // existingData.lines.push(currentLine.current);
                  // ref.current.loadSaveData(JSON.stringify(existingData));
                } else {
                  if (isDrawing) {
                    isDrawing = false;
                    const existingData = JSON.parse(ref.current.getSaveData());
                    existingData.lines.push(currentLine.current);
                    ref.current.loadSaveData(JSON.stringify(existingData));

                    currentLine.current = {
                      brushColor: color,
                      brushRadius: lineWidth,
                      points: [],
                    };

                    // socket?.emit("send-changes", existingData);
                  }
                }
              } else {
                if (isDrawing) {
                  isDrawing = false;

                  const existingData = JSON.parse(ref.current.getSaveData());
                  existingData.lines.push(currentLine.current);
                  // ref.current.loadSaveData(JSON.stringify(existingData));

                  currentLine.current = {
                    brushColor: color,
                    brushRadius: lineWidth,
                    points: [],
                  };

                  // socket?.emit("send-changes", existingData);
                }
              }
            });

            requestAnimationFrame(drawLoop);
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
  }, [fingerDrawing]);

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
    // console.log(JSON.parse(data));
    socket?.emit("send-changes", data);
  };

  const handleFingerDraw = () => {
    setFingerDrawing((prev) => !prev);
  };

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
      <video
        ref={videoRef}
        width="1000"
        height="1000"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      ></video>
      {currentUserIsPlaying ? (
        <CanvasDraw
          ref={ref}
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
          catenaryColor="white"
          disabled={true}
          hideGrid={true}
          brushRadius={0}
          backgroundColor="white"
          className="canvas"
          canvasWidth={700}
          canvasHeight={600}
          lazyRadius={0}
        />
      )}
    </div>
  );
};

export default Canvas;
