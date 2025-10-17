import { useState, useRef, useEffect, useCallback } from 'react';
import { database } from '../firebaseConfig';
import { ref, onValue, set, push } from 'firebase/database';
import { WhiteboardLine } from '../types';

export const useWhiteboard = (groupId: number) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const isDrawingRef = useRef(false);
    const currentPathRef = useRef<WhiteboardLine['points']>([]);

    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);

    const getCanvasContext = useCallback(() => {
        if (!contextRef.current && canvasRef.current) {
            contextRef.current = canvasRef.current.getContext('2d');
            if (contextRef.current) {
                contextRef.current.lineCap = 'round';
                contextRef.current.lineJoin = 'round';
            }
        }
        return contextRef.current;
    }, []);

    const drawLine = useCallback((line: WhiteboardLine) => {
        const context = getCanvasContext();
        if (!context || line.points.length < 2) return;

        context.strokeStyle = line.color;
        context.lineWidth = line.brushSize;
        context.beginPath();
        context.moveTo(line.points[0].x, line.points[0].y);
        for (let i = 1; i < line.points.length; i++) {
            context.lineTo(line.points[i].x, line.points[i].y);
        }
        context.stroke();
    }, [getCanvasContext]);

    const redrawCanvas = useCallback((lines: Record<string, WhiteboardLine> | null) => {
        const canvas = canvasRef.current;
        const context = getCanvasContext();
        if (!canvas || !context) return;
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (lines) {
            Object.values(lines).forEach(drawLine);
        }
    }, [getCanvasContext, drawLine]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const parent = canvas?.parentElement;
        if (!canvas || !parent) return;
        
        const dbRef = ref(database, `whiteboards/${groupId}`);
        let initialDataLoaded = false;

        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0];
            const { width, height } = entry.contentRect;
            canvas.width = width;
            canvas.height = height;
            if(initialDataLoaded) {
                 onValue(dbRef, (snapshot) => {
                     redrawCanvas(snapshot.val());
                }, { onlyOnce: true });
            }
        });
        resizeObserver.observe(parent);

        const unsubscribe = onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            redrawCanvas(data);
            if(!initialDataLoaded) initialDataLoaded = true;
        });

        return () => {
            unsubscribe();
            resizeObserver.disconnect();
        };

    }, [groupId, redrawCanvas]);

    const startDrawing = useCallback(({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = nativeEvent;
        isDrawingRef.current = true;
        currentPathRef.current = [{ x: offsetX, y: offsetY }];
    }, []);

    const finishDrawing = useCallback(() => {
        if (!isDrawingRef.current || currentPathRef.current.length < 2) {
             isDrawingRef.current = false;
             currentPathRef.current = [];
             return;
        }
        isDrawingRef.current = false;
        
        const line: WhiteboardLine = {
            points: currentPathRef.current,
            color,
            brushSize
        };

        const dbRef = ref(database, `whiteboards/${groupId}`);
        const newLineRef = push(dbRef);
        set(newLineRef, line);

        currentPathRef.current = [];

    }, [brushSize, color, groupId]);

    const draw = useCallback(({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawingRef.current) {
            return;
        }
        const { offsetX, offsetY } = nativeEvent;
        const context = getCanvasContext();
        if (!context) return;

        context.strokeStyle = color;
        context.lineWidth = brushSize;
        context.beginPath();
        const lastPoint = currentPathRef.current[currentPathRef.current.length - 1];
        context.moveTo(lastPoint.x, lastPoint.y);
        context.lineTo(offsetX, offsetY);
        context.stroke();
        
        currentPathRef.current.push({ x: offsetX, y: offsetY });
    }, [brushSize, color, getCanvasContext]);

    const clearCanvas = useCallback(() => {
        const dbRef = ref(database, `whiteboards/${groupId}`);
        set(dbRef, null);
    }, [groupId]);

    return {
        canvasRef,
        startDrawing,
        finishDrawing,
        draw,
        clearCanvas,
        color,
        setColor,
        brushSize,
        setBrushSize
    };
};
