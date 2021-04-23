import { nanoid } from "nanoid";
import { useShapes, setState, clearSelection, deleteSelected } from "./state";

// ########### SELECT SWIMLANE ############
export const selectSwimLane = (e, swimlaneId) => {
  setState((state) => {
    state.selectedSwimlane = swimlaneId;
    state.ccp = true;
  });
  e.evt.preventDefault();
};

// ########### COPY SHAPE ############
export const copy = (swimlaneId, shapeId, shape) => {
  const mainState = useShapes.get();
  const copyShape = mainState.copiedShape.shape;
  setState((state) => {
    if (!Object.keys(copyShape).length && Object.keys(copyShape).length <= 1) {
      state.copiedShape.copiedSwimlaneId = swimlaneId;
      state.copiedShape.shape[shapeId] = shape;
    }
    state.copiedShape.type = "copy";
  });
};

// ########### CUT SHAPE ############
export const cut = (swimlaneId, shapeId, shape) => {
  const mainState = useShapes.get();
  const copyShape = mainState.copiedShape.shape;

  setState((state) => {
    if (!Object.keys(copyShape).length) {
      state.copiedShape.copiedSwimlaneId = swimlaneId;
      state.copiedShape.shape[shapeId] = shape;
    }
    state.copiedShape.type = "cut";
  });
};

// ########### COPY SHAPE ############
export const past = () => {
  debugger;
  const mainState = useShapes.get();
  const swimlaneId = mainState.selectedSwimlane;
  const copyShape = mainState.copiedShape.shape;
  const copiedSwimlaneId = mainState.copiedShape.copiedSwimlaneId;
  const type = mainState.copiedShape.type;

  const lines = mainState.swimlanes[copiedSwimlaneId].lines;

  setState((state) => {
    if (Object.keys(copyShape).length) {
      const id = Object.keys(copyShape)[0];
      const shape = copyShape[id];
      const cutCopyState = state.copiedShape;
      state.swimlanes[swimlaneId].shapes[id] = shape;
      state.ccp = false;
      cutCopyState.copiedSwimlaneId = {};
      cutCopyState.shape = {};
      cutCopyState.type = "";
      if (type == "cut") {
        for (const key in lines) {
          if (lines[key].startId === id || lines[key].endId === id) {
            delete state.swimlanes[copiedSwimlaneId].lines[key];
            state.swimlanes[copiedSwimlaneId].lastId = null;
          }
        }
        delete state.swimlanes[copiedSwimlaneId].shapes[id];
      }
    }
  });
};
