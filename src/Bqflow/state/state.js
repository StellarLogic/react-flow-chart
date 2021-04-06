import { createStore } from "@halka/state";
import produce from "immer";
import clamp from "clamp";
import { nanoid } from "nanoid";

import { SHAPE_TYPES, DEFAULTS, LIMITS } from "./constants";

const APP_NAMESPACE = "__integrtr_diagrams__";

const baseState = {
  selectedSwimlane: null,
  swimlanes: {
    selected: null,
    shapes: {},
    lastId: null,
    lines: {},
  },
};

export const useShapes = createStore(() => {
  const initialState = JSON.parse(localStorage.getItem(APP_NAMESPACE));
  return { ...baseState, swimlanes: initialState ?? {} };
});

export const setState = (fn) => useShapes.set(produce(fn));

// ######## ADD SWIMLANES ################
export const addSwimLane = () => {
  setState((state) => {
    state.swimlanes[nanoid()] = {
      selected: null,
      shapes: {},
      lastId: null,
      lines: {},
    };
  });
};

// ######## SAVE TO LOCAL ################
export const saveDiagram = () => {
  localStorage.removeItem(APP_NAMESPACE);
  setState((state) => {
    state.selectedSwimlane = null;
    for (const key in state.swimlanes) {
      if (Object.hasOwnProperty.call(state.swimlanes, key)) {
        state.swimlanes[key].selected = null;
      }
    }
  });
  const state = useShapes.get();
  console.log(`statestatestatestate`, state);
  localStorage.setItem(APP_NAMESPACE, JSON.stringify(state.swimlanes));
};

// ######## RESET STATE ################
export const reset = () => {
  localStorage.removeItem(APP_NAMESPACE);
  console.log(`baseState`, baseState);
  setState((state) => {
    state.selectedSwimlane = null;
    state.swimlanes = {};
  });
};

// ######## CREATE RECTANLE SHAPE ################
export const createRectangle = (id, { x, y }) => {
  setState((state) => {
    state.swimlanes[id].shapes[nanoid()] = {
      type: SHAPE_TYPES.RECTANGLE,
      width: DEFAULTS.RECTANGLE.WIDTH,
      height: DEFAULTS.RECTANGLE.HEIGHT,
      fill: DEFAULTS.RECTANGLE.FILL,
      stroke: DEFAULTS.RECTANGLE.STROKE,
      rotation: DEFAULTS.RECTANGLE.ROTATION,
      x,
      y,
    };
  });
};

// ######## CREATE CIRCLE SHAPE ################
export const createCircle = (id, { x, y }) => {
  setState((state) => {
    state.swimlanes[id].shapes[nanoid()] = {
      type: SHAPE_TYPES.CIRCLE,
      radius: DEFAULTS.CIRCLE.RADIUS,
      fill: DEFAULTS.CIRCLE.FILL,
      stroke: DEFAULTS.CIRCLE.STROKE,
      x,
      y,
    };
  });
};

// ######## CREATE SQUARE SHAPE ################
export const createSquare = (id, { x, y }) => {
  setState((state) => {
    state.swimlanes[id].shapes[nanoid()] = {
      type: SHAPE_TYPES.SQUARE,
      width: DEFAULTS.SQUARE.WIDTH,
      height: DEFAULTS.SQUARE.HEIGHT,
      fill: DEFAULTS.SQUARE.FILL,
      stroke: DEFAULTS.SQUARE.STROKE,
      rotation: DEFAULTS.SQUARE.ROTATION,
      x,
      y,
    };
  });
};

// ######## SELECT SHAPE ################
export const selectShape = (swimlaneId, id) => {
  setState((state) => {
    state.selectedSwimlane = null;

    for (const key in state.swimlanes) {
      if (Object.hasOwnProperty.call(state.swimlanes, key)) {
        state.swimlanes[key].selected = null;
      }
    }

    state.swimlanes[swimlaneId].selected = id;
    state.selectedSwimlane = swimlaneId;
  });
};

// ######## CLEAR SELECT SHAPE ################
export const clearSelection = (swimlaneId) => {
  setState((state) => {
    state.swimlanes[swimlaneId].selected = null;
    state.selectedSwimlane = null;
  });
};

// ######## DELTE SELECT SHAPE ################
export const deleteSelected = () => {
  const mainState = useShapes.get();
  const selectedSwimLaneId = mainState.selectedSwimlane;
  // check for selected swimlane id
  const selectedShapeId = mainState.swimlanes[selectedSwimLaneId].selected;
  if (selectedSwimLaneId) {
    // check for selected shape id
    if (selectedShapeId) {
      setState((state) => {
        delete state.swimlanes[selectedSwimLaneId].shapes[selectedShapeId];
      });
    }
  }
  const lines = mainState.swimlanes[selectedSwimLaneId].lines;
  setState((state) => {
    for (const key in lines) {
      if (
        lines[key].startId === selectedShapeId ||
        lines[key].endId === selectedShapeId
      ) {
        delete state.swimlanes[selectedSwimLaneId].lines[key];

        if (Object.entries(state.swimlanes[selectedSwimLaneId].lines)) {
          state.swimlanes[selectedSwimLaneId].lastId = null;
        }
      }
    }
  });
};

// ######## MOVE SHAPE ################
export const moveShape = (swimlaneId, id, event) => {
  setState((state) => {
    const shape = state.swimlanes[swimlaneId].shapes[id];

    if (shape) {
      shape.x = event.target.x();
      shape.y = event.target.y();
    }
  });
};

// ######## REMOVE SWIMLANE ################
export const removeSwimlane = (swimlaneId) => {
  setState((state) => {
    delete state.swimlanes[swimlaneId];
  });
};

// ######## UPDATE ATTRIBUTES SWIMLANE ################
export const updateAttribute = (attr, value) => {
  const state = useShapes.get();
  const selectedSwimLaneId = state.selectedSwimlane;
  // check for selected swimlane id
  if (selectedSwimLaneId) {
    // check for selected shape id
    const selectedShapeId = state.swimlanes[selectedSwimLaneId].selected;
    if (selectedShapeId) {
      setState((state) => {
        const shape =
          state.swimlanes[selectedSwimLaneId].shapes[selectedShapeId];

        if (shape) {
          shape[attr] = value;
        }
      });
    }
  }
};

export const transformRectangleShape = (node, swimlaneId, id, event) => {
  // transformer is changing scale of the node
  // and NOT its width or height
  // but in the store we have only width and height
  // to match the data better we will reset scale on transform end
  const scaleX = node.scaleX();
  const scaleY = node.scaleY();

  // we will reset the scale back
  node.scaleX(1);
  node.scaleY(1);

  setState((state) => {
    const shape = state.swimlanes[swimlaneId].shapes[id];

    if (shape) {
      shape.x = node.x();
      shape.y = node.y();

      shape.rotation = node.rotation();

      shape.width = clamp(
        // increase the width in order of the scale
        node.width() * scaleX,
        // should not be less than the minimum width
        LIMITS.RECTANGLE.MIN,
        // should not be more than the maximum width
        LIMITS.RECTANGLE.MAX
      );
      shape.height = clamp(
        node.height() * scaleY,
        LIMITS.RECTANGLE.MIN,
        LIMITS.RECTANGLE.MAX
      );
    }
  });
};

export const transformCircleShape = (node, swimlaneId, id, event) => {
  // transformer is changing scale of the node
  // and NOT its width or height
  // but in the store we have only width and height
  // to match the data better we will reset scale on transform end
  const scaleX = node.scaleX();

  // we will reset the scale back
  node.scaleX(1);
  node.scaleY(1);

  setState((state) => {
    const shape = state.swimlanes[swimlaneId].shapes[id];

    if (shape) {
      shape.x = node.x();
      shape.y = node.y();

      shape.radius = clamp(
        (node.width() * scaleX) / 2,
        LIMITS.CIRCLE.MIN,
        LIMITS.CIRCLE.MAX
      );
    }
  });
};

//############## UPDATE TEXT #####################
export const updateText = (value, swimlaneId, shapeId) => {
  setState((state) => {
    state.swimlanes[swimlaneId].shapes[shapeId].type.text = value;
  });
};
