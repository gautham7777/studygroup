import { useRef, useState, useCallback } from 'react';

export const useWhiteboard = (groupId: number) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  const startDrawing = useCallback(({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(nativeEvent.clientX - rect.left, nativeEvent.clientY - rect.top);
  }, []);

  const finishDrawing = useCallback(() => {
    setDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.closePath();
  }, []);

  const draw = useCallback(({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(nativeEvent.clientX - rect.left, nativeEvent.clientY - rect.top);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, [drawing, color, brushSize]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  return {
    canvasRef,
    startDrawing,
    finishDrawing,
    draw,
    clearCanvas,
    color,
    setColor,
    brushSize,
    setBrushSize,
  };
};
