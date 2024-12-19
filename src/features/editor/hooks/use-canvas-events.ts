import { fabric } from "fabric";
import { useEffect } from "react";

interface UseCanvasEventsProps {
  save: () => void;
  canvas: fabric.Canvas | null;
  setSelectedObjects: (objects: fabric.Object[]) => void;
  clearSelectionCallback?: () => void;
}

const initAligningGuidelines = (canvas: fabric.Canvas) => {
  const aligningLineMargin = 5;
  const aligningLineColor = "#0365c7"; // Color of the guideline
  const aligningLineWidth = 1; // Thickness of the guideline

  let verticalLine: fabric.Line | null = null;
  let horizontalLine: fabric.Line | null = null;

  // Helper function to create or update a line
  const createOrUpdateLine = (line: fabric.Line | null, x1: number, y1: number, x2: number, y2: number): fabric.Line => {
    if (!line) {
      const newLine = new fabric.Line([x1, y1, x2, y2], {
        stroke: aligningLineColor,
        strokeWidth: aligningLineWidth,
        selectable: false,
        evented: false,
      });
      canvas.add(newLine);
      return newLine;
    } else {
      line.set({ x1, y1, x2, y2 });
      line.setCoords();
      return line;
    }
  };

  // Helper function to clear the lines
  const clearLines = () => {
    if (verticalLine) {
      canvas.remove(verticalLine);
      verticalLine = null;
    }
    if (horizontalLine) {
      canvas.remove(horizontalLine);
      horizontalLine = null;
    }
  };

  function isInRange(value1: number, value2: number) {
    return Math.abs(value1 - value2) <= aligningLineMargin;
  }

  canvas.on("object:moving", (e) => {
    if (!e.target) return;

    const activeObject = e.target;
    const activeObjectCenter = activeObject.getCenterPoint();
    let activeObjectLeft = activeObjectCenter.x;
    let activeObjectTop = activeObjectCenter.y;

    let snapLeft: number | null = null;
    let snapTop: number | null = null;

    let verticalSnapFound = false;
    let horizontalSnapFound = false;

    canvas.getObjects().forEach((obj) => {
      if (obj === activeObject) return;

      const objectCenter = obj.getCenterPoint();
      const objectLeft = objectCenter.x;
      const objectTop = objectCenter.y;

      // // Check for horizontal snapping
      // if (isInRange(objectTop, activeObjectTop)) {
      //   snapTop = objectTop;
      // }

      // // Check for vertical snapping
      // if (isInRange(objectLeft, activeObjectLeft)) {
      //   snapLeft = objectLeft;
      // }

      // Check for horizontal alignment
      if (Math.abs(objectTop - activeObjectTop) <= aligningLineMargin) {
        snapTop = objectTop;
        horizontalSnapFound = true;
        horizontalLine = createOrUpdateLine(horizontalLine, 0, objectTop, canvas.width || 0, objectTop);
      }

      // Check for vertical alignment
      if (Math.abs(objectLeft - activeObjectLeft) <= aligningLineMargin) {
        snapLeft = objectLeft;
        verticalSnapFound = true;
        verticalLine = createOrUpdateLine(verticalLine, objectLeft, 0, objectLeft, canvas.height || 0);
      }

    });

    // Clear lines if no snapping found
    if (!horizontalSnapFound && horizontalLine) {
      canvas.remove(horizontalLine);
      horizontalLine = null;
    }
    if (!verticalSnapFound && verticalLine) {
      canvas.remove(verticalLine);
      verticalLine = null;
    }

    // Apply snapping
    if (snapLeft !== null) {
      activeObjectLeft = snapLeft;
    }
    if (snapTop !== null) {
      activeObjectTop = snapTop;
    }

    activeObject.setPositionByOrigin(
      new fabric.Point(activeObjectLeft, activeObjectTop),
      "center",
      "center"
    );
  });
  canvas.on("object:modified", clearLines);
  canvas.on("mouse:up", clearLines);
};


export const useCanvasEvents = ({
  save,
  canvas,
  setSelectedObjects,
  clearSelectionCallback,
}: UseCanvasEventsProps) => {
  useEffect(() => {
    if (canvas) {
      // Initialize alignment guidelines
      initAligningGuidelines(canvas);

      canvas.on("object:added", () => save());
      canvas.on("object:removed", () => save());
      canvas.on("object:modified", () => save());
      canvas.on("selection:created", (e) => {
        setSelectedObjects(e.selected || []);
      });
      canvas.on("selection:updated", (e) => {
        setSelectedObjects(e.selected || []);
      });
      canvas.on("selection:cleared", () => {
        setSelectedObjects([]);
        clearSelectionCallback?.();
      });
    }

    return () => {
      if (canvas) {
        canvas.off("object:added");
        canvas.off("object:removed");
        canvas.off("object:modified");
        canvas.off("selection:created");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
        canvas.off("object:moving");
        canvas.off("mouse:up");
      }
    };
  }, [save, canvas, clearSelectionCallback, setSelectedObjects]);
};