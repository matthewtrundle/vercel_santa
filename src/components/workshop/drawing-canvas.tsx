'use client';

import type { ReactElement } from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Eraser, Palette, Undo, Trash2, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DrawingCanvasProps {
  onSave: (imageDataUrl: string) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
];

const BRUSH_SIZES = [
  { name: 'Small', value: 3 },
  { name: 'Medium', value: 8 },
  { name: 'Large', value: 16 },
];

export function DrawingCanvas({
  onSave,
  onCancel,
  className,
}: DrawingCanvasProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(8);
  const [isEraser, setIsEraser] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Initialize canvas with white background
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([imageData]);
  }, []);

  // Set up canvas dimensions based on container
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Set canvas size
    const rect = container.getBoundingClientRect();
    canvas.width = Math.min(rect.width - 32, 500);
    canvas.height = Math.min(rect.width - 32, 500);

    initCanvas();
  }, [initCanvas]);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-19), imageData]); // Keep last 20 states
  }, []);

  const getCoordinates = useCallback(
    (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if ('touches' in e) {
        const touch = e.touches[0];
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        };
      }

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const coords = getCoordinates(e);
      if (!coords) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = isEraser ? '#FFFFFF' : color;
      ctx.lineWidth = brushSize;

      setIsDrawing(true);
    },
    [color, brushSize, isEraser, getCoordinates]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;

      const coords = getCoordinates(e);
      if (!coords) return;

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    },
    [isDrawing, getCoordinates]
  );

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      saveToHistory();
    }
    setIsDrawing(false);
  }, [isDrawing, saveToHistory]);

  const handleUndo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || history.length <= 1) return;

    const newHistory = history.slice(0, -1);
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setHistory(newHistory);
  }, [history]);

  const handleClear = useCallback(() => {
    initCanvas();
  }, [initCanvas]);

  const handleSave = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSaving(true);
    try {
      const dataUrl = canvas.toDataURL('image/png');
      await onSave(dataUrl);
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  return (
    <motion.div
      ref={containerRef}
      className={cn('flex flex-col items-center', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Canvas */}
      <div className="relative mb-4">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-300 rounded-xl shadow-inner bg-white cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Color picker popover */}
        {showColorPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-2 left-2 bg-white rounded-xl shadow-lg p-3 z-10 border border-gray-200"
          >
            <p className="text-xs text-gray-500 mb-2 font-medium">Colors</p>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    setColor(c.value);
                    setIsEraser(false);
                    setShowColorPicker(false);
                  }}
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                    color === c.value && !isEraser
                      ? 'border-gray-900 scale-110'
                      : 'border-gray-200'
                  )}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Tools */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {/* Color button */}
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className={cn(
            'p-2 rounded-lg border-2 transition-all',
            showColorPicker ? 'border-gray-900' : 'border-gray-200'
          )}
          title="Choose color"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-gray-600" />
            <div
              className="w-5 h-5 rounded-full border border-gray-300"
              style={{ backgroundColor: isEraser ? '#FFFFFF' : color }}
            />
          </div>
        </button>

        {/* Brush sizes */}
        {BRUSH_SIZES.map((size) => (
          <button
            key={size.value}
            onClick={() => setBrushSize(size.value)}
            className={cn(
              'p-2 rounded-lg border-2 transition-all',
              brushSize === size.value ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
            )}
            title={size.name}
          >
            <div
              className="rounded-full bg-gray-800"
              style={{
                width: Math.min(size.value * 1.5, 24),
                height: Math.min(size.value * 1.5, 24),
              }}
            />
          </button>
        ))}

        {/* Eraser */}
        <button
          onClick={() => setIsEraser(!isEraser)}
          className={cn(
            'p-2 rounded-lg border-2 transition-all',
            isEraser ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
          )}
          title="Eraser"
        >
          <Eraser className="w-5 h-5 text-gray-600" />
        </button>

        {/* Undo */}
        <button
          onClick={handleUndo}
          disabled={history.length <= 1}
          className="p-2 rounded-lg border-2 border-gray-200 transition-all disabled:opacity-40"
          title="Undo"
        >
          <Undo className="w-5 h-5 text-gray-600" />
        </button>

        {/* Clear */}
        <button
          onClick={handleClear}
          className="p-2 rounded-lg border-2 border-gray-200 transition-all hover:border-red-300 hover:bg-red-50"
          title="Clear canvas"
        >
          <Trash2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Instructions */}
      <p className="text-sm text-gray-500 mb-4 text-center">
        Draw what you&apos;d like as a gift, or draw something that represents your interests!
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Use This Drawing
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
