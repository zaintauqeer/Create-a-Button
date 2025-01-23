import { ChromePicker, CirclePicker } from "react-color";
import { useState } from "react";

import { colors } from "@/features/editor/types";
import { rgbaObjectToString } from "@/features/editor/utils";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

// Helper function to convert CMYK to RGB
const cmykToRgb = (c: number, m: number, y: number, k: number) => {
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
};

// Helper function to convert RGB to CMYK
const rgbToCmyk = (r: number, g: number, b: number) => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  const c = (1 - rNorm - k) / (1 - k) || 0;
  const m = (1 - gNorm - k) / (1 - k) || 0;
  const y = (1 - bNorm - k) / (1 - k) || 0;
  return { c, m, y, k };
};

export const ColorPicker = ({
  value,
  onChange,
}: ColorPickerProps) => {
  const [cmyk, setCmyk] = useState(() => {
    const rgb: number[] =
      value.startsWith("rgb")
        ? value
            .replace(/rgba?\(|\)/g, "")
            .split(",")
            .map((v) => parseFloat(v))
        : [0, 0, 0]; // Ensure rgb is always an array
    return rgbToCmyk(rgb[0], rgb[1], rgb[2]);
  });
  
  

  const handleCmykChange = (newCmyk: any) => {
    setCmyk(newCmyk);
    const rgb = cmykToRgb(newCmyk.c, newCmyk.m, newCmyk.y, newCmyk.k);
    const formattedValue = rgbaObjectToString(rgb);
    onChange(formattedValue);
  };

  return (
    <div className="w-full space-y-4">
      <ChromePicker
        color={value}
        onChange={(color) => {
          const formattedValue = rgbaObjectToString(color.rgb);
          onChange(formattedValue);
        }}
        className="border rounded-lg"
      />
      <CirclePicker
        color={value}
        colors={colors}
        onChangeComplete={(color) => {
          const formattedValue = rgbaObjectToString(color.rgb);
          onChange(formattedValue);
        }}
      />
      <div className="space-y-2">
        {["C", "M", "Y", "K"].map((channel, index) => (
          <div key={channel} className="flex items-center space-x-2">
            <label htmlFor={channel} className="w-6 text-center">
              {channel}
            </label>
            <input
              id={channel}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={cmyk[channel.toLowerCase() as keyof typeof cmyk]}
              onChange={(e) =>
                handleCmykChange({
                  ...cmyk,
                  [channel.toLowerCase()]: parseFloat(e.target.value),
                })
              }
              className="flex-1"
            />
            <span className="w-10 text-right">
              {Math.round(cmyk[channel.toLowerCase() as keyof typeof cmyk] * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
