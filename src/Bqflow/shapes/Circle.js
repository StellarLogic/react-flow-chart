import React, { useRef, useEffect, useCallback } from "react";
import {
  Circle as KonvaCircle,
  Transformer,
  Text as KonvaText,
} from "react-konva";
import { updateLinePoint } from "../state/lineState";
import { LIMITS } from "../state/constants";
import {
  selectShape,
  transformCircleShape,
  moveShape,
  useShapes,
} from "../state/state";

const boundBoxCallbackForCircle = (oldBox, newBox) => {
  // limit resize
  if (
    newBox.width < LIMITS.CIRCLE.MIN ||
    newBox.height < LIMITS.CIRCLE.MIN ||
    newBox.width > LIMITS.CIRCLE.MAX ||
    newBox.height > LIMITS.CIRCLE.MAX
  ) {
    return oldBox;
  }
  return newBox;
};

export function Circle({ id, isSelected, type, swimlaneId, ...shapeProps }) {
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
      transformCircleShape(shapeRef.current, swimlaneId, id, event);
    },
    [id]
  );

  return (
    <>
      <KonvaCircle
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
          x={shape.x - shape.radius / 2}
          y={shape.y}
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
          rotateEnabled={false}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-right",
            "bottom-left",
          ]}
          boundBoxFunc={boundBoxCallbackForCircle}
        />
      )}
    </>
  );
}
