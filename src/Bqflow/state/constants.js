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
    STROKE: "#ddd",
    // FILL: "#ffffff",
    WIDTH: 150,
    HEIGHT: 85,
    ROTATION: 0,
    TEXT: "RECTANGLE",
    CORNERRADIUS: 10,
    FILLLINEARGRADIENTSTARTPOINT: { x: 0, y: 0 },
    FILLLINEARGRADIENTENDPOINT: { x: 0, y: 100 },
    FILLLINEARGRADIENTCOLORSTOPS: [0, "#fff", 1, "#68adb9"],
  },
  CIRCLE: {
    STROKE: "#ddd",
    // FILL: "#ffffff",
    RADIUS: 50,
    TEXT: "CIRCLE",
    CORNERRADIUS: 10,
    FILLLINEARGRADIENTSTARTPOINT: { x: 25, y: 25 },
    FILLLINEARGRADIENTENDPOINT: { x: 100, y: 100 },
    FILLLINEARGRADIENTCOLORSTOPS: [0, "#fff", 1, "#68adb9"],
  },
  SQUARE: {
    STROKE: "#ddd",
    // FILL: "#ffffff",
    WIDTH: 75,
    HEIGHT: 75,
    ROTATION: 0,
    TEXT: "SQUARE",
    CORNERRADIUS: 10,
    FILLLINEARGRADIENTSTARTPOINT: { x: 0, y: 0 },
    FILLLINEARGRADIENTENDPOINT: { x: 10, y: 10 },
    FILLLINEARGRADIENTCOLORSTOPS: [0, "#fff", 1, "#68adb9"],
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
