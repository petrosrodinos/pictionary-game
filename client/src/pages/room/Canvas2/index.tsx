import { FC, useState, useEffect, useRef } from "react";
import Typography from "../../../components/ui/Typography";
import DrawingOptions from "../Canvas/DrawingOptions";
import { useTranslation } from "react-i18next";
import CanvasDraw from "react-canvas-draw";
import { BrushSizes } from "../../../constants/game";
import { useCanvas } from "../../../hooks/useCanvas";
import "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";
import * as handpose from "@tensorflow-models/handpose";

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
  const webcamRef = useRef<any>(null);
  const { canvasRef, startDrawing, finishDrawing, draw, handDraw, isDrawing, setIsDrawing } =
    useCanvas();
  const prevPositionRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    ref.current?.clear();
  }, []);

  useEffect(() => {
    runHandpose();
  }, []);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    setInterval(() => {
      detect(net);
    }, 400);
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

      const hand = await net.estimateHands(video);
      if (hand.length > 0) {
        console.log("Hand detected");

        const fingerTip = hand[0].annotations.indexFinger[3];

        let relativeX = (fingerTip[0] / videoWidth) * 700;
        let relativeY = (fingerTip[1] / videoHeight) * 600;

        // Averaging
        relativeX = (relativeX + prevPositionRef.current.x) / 2;
        relativeY = (relativeY + prevPositionRef.current.y) / 2;
        relativeX = Math.round(relativeX);
        relativeY = Math.round(relativeY);
        prevPositionRef.current = { x: relativeX, y: relativeY };
        handDraw(relativeX, relativeY);
      } else {
        if (isDrawing) {
          finishDrawing();
          setIsDrawing(false);
        }
      }
    }
  };

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
      <canvas
        width={700}
        height={600}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
        className="canvas"
      />
    </div>
  );
};

export default Canvas;
