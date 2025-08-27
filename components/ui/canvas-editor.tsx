'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Image, Line, Rect } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';

interface CanvasEditorProps {
  imageSrc: string;
  brushSize: number;
  brushOpacity: number;
  onMaskChange: (mask: string) => void;
}

const MAX_WIDTH = 600;
const MAX_HEIGHT = 600;

export function CanvasEditor({
  imageSrc,
  brushSize,
  brushOpacity,
  onMaskChange,
}: CanvasEditorProps) {
  const [image] = useImage(imageSrc);
  const [lines, setLines] = useState<any[]>([]);
  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const lastPointerPosition = useRef({ x: 0, y: 0 });
  
  const stageRef = useRef<Konva.Stage>(null);
  const imageLayerRef = useRef<Konva.Layer>(null);
  const maskLayerRef = useRef<Konva.Layer>(null);
  const previewLayerRef = useRef<Konva.Layer>(null);

  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const canvasWidth = image ? Math.min(image.width, MAX_WIDTH) : MAX_WIDTH;
  const canvasHeight = image ? (canvasWidth / image.width) * image.height : MAX_HEIGHT;

  const imageX = (canvasWidth - (image?.width || 0) * stageScale) / 2;
  const imageY = (canvasHeight - (image?.height || 0) * stageScale) / 2;

  useEffect(() => {
    if (image) {
      const scale = Math.min(MAX_WIDTH / image.width, MAX_HEIGHT / image.height, 1);
      setStageScale(scale);
      setStagePos({
        x: (canvasWidth - image.width * scale) / 2,
        y: (canvasHeight - image.height * scale) / 2,
      });
    }
  }, [image, canvasWidth, canvasHeight]);

  const updateMask = useCallback(() => {
    if (!stageRef.current || !image) return;

    const tempStage = new Konva.Stage({
        width: image.width,
        height: image.height,
        container: document.createElement('div'),
    });

    const bgLayer = new Konva.Layer();
    bgLayer.add(new Konva.Rect({ x: 0, y: 0, width: image.width, height: image.height, fill: 'black' }));
    tempStage.add(bgLayer);

    const maskLayer = new Konva.Layer();
    lines.forEach(line => {
        maskLayer.add(new Konva.Line({
            points: line.points,
            stroke: 'white',
            strokeWidth: line.strokeWidth,
            tension: 0.5,
            lineCap: 'round',
            lineJoin: 'round',
            globalCompositeOperation: 'source-over',
        }));
    });
    tempStage.add(maskLayer);
    
    const dataURL = tempStage.toDataURL({ mimeType: 'image/png' });
    onMaskChange(dataURL);
    tempStage.destroy();
  }, [lines, image, onMaskChange]);

  useEffect(() => {
    updateMask();
  }, [lines, updateMask]);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 1 || e.evt.metaKey) { // Middle mouse or cmd/ctrl key for panning
        isPanning.current = true;
        lastPointerPosition.current = stageRef.current?.getPointerPosition() || { x: 0, y: 0};
        return;
    }

    isDrawing.current = true;
    const stage = stageRef.current;
    if (!stage) return;
    
    const pos = stage.getPointerPosition();
    if (pos) {
        const relativePos = {
            x: (pos.x - stagePos.x) / stageScale,
            y: (pos.y - stagePos.y) / stageScale,
        };
        setLines([
            ...lines,
            {
                points: [relativePos.x, relativePos.y],
                strokeWidth: brushSize / stageScale,
                opacity: brushOpacity,
            },
        ]);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    if (isPanning.current) {
        const newPos = stage.getPointerPosition();
        if (newPos) {
            const dx = newPos.x - lastPointerPosition.current.x;
            const dy = newPos.y - lastPointerPosition.current.y;
            setStagePos({ x: stagePos.x + dx, y: stagePos.y + dy });
            lastPointerPosition.current = newPos;
        }
        return;
    }

    if (!isDrawing.current) return;

    const pos = stage.getPointerPosition();
    if (pos) {
        const relativePos = {
            x: (pos.x - stagePos.x) / stageScale,
            y: (pos.y - stagePos.y) / stageScale,
        };
        let lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([relativePos.x, relativePos.y]);
        setLines([...lines.slice(0, -1), lastLine]);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    isPanning.current = false;
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stageScale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * 1.1 : oldScale / 1.1;
    setStageScale(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setStagePos(newPos);
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    
    const updateCursor = () => {
        const pos = stage.getPointerPosition();
        const layer = previewLayerRef.current;
        if (!pos || !layer) return;

        layer.clear();
        layer.add(new Konva.Circle({
            x: pos.x,
            y: pos.y,
            radius: brushSize / 2,
            fill: 'rgba(255,255,255,0.3)',
            stroke: 'black',
            strokeWidth: 1,
        }));
        layer.batchDraw();
    };

    const handleMouseLeave = () => {
        previewLayerRef.current?.clear();
    }

    stage.on('mousemove', updateCursor);
    stage.on('mouseleave', handleMouseLeave);

    return () => {
        stage.off('mousemove', updateCursor);
        stage.off('mouseleave', handleMouseLeave);
    }
  }, [brushSize]);

  return (
    <div 
        className="relative bg-muted/20 rounded-lg overflow-hidden border"
        style={{ width: canvasWidth, height: canvasHeight }}
    >
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        ref={stageRef}
        className="absolute top-0 left-0"
      >
        <Layer ref={imageLayerRef} x={stagePos.x} y={stagePos.y} scaleX={stageScale} scaleY={stageScale}>
          <Image image={image} />
        </Layer>
        <Layer ref={maskLayerRef} x={stagePos.x} y={stagePos.y} scaleX={stageScale} scaleY={stageScale}>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="rgba(0, 0, 0, 0.7)"
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              opacity={line.opacity}
            />
          ))}
        </Layer>
        <Layer ref={previewLayerRef} listening={false} />
      </Stage>
    </div>
  );
}
