import { drawBackgroundAndLogo } from './imageUtils';
import { drawRectangle, drawLine, drawTriangle, drawOval } from './figureUtils';
import { drawText, drawTextInRectangle, drawWordInRectangle } from './textUtils';

export const drawElementsOnCanvas = async (ctx, elements) => {
  for (const style of elements) {
    switch (style.type) {
      case 'text':
        await drawText(ctx, style);
        break;
      // case 'word selected':
      //   drawWordInRectangle(ctx, 'TEST', 225, 225, attributes, style);
      //   break;
      // case 'selected':
      //   drawTextInRectangle(ctx, style);
      //   break;
      // case 'rectangle':
      //   drawRectangle(ctx, style);
      //   break;
      // case 'triangle':
      //   drawTriangle(ctx, style);
      //   break;
      // case 'line':
      //   drawLine(ctx, style);
      //   break;
      // case 'oval':
      //   drawOval(ctx, style);
      //   break;
      case 'background':
      case 'image':
        await drawBackgroundAndLogo(ctx, style);
        break;
    }
  }
};
