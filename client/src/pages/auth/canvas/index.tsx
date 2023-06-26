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
  const [value, setValue] = useState<string>("");
  const { canvasRef, onMouseDown, clear, setCanvasContent } = useDraw(drawLine);

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
      socket.emit("save-document", value);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [socket]);

  useEffect(() => {
    if (socket == null) return;

    const handler = (delta: any) => {
      setValue(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket]);

  useEffect(() => {
    if (socket == null) return;

    socket.emit("send-changes", value);
  }, [socket, value]);

  return (
    <div className="canvas-container">
      <input value={value} onChange={(e) => setValue(e.target.value)} />
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
