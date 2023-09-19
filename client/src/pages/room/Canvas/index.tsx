import { FC, useState, useEffect, useRef } from "react";
import Typography from "../../../components/ui/Typography";
import DrawingOptions from "./DrawingOptions";
import { useTranslation } from "react-i18next";
import CanvasDraw from "react-canvas-draw";
import { BrushSizes } from "../../../constants/game";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import { drawHand } from "./utilities";
import "@tensorflow/tfjs-backend-webgl";
import "./style.scss";

interface CanvasProps {
  word: string;
  currentUserIsPlaying: boolean;
  socket: any;
  canvasData: any[];
}

const Canvas: FC<CanvasProps> = ({ word, currentUserIsPlaying, canvasData, socket }) => {
  const webcamRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const ref = useRef<any>(null);
  const { t } = useTranslation();
  const [color, setColor] = useState<string>("#000");
  const [lineWidth, setLineWidth] = useState<number>(BrushSizes[0]);
  const currentLineRef = useRef<{ brushColor: string; brushRadius: number; points: any[] }>({
    brushColor: color,
    brushRadius: lineWidth,
    points: [],
  });
  const [isDrawing, setIsDrawing] = useState(false);
  let drawTimeout: any = null;

  useEffect(() => {
    runHandpose();
  }, []);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    setInterval(() => {
      detect(net);
    }, 50);
  };

  const detect = async (net: any) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);
      if (hand.length > 0) {
        console.log("Hand detected");

        const fingerTip = hand[0].annotations.indexFinger[3];
        const relativeX = (fingerTip[0] / videoWidth) * 700;
        const relativeY = (fingerTip[1] / videoHeight) * 600;

        currentLineRef.current.points.push({ x: relativeX, y: relativeY });

        setIsDrawing(true);

        if (drawTimeout) clearTimeout(drawTimeout);

        drawTimeout = setTimeout(() => {
          commitDrawingToCanvas();
        }, 2000);
      }
      // Draw mesh
      // const ctx = canvasRef.current.getContext("2d");
      // drawHand(hand, ctx);
    }
  };

  const commitDrawingToCanvas = () => {
    if (currentLineRef.current.points.length > 0) {
      const existingData = ref.current
        ? JSON.parse(ref.current.getSaveData())
        : { width: 700, height: 600, lines: [] };
      existingData.lines.push(currentLineRef.current);
      ref.current?.loadSaveData(JSON.stringify(existingData));

      // Clear currentLineRef
      currentLineRef.current = {
        brushColor: color,
        brushRadius: lineWidth,
        points: [],
      };
    }
  };

  useEffect(() => {
    console.log("drawing", isDrawing);
  }, [isDrawing]);

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
      {true && (
        <>
          <Webcam
            ref={webcamRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 9,
              width: 200,
              height: 200,
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 9,
              width: 200,
              height: 200,
            }}
          />
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

      <CanvasDraw
        ref={ref}
        hideGrid={true}
        brushRadius={currentUserIsPlaying ? lineWidth : 0}
        backgroundColor="white"
        brushColor={currentUserIsPlaying ? color : "white"}
        className="canvas"
        canvasWidth={700}
        canvasHeight={600}
        onChange={currentUserIsPlaying ? handleChange : undefined}
        disabled={!currentUserIsPlaying}
        catenaryColor={currentUserIsPlaying ? undefined : "white"}
      />
    </div>
  );
};

export default Canvas;
