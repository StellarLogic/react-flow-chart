import { nanoid } from "nanoid";
import { useShapes, setState, clearSelection } from "./state";

// ############## SET INITIAL LINE POINTS ##############

export const setInitialPoint = (shape, shapeId, swimlaneId) => {
  // console.log(`setInitialPoint`, shape, shapeId, swimlaneId);
  const mainState = useShapes.get();
  const uniqueId = nanoid();
  const randomColor = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
  debugger;
  setState((state) => {
    const swimlane = mainState.swimlanes[swimlaneId];
    if (!Object.keys(swimlane.lines).length) {
      const points = calucaltePoints("setInitial", shape, swimlane);

      state.swimlanes[swimlaneId].lastId = uniqueId;
      state.swimlanes[swimlaneId].lines[uniqueId] = {
        startId: shapeId,
        points: points,
        fill: randomColor,
        endId: null,
      };
    } else if (
      swimlane.lastId &&
      swimlane.lines[swimlane.lastId].endId === null &&
      swimlane.lines[swimlane.lastId].startId == shapeId
    ) {
      return;
    } else if (swimlane.lastId && !swimlane.lines[swimlane.lastId].endId) {
      const points = calucaltePoints("setEnd", shape, swimlane);
      state.swimlanes[swimlaneId].lines[swimlane.lastId].endId = shapeId;
      state.swimlanes[swimlaneId].lines[swimlane.lastId].points = points;
    } else {
      const points = calucaltePoints("setInitial", shape, swimlane);

      state.swimlanes[swimlaneId].lastId = uniqueId;
      state.swimlanes[swimlaneId].lines[uniqueId] = {
        startId: shapeId,
        points: points,
        fill: randomColor,
        endId: null,
      };
    }
  });
};

// ########### UPDATE POINTS ################
export const updateLinePoint = (e, shapeId, swimlaneId) => {
  // debugger;
  const mainState = useShapes.get();
  const shape = mainState.swimlanes[swimlaneId].shapes[shapeId];

  setState((state) => {
    const swimlane = mainState.swimlanes[swimlaneId];
    const lines = swimlane.lines;

    for (const key in lines) {
      if (lines[key].startId === shapeId) {
        const points = calucaltePoints("setInitial", shape, swimlane);
        lines[key].points.map((point, index) => {
          const line = state.swimlanes[swimlaneId].lines[key];
          if (index <= points.length - 1) {
            line.points[index] = points[index];
          } else if (index == 3) {
            line.points[index] = points[1];
          } else {
            line.points[index] = line.points[index];
          }
        });
      } else if (lines[key].endId === shapeId) {
        const points = calucaltePoints("updateEndPoint", shape, swimlane);
        console.log(`lines[key].points,points`, lines[key].points, points);
        const line = state.swimlanes[swimlaneId].lines[key];
        line.points = points;
      }
    }
  });
};

// ########### DELETE UNWANTED STARTING POINT ################
export const deleteStartPoint = (swimlane, swimlaneId) => {
  const mainState = useShapes.get();
};

// ########### CALCULATE START AND END POINTS ################
const calucaltePoints = (method, shape, swimlane) => {
  const type = shape.type.type.toLowerCase();
  console.log(`shape,type`, method, shape, swimlane);
  const lastId = swimlane.lastId;
  const lines = swimlane.lines;

  if (method == "setInitial") {
    if (type == "rectangle") {
      return [shape.x + shape.width, shape.y + shape.height / 2];
    } else if (type == "square") {
      return [shape.x + shape.width, shape.y + shape.height / 2];
    } else if (type == "circle") {
      return [shape.x + shape.radius, shape.y];
    }
  } else if (method == "setEnd") {
    const prevpoints = swimlane.lines[lastId].points;
    const { x, y, height, width, radius } = shape;
    if (type == "rectangle") {
      return [
        ...prevpoints,
        (prevpoints[0] + x) / 2,
        prevpoints[1],
        (prevpoints[0] + x) / 2,
        (prevpoints[1] + y) / 2,
        x,
        y + height / 2,
      ];
    } else if (type == "square") {
      return [
        ...prevpoints,
        (prevpoints[0] + x) / 2,
        prevpoints[1],
        (prevpoints[0] + x) / 2,
        y + height / 2,
        x,
        y + height / 2,
      ];
    } else if (type == "circle") {
      return [
        ...prevpoints,
        (prevpoints[0] + x) / 2,
        prevpoints[1],
        (prevpoints[0] + x) / 2,
        y,
        x - radius,
        y,
      ];
    }
  } else if (method == "updateEndPoint") {
    const prevpoints = swimlane.lines[lastId].points;
    const { x, y, height, width, radius } = shape;
    const updatedArr = [...prevpoints].map((point, index) => {
      if (index == 4) {
        return x;
      } else if (index == 5) {
        return y;
      }
      return point;
    });

    console.log(`updatedArr`, updatedArr, prevpoints);
    return updatedArr;
  }

  return [];
};

// ########### CANVAS HEIGHT UPDATE FUNCTION ################
// export const updateCanvasHeight = (x, y, swimlaneId) => {
//   // console.log(`object`, x, y);
//   const mainState = useShapes.get();
//   setState((state) => {
//     // console.log(`mainState.swimlanes`, mainState.swimlanes);
//     state.swimlanes[swimlaneId].canvas.height = y;
//   });
// };
