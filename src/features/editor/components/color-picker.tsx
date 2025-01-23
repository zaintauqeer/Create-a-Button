import { RgbaColorPicker } from "react-colorful";
import { useState } from "react";
import { colors } from "@/features/editor/types";
import { rgbaObjectToString } from "@/features/editor/utils";
import convert from "color-convert"; // Install this library: npm install color-convert

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  // Parse RGBA string to object
  const parseRgba = (rgba: string) => {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (match) {
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
        a: parseFloat(match[4] ?? "1"),
      };
    }
    return { r: 0, g: 0, b: 0, a: 1 }; // Default color
  };

  const rgbaColor = parseRgba(value);

  // Convert RGBA to CMYK
  const rgbToCmyk = (r: number, g: number, b: number) => {
    const [c, m, y, k] = convert.rgb.cmyk(r, g, b);
    return { c, m, y, k };
  };

  // Convert CMYK to RGB
  const cmykToRgb = (c: number, m: number, y: number, k: number) => {
    const [r, g, b] = convert.cmyk.rgb(c, m, y, k);
    return { r, g, b, a: 1 };
  };

  // Get initial CMYK values
  const initialCmyk = rgbToCmyk(rgbaColor.r, rgbaColor.g, rgbaColor.b);
  const [cmyk, setCmyk] = useState(initialCmyk);

  const handleCmykChange = (channel: keyof typeof cmyk, value: number) => {
    const newCmyk = { ...cmyk, [channel]: value };
    setCmyk(newCmyk);
    const newRgb = cmykToRgb(newCmyk.c, newCmyk.m, newCmyk.y, newCmyk.k);
    onChange(rgbaObjectToString(newRgb));
  };

  return (
    <div className="w-full space-y-4">
      <RgbaColorPicker
        color={rgbaColor}
        onChange={(color) => {
          const formattedValue = rgbaObjectToString(color);
          onChange(formattedValue);
          setCmyk(rgbToCmyk(color.r, color.g, color.b)); // Sync CMYK values
        }}
        className="border rounded-lg"
      />
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <div
            key={color}
            className="w-8 h-8 rounded-full cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {["c", "m", "y", "k"].map((channel) => (
          <div key={channel}>
            <label className="block text-sm font-medium text-gray-700">
              {channel.toUpperCase()}
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={cmyk[channel as keyof typeof cmyk]}
              onChange={(e) =>
                handleCmykChange(channel as keyof typeof cmyk, Number(e.target.value))
              }
              className="mt-1 block w-full border rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
