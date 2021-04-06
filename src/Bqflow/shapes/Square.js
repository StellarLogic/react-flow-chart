import React, { useRef, useEffect, useCallback } from "react";
import {
  Rect as KonvaSquare,
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
    newBox.width < LIMITS.SQUARE.MIN ||
    newBox.height < LIMITS.SQUARE.MIN ||
    newBox.width > LIMITS.SQUARE.MAX ||
    newBox.height > LIMITS.SQUARE.MAX
  ) {
    return oldBox;
  }
  return newBox;
};

export function Square({ id, isSelected, type, swimlaneId, ...shapeProps }) {
  const shapeRef = useRef();
  const transformerRef = useRef();
  const textRef = useRef();

  const selectedSwimlane = useShapes((state) => state.swimlanes[swimlaneId]);
  const shape = useShapes((state) => state.swimlanes[swimlaneId]?.shapes[id]);

  useEffect(() => {
    if (isSelected) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleSelect = useCallback(
    (event) => {
      event.evt.preventDefault();
      event.cancelBubble = true;

      selectShape(swimlaneId, id);
    },
    [id]
  );

  const handleDrag = useCallback(
    (event) => {
      moveShape(swimlaneId, id, event);
    },
    [id]
  );

  const handleTransform = useCallback(
    (event) => {
      transformRectangleShape(
        shapeRef.current,
        swimlaneId,
        swimlaneId,
        id,
        event
      );
    },
    [id]
  );

  return (
    <>
      <KonvaSquare
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
          y={shape.y + shape.height / 2}
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
