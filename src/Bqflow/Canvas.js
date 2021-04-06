import React, { useRef, useCallback } from "react";
import { Layer, Stage } from "react-konva";
import {
  clearSelection,
  createCircle,
  createRectangle,
  createSquare,
  removeSwimlane,
  useShapes,
} from "./state/state";
import { DRAG_DATA_KEY, SHAPE_TYPES } from "./state/constants";
import { Shape } from "./Shape";
import { Line } from "./shapes/Line";

const handleDragOver = (event) => event.preventDefault();

export function Canvas({ id: swimlaneId, swimlane, index }) {
  const shapes = swimlane && Object.entries(swimlane.shapes);
  const linesArr = swimlane && Object.entries(swimlane.lines);

  const stageRef = useRef();

  const handleDrop = useCallback(
    (event) => {
      const draggedData = event.nativeEvent.dataTransfer.getData(DRAG_DATA_KEY);
      if (draggedData) {
        const {
          offsetX,
          offsetY,
          type,
          clientHeight,
          clientWidth,
          text,
        } = JSON.parse(draggedData);
        stageRef.current.setPointersPositions(event);

        const coords = stageRef.current.getPointerPosition();

        if (type === SHAPE_TYPES.RECTANGLE.type) {
          // rectangle x, y is at the top,left corner
          createRectangle(swimlaneId, {
            x: coords.x - offsetX,
            y: coords.y - offsetY,
            text,
          });
        } else if (type === SHAPE_TYPES.CIRCLE.type) {
          // circle x, y is at the center of the circle
          createCircle(swimlaneId, {
            x: coords.x - (offsetX - clientWidth / 2),
            y: coords.y - (offsetY - clientHeight / 2),
            text,
          });
        } else if (type === SHAPE_TYPES.SQUARE.type) {
          createSquare(swimlaneId, {
            x: coords.x - offsetX,
            y: coords.y - offsetY,
            text,
          });
        }
      }
    },
    [swimlaneId]
  );

  return (
    <main className="canvas" onDrop={handleDrop} onDragOver={handleDragOver}>
      <div className="swim-no">Swimlane {index}</div>
      <p className="remove" onClick={() => removeSwimlane(swimlaneId)}>
        Remove
      </p>
      <Stage
        ref={stageRef}
        width={window.innerWidth - 250}
        height={350}
        onClick={() => clearSelection(swimlaneId)}
      >
        <Layer>
          {shapes.length > 0 &&
            shapes.map(([key, shape]) => (
              <Shape
                key={key}
                shape={{ ...shape, id: key }}
                swimlaneId={swimlaneId}
              />
            ))}
          {/* <Line {...{ points: [800, 78.5, 117, 10] }} /> */}
          {linesArr.length > 0 &&
            linesArr.map(([key, line]) => <Line key={key} {...line} />)}
        </Layer>
      </Stage>
    </main>
  );
}
