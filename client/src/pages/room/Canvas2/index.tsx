import { FC, useState, useEffect, useRef } from "react";
import Typography from "../../../components/ui/Typography";
import DrawingOptions from "../Canvas/DrawingOptions";
import { useTranslation } from "react-i18next";
import { BrushSizes } from "../../../constants/game";
import { useCanvas } from "../../../hooks/useCanvas";
import "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";
import * as handpose from "@tensorflow-models/handpose";

interface CanvasProps {
  word: string;
  currentUserIsPlaying: boolean;
  socket: any;
  canvasData: string;
}

const Canvas: FC<CanvasProps> = ({ word, currentUserIsPlaying, canvasData, socket }) => {
  const ref = useRef<any>(null);
  const { t } = useTranslation();
  const [color, setColor] = useState<string>("#000");
  const [lineWidth, setLineWidth] = useState<number>(BrushSizes[0]);
  const webcamRef = useRef<any>(null);
  const {
    canvasRef,
    startDrawing,
    finishDrawing,
    draw,
    handDraw,
    isDrawing,
    setIsDrawing,
    clearCanvas: clear,
  } = useCanvas(sendChanges);
  const prevPositionRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    clear();
  }, []);

  useEffect(() => {
    // runHandpose();
  }, []);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    setInterval(() => {
      detect(net);
    }, 100);
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
        const fingerTip = hand[0].annotations.indexFinger[3];

        let relativeX = (fingerTip[0] / videoWidth) * 700;
        let relativeY = (fingerTip[1] / videoHeight) * 600;

        relativeX = (relativeX + prevPositionRef.current.x) / 2;
        relativeY = (relativeY + prevPositionRef.current.y) / 2;
        relativeX = Math.round(relativeX);
        relativeY = Math.round(relativeY);

        prevPositionRef.current = { x: relativeX, y: relativeY };
        handDraw({ offsetX: relativeX, offsetY: relativeY });
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
      clear();
    } else {
      clear();
      JSON.parse(canvasData).map((data: any) => {
        handDraw(data);
      });
    }
  }, [canvasData]);

  useEffect(() => {
    const handler = (data: any) => {
      if (currentUserIsPlaying) return;
      if (data == null) {
        clear();
      } else {
        handDraw(data);
      }
    };
    socket?.on("receive-changes", handler);

    return () => {
      socket?.off("receive-changes", handler);
    };
  }, [socket, currentUserIsPlaying]);

  const clearCanvas = () => {
    clear();
    socket?.emit("send-changes", null);
  };

  function sendChanges(data: any) {
    socket?.emit("send-changes", data);
  }

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
