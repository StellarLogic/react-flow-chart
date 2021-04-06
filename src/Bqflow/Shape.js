import React, { useCallback } from "react";
import { SHAPE_TYPES } from "./state/constants";
import { useShapes } from "./state/state";
import { Circle } from "./shapes/Circle";
import { Rectangle } from "./shapes/Rectangle";
import { Square } from "./shapes/Square";

export function Shape({ shape, swimlaneId }) {
  const isSelectedSelector = useCallback(
    (state) =>
      state.swimlanes[swimlaneId] &&
      state.swimlanes[swimlaneId].selected === shape.id,
    [shape, swimlaneId]
  );

  const isSelected = useShapes(isSelectedSelector);

  if (shape.type.type === SHAPE_TYPES.RECTANGLE.type) {
    return (
      <Rectangle {...shape} isSelected={isSelected} swimlaneId={swimlaneId} />
    );
  } else if (shape.type.type === SHAPE_TYPES.CIRCLE.type) {
    return (
      <Circle {...shape} isSelected={isSelected} swimlaneId={swimlaneId} />
    );
  } else if (shape.type.type === SHAPE_TYPES.SQUARE.type) {
    return (
      <Square {...shape} isSelected={isSelected} swimlaneId={swimlaneId} />
    );
  }

  return null;
}
