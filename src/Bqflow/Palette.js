import React from "react";
import { nanoid } from "nanoid";
import { DRAG_DATA_KEY, SHAPE_TYPES } from "./state/constants";

const handleDragStart = (event, text) => {
  const type = event.target.dataset.shape;
  if (type) {
    // x,y coordinates of the mouse pointer relative to the position of the padding edge of the target node
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;
    // dimensions of the node on the browser
    const clientWidth = event.target.clientWidth;
    const clientHeight = event.target.clientHeight;

    const dragPayload = JSON.stringify({
      type,
      offsetX,
      offsetY,
      clientWidth,
      clientHeight,
      text,
    });

    event.nativeEvent.dataTransfer.setData(DRAG_DATA_KEY, dragPayload);
  }
};

export function Palette({ palette = [] }) {
  const updatedPalette = palette.map((shape) => ({
    ...shape,
    id: nanoid(),
    type: shape.type.toUpperCase(),
    className: shape.type.toLowerCase(),
  }));
  return (
    <aside className="palette">
      <h2>Shapes</h2>
      {Object.entries(SHAPE_TYPES).map(([, { type, text }], index) => {
        return (
          <div
            key={index}
            className={`shape ${type.toLowerCase()}`}
            data-shape={type}
            draggable
            onDragStart={(e) => handleDragStart(e, text)}
          >
            {text}
          </div>
        );
      })}
      {updatedPalette.map(({ id, className, type, text }) => {
        return (
          <div
            key={id}
            className={`shape ${className}`}
            data-shape={SHAPE_TYPES[type].type}
            draggable
            onDragStart={(e) => handleDragStart(e, text)}
          >
            {text}
          </div>
        );
      })}
    </aside>
  );
}
