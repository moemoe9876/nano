'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface BrushControlsProps {
  brushSize: number;
  setBrushSize: (size: number) => void;
  brushOpacity: number;
  setBrushOpacity: (opacity: number) => void;
}

export function BrushControls({
  brushSize,
  setBrushSize,
  brushOpacity,
  setBrushOpacity,
}: BrushControlsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="brush-size">Brush Size</Label>
          <span className="text-xs text-muted-foreground">{brushSize}px</span>
        </div>
        <Slider
          id="brush-size"
          min={1}
          max={100}
          step={1}
          value={[brushSize]}
          onValueChange={(value) => setBrushSize(value[0])}
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="brush-opacity">Brush Opacity</Label>
          <span className="text-xs text-muted-foreground">{(brushOpacity * 100).toFixed(0)}%</span>
        </div>
        <Slider
          id="brush-opacity"
          min={0}
          max={1}
          step={0.1}
          value={[brushOpacity]}
          onValueChange={(value) => setBrushOpacity(value[0])}
        />
      </div>
    </div>
  );
}
