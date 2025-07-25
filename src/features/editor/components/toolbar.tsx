import { useState } from "react";

import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaUnderline
} from "react-icons/fa";
import { TbColorFilter } from "react-icons/tb";
import { BsBorderWidth } from "react-icons/bs";
import { RxTransparencyGrid } from "react-icons/rx";
import {
  ArrowUp,
  ArrowDown,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash,
  ALargeSmall,
  SquareSplitHorizontal,
  Spline,
  Copy,
  Circle
} from "lucide-react";

import { isTextType } from "@/features/editor/utils";
import { FontSizeInput } from "@/features/editor/components/font-size-input";
import {
  ActiveTool,
  Editor,
  FONT_SIZE,
  FONT_WEIGHT
} from "@/features/editor/types";

import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const Toolbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ToolbarProps) => {
  const initialFillColor = editor?.getActiveFillColor();
  const initialStrokeColor = editor?.getActiveStrokeColor();
  const initialFontFamily = editor?.getActiveFontFamily();
  const initialFontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;
  const initialFontStyle = editor?.getActiveFontStyle();
  const initialFontLinethrough = editor?.getActiveFontLinethrough();
  const initialFontUnderline = editor?.getActiveFontUnderline();
  const initialTextAlign = editor?.getActiveTextAlign();
  const initialFontSize = editor?.getActiveFontSize() || FONT_SIZE
  const initialCurve = editor?.getActiveCurveText();

  const [properties, setProperties] = useState({
    fillColor: initialFillColor,
    strokeColor: initialStrokeColor,
    fontFamily: initialFontFamily,
    fontWeight: initialFontWeight,
    fontStyle: initialFontStyle,
    fontLinethrough: initialFontLinethrough,
    fontUnderline: initialFontUnderline,
    textAlign: initialTextAlign,
    fontSize: initialFontSize,
    curve: initialCurve,
  });

  const selectedObject = editor?.selectedObjects[0];
  const selectedObjectType = editor?.selectedObjects[0]?.type;

  const isText = isTextType(selectedObjectType);
  const isImage = selectedObjectType === "image";


  const onChangeTextAlign = (value: string) => {
    if (!selectedObject) {
      return;
    }

    editor?.changeTextAlign(value);
    setProperties((current) => ({
      ...current,
      textAlign: value,
    }));
  };

  const toggleBold = () => {
    if (!selectedObject) {
      return;
    }

    const newValue = properties.fontWeight > 500 ? 500 : 700;

    editor?.changeFontWeight(newValue);
    setProperties((current) => ({
      ...current,
      fontWeight: newValue,
    }));
  };

  const toggleItalic = () => {
    if (!selectedObject) {
      return;
    }

    const isItalic = properties.fontStyle === "italic";
    const newValue = isItalic ? "normal" : "italic";

    editor?.changeFontStyle(newValue);
    setProperties((current) => ({
      ...current,
      fontStyle: newValue,
    }));
  };

  const toggleLinethrough = () => {
    if (!selectedObject) {
      return;
    }

    const newValue = properties.fontLinethrough ? false : true;

    editor?.changeFontLinethrough(newValue);
    setProperties((current) => ({
      ...current,
      fontLinethrough: newValue,
    }));
  };

  const toggleUnderline = () => {
    if (!selectedObject) {
      return;
    }

    const newValue = properties.fontUnderline ? false : true;

    editor?.changeFontUnderline(newValue);
    setProperties((current) => ({
      ...current,
      fontUnderline: newValue,
    }));
  };

  if (editor?.selectedObjects.length === 0) {
    return (
      <>
        <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" >
         
        </div>
      </>
    );
  }

  return (
    <div className="shrink-0 min-h-[56px] border-b bg-white w-full lg:flex lg:items-center lg:overflow-x-auto grid grid-cols-4 lg:static absolute bottom-0 left-0 z-[49] p-2 gap-3">
      {!isImage && (
        <div className="flex items-center  justify-center">
          <Hint label="Color" side="bottom" sideOffset={5}>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => onChangeActiveTool("fill")}
                size="icon"
                variant="ghost"
                className={cn(
                  activeTool === "fill" && "bg-gray-100"
                )}
              >
                <div
                  className="rounded-sm lg:size-4 size-6 border"
                  style={{ backgroundColor: properties.fillColor }}
                />
              </Button>
              <small className="lg:hidden">Color</small>
            </div>
          </Hint>
        </div>
      )}
      {/* {!isText && (
        <div className="flex items-center  justify-center">
          <Hint label="Stroke color" side="bottom" sideOffset={5}>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => onChangeActiveTool("stroke-color")}
                size="icon"
                variant="ghost"
                className={cn(
                  activeTool === "stroke-color" && "bg-gray-100"
                )}
              >
                <div
                  className="rounded-sm lg:size-4 size-6 border-2 bg-white"
                  style={{ borderColor: properties.strokeColor }}
                />
              </Button>
              <small className="lg:hidden">Stroke Color</small>
            </div>
          </Hint>
        </div>
      )} */}
      {/* {!isText && (
        <div className="flex items-center  justify-center">
          <Hint label="Stroke width" side="bottom" sideOffset={5}>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => onChangeActiveTool("stroke-width")}
                size="icon"
                variant="ghost"
                className={cn(
                  activeTool === "stroke-width" && "bg-gray-100"
                )}
              >
                <BsBorderWidth className="lg:size-4 size-6" />
              </Button>
              <small className="lg:hidden text-center">Stroke Width</small>
            </div>
          </Hint>
        </div>
      )} */}
      {isText && (
        <div className="flex items-center  justify-center">
          <Hint label="Font" side="bottom" sideOffset={5}>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => onChangeActiveTool("font")}
                size="icon"
                variant="ghost"
                className={cn(
                  "w-auto px-2 lg:text-sm text-lg",
                  activeTool === "font" && "bg-gray-100"
                )}
              >
                <div className="max-w-[100px] truncate">
                  {properties.fontFamily}
                </div>
                {/* <ChevronDown className="size-4 ml-2 shrink-0" /> */}
              </Button>
              <small className="lg:hidden">Font</small>
            </div>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center  justify-center">
          <Hint label="Bold" side="bottom" sideOffset={5}>
            <div className="flex flex-col items-center">
              <Button
                onClick={toggleBold}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.fontWeight > 500 && "bg-gray-100"
                )}
              >
                <FaBold className="lg:size-4 size-6" />
              </Button>
              <small className="lg:hidden">Bold</small>
            </div>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center  justify-center">
          <Hint label="Italic" side="bottom" sideOffset={5}>
            <div className="flex flex-col items-center">
              <Button
                onClick={toggleItalic}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.fontStyle === "italic" && "bg-gray-100"
                )}
              >
                <FaItalic className="lg:size-4 size-6" />
              </Button>
              <small className="lg:hidden">Italic</small>
            </div>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center  justify-center">
          <Hint label="Underline" side="bottom" sideOffset={5}>
            <div className="flex flex-col items-center">
              <Button
                onClick={toggleUnderline}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.fontUnderline && "bg-gray-100"
                )}
              >
                <FaUnderline className="lg:size-4 size-6" />
              </Button>
              <small className="lg:hidden">Underline</small>
            </div>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center  justify-center">
          <Hint label="Strike" side="bottom" sideOffset={5}>
            <div className="flex flex-col items-center">
              <Button
                onClick={toggleLinethrough}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.fontLinethrough && "bg-gray-100"
                )}
              >
                <FaStrikethrough className="lg:size-4 size-6" />
              </Button>
              <small className="lg:hidden">Linethrough</small>
            </div>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center  justify-center">
          <Hint label="Align left" side="bottom" sideOffset={5}>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => onChangeTextAlign("left")}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.textAlign === "left" && "bg-gray-100"
                )}
              >
                <AlignLeft className="lg:size-4 size-6" />
              </Button>
              <small className="lg:hidden">Left Align</small>
            </div>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center  justify-center">
          <Hint label="Align center" side="bottom" sideOffset={5}>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => onChangeTextAlign("center")}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.textAlign === "center" && "bg-gray-100"
                )}
              >
                <AlignCenter className="lg:size-4 size-6" />
              </Button>
              <small className="lg:hidden">Center Align</small>
            </div>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center  justify-center">
          <Hint label="Align right" side="bottom" sideOffset={5}>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => onChangeTextAlign("right")}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.textAlign === "right" && "bg-gray-100"
                )}
              >
                <AlignRight className="lg:size-4 size-6" />
              </Button>
              <small className="lg:hidden">Right Align</small>
            </div>
          </Hint>
        </div>
      )}
      {isText && (
        <>
          <div className="flex items-center  justify-center">
            <Hint label="Font Size" side="bottom" sideOffset={5}>
              <div className="flex flex-col items-center">
                <Button
                  onClick={() => onChangeActiveTool("fontSize")}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "w-auto px-2 text-lg",
                    activeTool === "fontSize" && "bg-gray-100"
                  )}
                >
                  <ALargeSmall className="lg:size-4 size-6" />
                </Button>
                <small className="lg:hidden">Font Size</small>
              </div>
            </Hint>
          </div>
          <div className="flex items-center  justify-center">
            <Hint label="Curve Text" side="bottom" sideOffset={5}>
              <div className="flex flex-col items-center">
                <Button
                  onClick={() => onChangeActiveTool("curveText")}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "w-auto px-2 text-lg",
                    activeTool === "curveText" && "bg-gray-100"
                  )}
                >
                  <Spline className="lg:size-4 size-6" />
                </Button>
                <small className="lg:hidden">Curve Text</small>
              </div>
            </Hint>
          </div>
        </>
      )}
      {isImage && (
        <div className="flex items-center  justify-center">
          <Hint label="Filters" side="bottom" sideOffset={5}>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => onChangeActiveTool("filter")}
                size="icon"
                variant="ghost"
                className={cn(
                  activeTool === "filter" && "bg-gray-100"
                )}
              >
                <TbColorFilter className="lg:size-4 size-6" />
              </Button>
              <small className="lg:hidden">Filter</small>
            </div>
          </Hint>
        </div>
      )}
      {isImage && (
        <div className="flex items-center  justify-center">
          <Hint label="Remove background" side="bottom" sideOffset={5}>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => onChangeActiveTool("remove-bg")}
                size="icon"
                variant="ghost"
                className={cn(
                  activeTool === "remove-bg" && "bg-gray-100"
                )}
              >
                <SquareSplitHorizontal className="lg:size-4 size-6" />
              </Button>
              <small className="lg:hidden">Remove BG</small>
            </div>
          </Hint>
        </div>
      )}
      <div className="flex items-center  justify-center">
        <Hint label="Bring forward" side="bottom" sideOffset={5}>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => editor?.bringForward()}
              size="icon"
              variant="ghost"
            >
              <ArrowUp className="lg:size-4 size-6" />
            </Button>
            <small className="lg:hidden">Forward</small>
          </div>
        </Hint>
      </div>
      <div className="flex items-center  justify-center">
        <Hint label="Send backwards" side="bottom" sideOffset={5}>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => editor?.sendBackwards()}
              size="icon"
              variant="ghost"
            >
              <ArrowDown className="lg:size-4 size-6" />
            </Button>
            <small className="lg:hidden">Backward</small>
          </div>
        </Hint>
      </div>
      <div className="flex items-center  justify-center">
        <Hint label="Opacity" side="bottom" sideOffset={5}>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => onChangeActiveTool("opacity")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "opacity" && "bg-gray-100")}
            >
              <RxTransparencyGrid className="lg:size-4 size-6" />
            </Button>
            <small className="lg:hidden">Opacity</small>
          </div>
        </Hint>
      </div>
      <div className="flex items-center  justify-center">
        <Hint label="Duplicate" side="bottom" sideOffset={5}>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => {
                editor?.onCopy();
                editor?.onPaste();
              }}
              size="icon"
              variant="ghost"
            >
              <Copy className="lg:size-4 size-6" />
            </Button>
            <small className="lg:hidden">Dublicate</small>
          </div>
        </Hint>
      </div>
      <div className="flex items-center  justify-center">
        <Hint label="Delete" side="bottom" sideOffset={5}>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => editor?.delete()}
              size="icon"
              variant="ghost"
            >
              <Trash className="lg:size-4 size-6" />
            </Button>
            <small className="lg:hidden">Delete</small>
          </div>
        </Hint>
      </div>
    </div>
  );
};
