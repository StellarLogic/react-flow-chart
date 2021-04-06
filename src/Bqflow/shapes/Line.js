import React from "react";
import { Arrow as KonvaLine } from "react-konva";

export function Line({ points, fill }) {
  return (
    <KonvaLine
      points={points}
      fill={`${fill ? fill : "#000"}`}
      stroke={`${fill ? fill : "#000"}`}
      strokeWidth={2}
    />
  );
}
