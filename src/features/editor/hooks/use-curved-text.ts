import { fabric } from 'fabric';
import { ITextboxOptions } from 'fabric/fabric-impl';

export type CurvedTextOptions = Omit<ITextboxOptions, 'path'> & {
  path?: fabric.Path;
  pathSide?: 'left' | 'right';
  pathStartOffset?: number;
};

export const useCurvedText = (canvas: fabric.Canvas) => {
  const addCurvedText = (text: string, options?: Partial<CurvedTextOptions>) => {
    const path = new fabric.Path('M 0 0 C 50 0 100 50 150 0', {
      left: 100,
      top: 100,
      fill: '',
      stroke: 'transparent'
    });

    const textOnPath = new fabric.Text(text, {
      ...options,
      path,
      textAlign: 'center',
      pathSide: 'left',
      pathStartOffset: 0
    } as CurvedTextOptions);

    canvas.add(textOnPath);
    canvas.renderAll();
  };

  return { addCurvedText };
};
