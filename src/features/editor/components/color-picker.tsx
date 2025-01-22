import { ChromePicker, CirclePicker, SketchPicker  } from "react-color";

import { colors } from "@/features/editor/types";
import { rgbaObjectToString } from "@/features/editor/utils";
import { useState, useEffect } from "react";
import convert from "color-convert";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
};

export const ColorPicker = ({
  value,
  onChange,
}: ColorPickerProps) => {
  const [rgb, setRgb] = useState({ r: 255, g: 255, b: 255, a: 1 });
  const [cmyk, setCmyk] = useState([0, 0, 0, 0]);
    // Synchronize RGB with value prop
    useEffect(() => {
      const [r, g, b, a] = value
        .replace(/rgba?\(([^)]+)\)/, "$1")
        .split(",")
        .map((v) => parseFloat(v.trim()));
      setRgb({ r, g, b, a: a ?? 1 });
      setCmyk(convert.rgb.cmyk(r, g, b));
    }, [value]);
  
    // Handle RGB picker changes
    const handleColorChange = (color: { rgb: any; }) => {
      const newRgb = color.rgb;
      setRgb(newRgb);
      setCmyk(convert.rgb.cmyk(newRgb.r, newRgb.g, newRgb.b));
      const formattedValue = rgbaObjectToString(newRgb);
      onChange(formattedValue);
    };
  
    // Handle CMYK input changes
    const handleCmykChange = (index: number, value: string) => {
      const newCmyk = [...cmyk];
      newCmyk[index] = Math.max(0, Math.min(100, parseInt(value, 10) || 0));
      setCmyk(newCmyk);
      const [r, g, b] = convert.cmyk.rgb(...newCmyk);
      setRgb({ r, g, b, a: rgb.a });
      onChange(rgbaObjectToString({ r, g, b, a: rgb.a }));
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
      <div className="flex flex-wrap gap-4">
        {["C", "M", "Y", "K"].map((label, index) => (
          <div key={label} className="flex items-center space-x-2">
            <div>
              <label className="block">{label}</label>
              <input
                type="number"
                value={cmyk[index]}
                onChange={(e) => handleCmykChange(index, e.target.value)}
                className="w-16 text-center outline-none border rounded px-1"
              />
            </div>
          </div>
        ))}
      </div>
      <CirclePicker
        color={value}
        colors={colors}
        onChangeComplete={(color) => {
          const formattedValue = rgbaObjectToString(color.rgb);
          onChange(formattedValue);
        }}
      />
      
    </div>
  );
};
