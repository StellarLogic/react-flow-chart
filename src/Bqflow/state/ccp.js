import { nanoid } from "nanoid";
import { useShapes, setState, clearSelection } from "./state";

// ########### SELECT SWIMLANE ############
export const selectSwimLane = (e, swimlaneId) => {
  console.log(`swimlaneId`, swimlaneId);
  setState((state) => {
    state.selectedSwimlane = swimlaneId;
    state.ccp = true;
  });
  e.evt.preventDefault();
};

// ########### COPY SHAPE ############
export const copy = (swimlaneId, shapeId, shape) => {
  setState((state) => {
    state.copiedShape[shapeId] = shape;
  });
};

// ########### CUT SHAPE ############
export const cut = (swimlaneId, shapeId, shape) => {
  setState((state) => {
    state.copiedShape[shapeId] = shape;
    delete state.swimlanes[swimlaneId].shapes[shapeId];
  });
};

// ########### COPY SHAPE ############
export const past = (shapeId) => {
  const mainState = useShapes.get();
  const swimlaneId = mainState.selectedSwimlane;
  const copyShape = mainState.copiedShape;
  console.log(`copyShape`, copyShape);
  setState((state) => {
    if (Object.keys(copyShape).length) {
      const id = Object.keys(copyShape)[0];
      const shape = copyShape[id];
      state.swimlanes[swimlaneId].shapes[id] = shape;
    }
    state.copiedShape = {};
  });
};
