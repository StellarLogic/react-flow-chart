export const SHAPE_TYPES = {
  RECTANGLE: {
    type: "rectangle",
    text: "RECTANGLE",
  },
  CIRCLE: {
    type: "circle",
    text: "CIRCLE",
  },
  SQUARE: {
    type: "Square",
    text: "SQUARE",
  },
};

export const DEFAULTS = {
  RECTANGLE: {
    STROKE: "#000000",
    FILL: "#ffffff",
    WIDTH: 150,
    HEIGHT: 100,
    ROTATION: 0,
    TEXT: "RECTANGLE",
  },
  CIRCLE: {
    STROKE: "#000000",
    FILL: "#ffffff",
    RADIUS: 50,
    TEXT: "CIRCLE",
  },
  SQUARE: {
    STROKE: "#000000",
    FILL: "#ffffff",
    WIDTH: 75,
    HEIGHT: 75,
    ROTATION: 0,
    TEXT: "SQUARE",
  },
};

export const LIMITS = {
  RECTANGLE: {
    MAX: 1000,
    MIN: 10,
  },
  CIRCLE: {
    MAX: 500,
    MIN: 5,
  },
  SQUARE: {
    MAX: 500,
    MIN: 5,
  },
};

export const DRAG_DATA_KEY = "__drag_data_payload__";
