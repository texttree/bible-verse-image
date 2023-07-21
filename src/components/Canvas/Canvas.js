import React, { useEffect } from 'react';
import { useCanvasContext } from './useCanvasContext';

const Canvas = ({ infocanvas, infoimage, elements, ...props }) => {
  const { contextRef, setCanvasRef } = useCanvasContext(
    infocanvas.height ?? 1200,
    infocanvas.width ?? 1200
  );

  const drawImageOnCanvas = (ctx, imageSource, infoimage, calculateImageParameters) => {
    if (!imageSource || !infoimage) {
      return;
    }

    const pic = new Image();
    pic.src = imageSource;

    pic.onload = function () {
      const { sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height } =
        calculateImageParameters(pic, ctx, infoimage);
      ctx.drawImage(
        pic,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        x,
        y,
        width,
        height
      );
    };
  };

  const drawElementsOnCanvas = (ctx, elements, drawWrappedText) => {
    elements.forEach((style) => {
      switch (style.type) {
        case 'image':
          const logo = new Image();
          logo.src = style.props.url;

          logo.onload = function () {
            const logoX = style.x;
            const logoY = style.y;
            if (style.props.zoom) {
              const zoom = style.props.zoom;
              const logoWidth = logo.width * zoom;
              const logoHeight = logo.height * zoom;

              ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
            } else {
              ctx.drawImage(logo, logoX, logoY);
            }
          };
          break;
        case 'text':
          ctx.fillStyle = style.props.fillStyle;
          ctx.font = `${style.props.fontStyle} ${style.props.fontSize}px ${style.props.font}`;
          const fontHeight = style.props.fontSize;
          const lineHeight = style.props.lineHeight ?? 1.2 * fontHeight;

          drawWrappedText(
            ctx,
            style.props.text,
            style.x,
            style.y,
            style.props.blockWidth,
            lineHeight,
            fontHeight,
            style.props.alignment
          );
          break;
        default:
          break;
      }
    });
  };

  const draw = () => {
    const ctx = contextRef?.current;
    if (!ctx) {
      return;
    }

    const calculateImageParameters = (pic, ctx, infoimage) => {
      let sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height;

      sourceX = 0;
      sourceY = 0;
      sourceWidth = pic.width;
      sourceHeight = pic.height;
      x = 0;
      y = 0;
      width = ctx.canvas.width;
      height = ctx.canvas.height;

      if (infoimage.zoom === undefined) {
        ({ sourceX, sourceY, sourceWidth, sourceHeight } = centerImage(
          pic,
          ctx.canvas.width,
          ctx.canvas.height
        ));
      } else {
        const zoom = infoimage.zoom;
        width = pic.width * zoom;
        height = pic.height * zoom;
        x = (ctx.canvas.width - width) / 2;
        y = (ctx.canvas.height - height) / 2;
      }

      if (infoimage.offsetX !== undefined && infoimage.offsetY !== undefined) {
        x += infoimage.offsetX;
        y += infoimage.offsetY;
      }

      return { sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height };
    };

    const centerImage = (pic, canvasWidth, canvasHeight) => {
      const imageWidth = pic.width;
      const imageHeight = pic.height;

      const canvasAspectRatio = canvasWidth / canvasHeight;
      const imageAspectRatio = imageWidth / imageHeight;

      let sourceX, sourceY, sourceWidth, sourceHeight;

      if (imageAspectRatio > canvasAspectRatio) {
        sourceWidth = imageHeight * canvasAspectRatio;
        sourceHeight = imageHeight;
        sourceX = (imageWidth - sourceWidth) / 2;
        sourceY = 0;
      } else {
        sourceWidth = imageWidth;
        sourceHeight = imageWidth / canvasAspectRatio;
        sourceX = 0;
        sourceY = (imageHeight - sourceHeight) / 2;
      }

      return { sourceX, sourceY, sourceWidth, sourceHeight };
    };

    const drawWrappedText = (
      ctx,
      text,
      x,
      y,
      blockWidth,
      lineHeight,
      fontHeight,
      alignment
    ) => {
      const words = text.split(' ');
      let line = '';
      blockWidth = blockWidth ?? ctx.canvas.width;

      for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i];
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        testLine += ' ';

        if (testWidth > blockWidth) {
          let offsetX = 0;

          switch (alignment) {
            case 'center':
              offsetX = (blockWidth - ctx.measureText(line).width) / 2;
              break;
            case 'right':
              offsetX = blockWidth - ctx.measureText(line).width;
              break;
            default:
              break;
          }

          ctx.fillText(line, x + offsetX, y + fontHeight);
          line = words[i] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }

      let offsetX = 0;

      switch (alignment) {
        case 'center':
          offsetX = (blockWidth - ctx.measureText(line).width) / 2;
          break;
        case 'right':
          offsetX = blockWidth - ctx.measureText(line).width;
          break;
        default:
          break;
      }
      ctx.fillText(line, x + offsetX, y + lineHeight);
    };

    if (infoimage.srcimage) {
      drawImageOnCanvas(ctx, infoimage.srcimage, infoimage, calculateImageParameters);
    }

    drawElementsOnCanvas(ctx, elements, drawWrappedText);
  };

  useEffect(() => {
    let animationFrameId;

    const render = () => {
      draw();
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return <canvas ref={setCanvasRef} {...props} />;
};

export default Canvas;
