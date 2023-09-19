import { useRef, useState, useEffect } from "react";

export const useCanvas = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<any>(null);
  const contextRef = useRef<any>(null);

  useEffect(() => {
    prepareCanvas();
  }, []);

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    canvas.style.backgroundColor = "white";

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  };

  const startDrawing = ({ nativeEvent }: any) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }: any) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const handDraw = (x: number, y: number) => {
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  return {
    canvasRef,
    contextRef,
    startDrawing,
    finishDrawing,
    clearCanvas,
    draw,
    handDraw,
    isDrawing,
    setIsDrawing,
  };
};
