import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  Rect as KonvaRectangle,
  Transformer,
  Text as KonvaText,
} from "react-konva";
import { LIMITS } from "../state/constants";
import { updateLinePoint } from "../state/lineState";
import {
  selectShape,
  transformRectangleShape,
  moveShape,
  useShapes,
} from "../state/state";

const boundBoxCallbackForRectangle = (oldBox, newBox) => {
  // limit resize
  if (
    newBox.width < LIMITS.RECTANGLE.MIN ||
    newBox.height < LIMITS.RECTANGLE.MIN ||
    newBox.width > LIMITS.RECTANGLE.MAX ||
    newBox.height > LIMITS.RECTANGLE.MAX
  ) {
    return oldBox;
  }
  return newBox;
};

export function Rectangle({ id, isSelected, type, swimlaneId, ...shapeProps }) {
  const shapeRef = useRef();
  const transformerRef = useRef();
  const textRef = useRef();
  const { swimlanes } = useShapes((state) => state);

  const shape = swimlanes && swimlanes[swimlaneId]?.shapes[id];

  useEffect(() => {
    if (isSelected) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleSelect = useCallback(
    (event) => {
      // event.evt.preventDefault();
      event.cancelBubble = true;
      selectShape(swimlaneId, id);
    },
    [id, swimlaneId]
  );

  const handleDrag = useCallback(
    (event) => {
      moveShape(swimlaneId, id, event);
    },
    [id]
  );

  const handleTransform = useCallback(
    (event) => {
      transformRectangleShape(shapeRef.current, swimlaneId, id, event);
    },
    [id]
  );

  return (
    <>
      <KonvaRectangle
        onClick={handleSelect}
        onTap={handleSelect}
        onContextMenu={handleSelect}
        onDragStart={handleSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          handleDrag(e);
          updateLinePoint(e, id, swimlaneId);
        }}
        onTransformEnd={handleTransform}
      />
      {shape && (
        <KonvaText
          x={shape.x + shape.width / 4}
          y={shape.y + shape.height / 2.5}
          text={type.text}
          ref={textRef}
          wrap="char"
          align="center"
        />
      )}
      {isSelected && (
        <Transformer
          anchorSize={5}
          borderDash={[6, 2]}
          ref={transformerRef}
          boundBoxFunc={boundBoxCallbackForRectangle}
        />
      )}
    </>
  );
}
