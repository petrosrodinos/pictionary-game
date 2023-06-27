import { FC, useState, useEffect } from "react";
import { useDraw } from "../../../hooks/useDraw";
import { ChromePicker } from "react-color";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "./style.scss";

interface pageProps {}

const Canvas: FC<pageProps> = ({}) => {
  const [color, setColor] = useState<string>("#000");
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState<any>();
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine);

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();

    const eventData = {
      x: startPoint.x,
      y: startPoint.y,
      color: lineColor,
      lineWidth,
      currX,
      currY,
    };
    emitEvent(eventData);
  }

  function emitEvent(data: any) {
    if (!socket) return;
    socket.emit("send-changes", data);
  }

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

  function drawPixel(data: any) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y, currX, currY, color, lineWidth } = data;

    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;

    ctx.moveTo(x, y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  useEffect(() => {
    const s = io("http://192.168.1.3:5000");
    console.log("s", s);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null) return;

    socket.emit("get-document", documentId);
  }, [socket, documentId]);

  useEffect(() => {
    if (socket == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", "");
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [socket]);

  return (
    <div className="canvas-container">
      <div className="canvas-color-picker">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <button type="button" className="p-2 rounded-md border border-black" onClick={clear}>
          Clear canvas
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={750}
        height={750}
        className="canvas"
      />
    </div>
  );
};

export default Canvas;
