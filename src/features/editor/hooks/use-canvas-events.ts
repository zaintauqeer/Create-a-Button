import { fabric } from "fabric";
import { useEffect } from "react";

interface UseCanvasEventsProps {
  save: () => void;
  canvas: fabric.Canvas | null;
  setSelectedObjects: (objects: fabric.Object[]) => void;
  clearSelectionCallback?: () => void;
}

const initAligningGuidelines = (canvas: fabric.Canvas) => {
  if (!canvas || !canvas.width || !canvas.height) return;

  const aligningLineMargin = 5; // Snap margin
  const aligningLineColor = "#0365d7";
  const aligningLineWidth = 1;

  let centerX = canvas.width / 2;
  let centerY = canvas.height / 2;

  // Create center alignment lines
  const verticalLine = new fabric.Line([centerX, 0, centerX, canvas.height], {
    stroke: aligningLineColor,
    strokeWidth: aligningLineWidth,
    selectable: false,
    evented: false,
    opacity: 0, // Default faint visibility
    excludeFromExport: true,
  });

  const horizontalLine = new fabric.Line([0, centerY, canvas.width, centerY], {
    stroke: aligningLineColor,
    strokeWidth: aligningLineWidth,
    selectable: false,
    evented: false,
    opacity: 0, // Default faint visibility
    excludeFromExport: true,
  });

  // Add guidelines to the canvas
  canvas.add(verticalLine);
  canvas.add(horizontalLine);

  function isInRange(value1: number, value2: number) {
    return Math.abs(value1 - value2) <= aligningLineMargin;
  }

  canvas.on("object:moving", (e) => {
    if (!e.target) return;

    const activeObject = e.target;
    const activeCenter = activeObject.getCenterPoint();

    let snapX = activeCenter.x;
    let snapY = activeCenter.y;

    const isVerticallyCentered = isInRange(activeCenter.x, centerX);
    const isHorizontallyCentered = isInRange(activeCenter.y, centerY);

    // Snap to center when close enough
    if (isVerticallyCentered) snapX = centerX;
    if (isHorizontallyCentered) snapY = centerY;

    activeObject.setPositionByOrigin(new fabric.Point(snapX, snapY), "center", "center");
    activeObject.setCoords();

    // Show guidelines when close
    verticalLine.set({ opacity: isVerticallyCentered ? 1 : 0 });
    horizontalLine.set({ opacity: isHorizontallyCentered ? 1 : 0 });

    canvas.requestRenderAll();
  });

  // Hide lines when the object stops moving
  canvas.on("mouse:up", () => {
    verticalLine.set({ opacity: 0 });
    horizontalLine.set({ opacity: 0 });
    canvas.requestRenderAll();
  });

  // Ensure lines remain centered if canvas resizes
  const updateLines = () => {
    centerX = canvas.getWidth() / 2;
    centerY = canvas.getHeight() / 2;

    verticalLine.set({ x1: centerX, x2: centerX, y1: 0, y2: canvas.getHeight() });
    horizontalLine.set({ x1: 0, x2: canvas.getWidth(), y1: centerY, y2: centerY });

    verticalLine.setCoords();
    horizontalLine.setCoords();
    canvas.bringToFront(verticalLine);
    canvas.bringToFront(horizontalLine);
    canvas.requestRenderAll();
  };

  canvas.on("after:render", updateLines);
  updateLines(); // Ensure correct positioning on load

  // Show rotation degree
  let rotationDisplay: fabric.Object | undefined
  canvas.on("selection:created", (e) => {
    rotationDisplay = canvas.getObjects().find(obj => obj.type === 'text' && obj.fill === '#000');
    if (!rotationDisplay) {
      rotationDisplay = new fabric.Text("", {
        fontSize: 18,
        fill: "#000",
        fontFamily: "Arial",
        selectable: false,
        evented: false,
      });
      canvas.add(rotationDisplay);
      rotationDisplay.set({ opacity: 0 }); // Initially hide the rotation display
    }
  });

  
  canvas.on("object:rotating", (e) => {
    const object = e.target;
    if (object && typeof object.angle === 'number') {
      const objectBounds = object.getBoundingRect();
      const displayX = objectBounds.left + objectBounds.width / 2 - 15;
      const displayY = objectBounds.top + objectBounds.height + 55; // 10 pixels below the object
      rotationDisplay?.set({ 
        text: `${object.angle.toFixed(0)}°`,
        left: displayX,
        top: displayY,
        opacity: 1 // Show the rotation display when rotating
      } as Partial<fabric.Object>); // Type assertion to fix the lint error
      rotationDisplay?.setCoords();
      canvas.requestRenderAll();
    } else {
      rotationDisplay?.set({ opacity: 0 }); // Hide when not rotating
      canvas.requestRenderAll();
    }
  });

  canvas.on("object:modified", () => {
    rotationDisplay?.set({ opacity: 0 }); // Hide when rotation stops
    canvas.requestRenderAll();
  });
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
        canvas.off("object:rotating");
      }
    };
  }, [save, canvas, clearSelectionCallback, setSelectedObjects]);
};