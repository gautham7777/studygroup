import React from 'react';
import { useWhiteboard } from '../hooks/useWhiteboard';

interface WhiteboardProps {
    groupId: number;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ groupId }) => {
    const { 
        canvasRef,
        startDrawing,
        finishDrawing,
        draw,
        clearCanvas,
        color,
        setColor,
        brushSize,
        setBrushSize
    } = useWhiteboard(groupId);

    const colors = ['#000000', '#EF4444', '#3B82F6', '#22C55E', '#F97316', '#8B5CF6'];

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex flex-wrap items-center gap-4 p-2 border-b bg-gray-50 rounded-t-lg">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Color:</label>
                    <div className="flex gap-1">
                        {colors.map(c => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-6 h-6 rounded-full transition-transform hover:scale-110 border-2 ${color === c ? 'ring-2 ring-offset-1 ring-primary border-transparent' : 'border-gray-300'}`}
                                style={{ backgroundColor: c }}
                                aria-label={`Set color to ${c}`}
                            />
                        ))}
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <label htmlFor="brushSize" className="text-sm font-medium">Size:</label>
                    <input
                        id="brushSize"
                        type="range"
                        min="1"
                        max="50"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-32 cursor-pointer"
                    />
                    <span className="text-sm w-6 text-center">{brushSize}</span>
                </div>
                <button onClick={clearCanvas} className="ml-auto bg-gray-200 text-gray-800 px-4 py-1.5 rounded-md hover:bg-gray-300 text-sm font-medium">
                    Clear All
                </button>
            </div>
            <div className="flex-grow w-full h-full relative bg-white border rounded-b-lg overflow-hidden">
                 <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseLeave={finishDrawing}
                    onMouseMove={draw}
                    className="w-full h-full"
                />
            </div>
        </div>
    );
};

export default Whiteboard;
