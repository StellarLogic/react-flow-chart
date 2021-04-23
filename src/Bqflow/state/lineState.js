import { nanoid } from "nanoid";
import { useShapes, setState, clearSelection } from "./state";

// ############## SET INITIAL LINE POINTS ##############

export const setInitialPoint = (shape, shapeId, swimlaneId) => {
  // console.log(`setInitialPoint`, shape, shapeId, swimlaneId);
  const mainState = useShapes.get();
  const uniqueId = nanoid();

  setState((state) => {
    const swimlane = mainState.swimlanes[swimlaneId];
    const { xPos: x, yPos: y } = calucaltePoints(shape, swimlane);

    if (swimlane.lastId == null) {
      state.swimlanes[swimlaneId].lastId = uniqueId;
      state.swimlanes[swimlaneId].lines[uniqueId] = {
        startId: shapeId,
        endId: null,
        points: [x, y],
        fill: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
      };
    }

    if (
      swimlane.lastId &&
      swimlane.lines[swimlane.lastId].endId === null &&
      swimlane.lines[swimlane.lastId].startId == shapeId
    ) {
      return;
    }

    if (swimlane.lastId && swimlane.lines[swimlane.lastId].endId == null) {
      state.swimlanes[swimlaneId].lines[swimlane.lastId].endId = shapeId;
      const shape = swimlane.shapes[shapeId];
      const type = swimlane.shapes[shapeId].type.type.toLowerCase();
      const [startX, startY] = swimlane.lines[swimlane.lastId].points;
      // console.log(`prevPoints`, startX, startY, x, y);
      // console.log(`startX > x && startY < y`, startX > x, startY < y);
      if (startX > x && startY < y) {
        // ##### SECOND BELOW AND After #####
        if (type === "rectangle") {
          state.swimlanes[swimlaneId].lines[swimlane.lastId].points = [
            startX,
            startY,
            startX + 10,
            startY,
            startX + 10,
            startY - 75,
            x - 20,
            startY - 75,
            x - 20,
            y,
            x,
            y,
          ];
        } else if (type === "square") {
          state.swimlanes[swimlaneId].lines[swimlane.lastId].points = [
            startX,
            startY,
            startX + 10,
            startY,
            startX + 10,
            startY - 75,
            x - 20,
            startY - 75,
            x - 20,
            y,
            x,
            y,
          ];
        } else if (type === "cricle") {
          state.swimlanes[swimlaneId].lines[swimlane.lastId].points = [
            startX,
            startY,
            startX + 10,
            startY,
            startX + 10,
            startY - 75,
            x - 20,
            startY - 75,
            x - 20,
            y,
            x,
            y,
          ];
        } else {
          state.swimlanes[swimlaneId].lines[swimlane.lastId].points = [
            startX,
            startY,
            startX + 10,
            startY,
            startX + 10,
            y - startY + startY,
            x,
            y,
          ];
        }
      } else if (startX > x && startY > y) {
        // ##### SECOND BEFORE AND ABOVE #####
        if (type === "rectangle") {
          state.swimlanes[swimlaneId].lines[swimlane.lastId].points = [
            startX,
            startY,
            startX + 10,
            startY,
            startX + 10,
            startY + 75,
            x - 20,
            startY + 75,
            x - 20,
            y,
            x,
            y,
          ];
        } else if (type === "square") {
          state.swimlanes[swimlaneId].lines[swimlane.lastId].points = [
            startX,
            startY,
            startX + 10,
            startY,
            startX + 10,
            startY + 75,
            x - 20,
            startY + 75,
            x - 20,
            y,
            x,
            y,
          ];
        } else if (type === "cricle") {
          state.swimlanes[swimlaneId].lines[swimlane.lastId].points = [
            startX,
            startY,
            startX + 10,
            startY,
            startX + 10,
            y + startY - startY,
            x,
            y,
          ];
        } else {
          state.swimlanes[swimlaneId].lines[swimlane.lastId].points = [
            startX,
            startY,
            startX + 10,
            startY,
            startX + 10,
            y + startY - startY,
            x,
            y,
          ];
        }
      } else if (startY == y) {
        // ##### ON THE SAME LINE  #####
        state.swimlanes[swimlaneId].lines[swimlane.lastId].points = [
          startX,
          startY,
          x,
          y,
        ];
      } else if (startY < y) {
        // ##### ABOVE #####
        state.swimlanes[swimlaneId].lines[swimlane.lastId].points = [
          startX,
          startY,
          startX + (x - startX) / 2,
          startY,
          startX + (x - startX) / 2,
          y,
          x,
          y,
        ];
      } else if (startY > y) {
        // ##### ABOVE #####
        state.swimlanes[swimlaneId].lines[swimlane.lastId].points = [
          startX,
          startY,
          startX + (x - startX) / 2,
          startY,
          startX + (x - startX) / 2,
          y,
          x,
          y,
        ];
      }
      // else if (startY > y) {
      //   // ##### ABOVE #####
      //   state.swimlanes[swimlaneId].lines[swimlane.lastId].points = [
      //     startX,
      //     startY,
      //     startX + (x - startX) / 2,
      //     startY,
      //     startX + (x - startX) / 2,
      //     y,
      //     x,
      //     y,
      //   ];
      // }
    } else {
      state.swimlanes[swimlaneId].lastId = uniqueId;
      state.swimlanes[swimlaneId].lines[uniqueId] = {
        startId: shapeId,
        endId: null,
        points: [x, y],
        fill: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
      };
    }
  });
};

// ########### UPDATE POINTS ################
export const updateLinePoint = (e, shapeId, swimlaneId) => {
  // debugger;
  const mainState = useShapes.get();
  setState((state) => {
    const swimlane = mainState.swimlanes[swimlaneId];
    const shape = mainState.swimlanes[swimlaneId].shapes[shapeId];
    const type = shape.type.type.toLowerCase();
    const { xPos: x, yPos: y } = calucaltePoints(shape, swimlane);
    debugger;
    for (const key in swimlane.lines) {
      const points = state.swimlanes[swimlaneId].lines[key].points;
      const lastPoints = mainState.swimlanes[swimlaneId].lines[key].points;

      if (swimlane.lines[key].startId === shapeId) {
        points[0] = x;
        points[1] = y;

        if (points.length == 8) {
          points[3] = y;
        }
      } else if (swimlane.lines[key].endId === shapeId) {
        points[points.length - 1] = y;
        const type = shape.type.type.toLowerCase();

        if (type === "circle") {
          points[points.length - 2] = x - shape.radius * 2;
          if (points.length == 8) {
            points[2] = (points[6] + points[1]) / 2;
            points[4] = (points[6] + points[1]) / 2;
            points[5] = y;
          }
        } else if (type === "rectangle") {
          points[points.length - 2] = x - shape.width;
          if (points.length == 8) {
            points[5] = y;
          }
        } else if (type === "square") {
          points[points.length - 2] = x - shape.width;
          if (points.length == 8) {
            points[2] = (points[6] + points[1]) / 2;
            points[4] = (points[6] + points[1]) / 2;
            points[5] = y;
          }
        }
      }
    }
  });
};

// ########### DELETE UNWANTED STARTING POINT ################
// export const deleteStartPoint = (swimlaneId) => {
//   const mainState = useShapes.get();
//   const swimlane = mainState.swimlanes[swimlaneId];
//   setState((state) => {
//     const lines = Object.entries(swimlane.lines);
//     console.log(`lines`, lines[lines.length - 1][0]);

//     if (swimlane.lines[swimlane.lastId].endId == null) {
//       delete state.swimlanes[swimlaneId].lines[swimlane.lastId];
//       state.swimlanes[swimlaneId].lastId = lines[lines.length - 1][0];
//     }
//   });
// };

// ########### CALCULATE START AND END POINTS ################
const calucaltePoints = (shape, swimlane) => {
  const type = shape.type.type.toLowerCase();
  // console.log(`shape,type`, shape, type);
  let xPos = 0,
    yPos = 0;
  const lastId = swimlane.lastId;
  const lines = swimlane.lines;

  if (type === "rectangle") {
    if (lastId && lines[lastId].endId === null) {
      xPos = shape.x;
      yPos = shape.y + shape.height / 2;
    } else {
      xPos = shape.x + shape.width;
      yPos = shape.y + shape.height / 2;
    }
    return { xPos, yPos };
  } else if (type === "circle") {
    if (lastId && lines[lastId].endId === null) {
      xPos = shape.x - shape.radius;
      yPos = shape.y;
    } else {
      xPos = shape.x + shape.radius;
      yPos = shape.y;
    }

    return { xPos, yPos };
  } else if (type === "square") {
    if (lastId && lines[lastId].endId === null) {
      xPos = shape.x;
      yPos = shape.y + shape.height / 2;
    } else {
      xPos = shape.x + shape.width;
      yPos = shape.y + shape.height / 2;
    }
    return { xPos, yPos };
  }

  return { xPos, yPos };
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
