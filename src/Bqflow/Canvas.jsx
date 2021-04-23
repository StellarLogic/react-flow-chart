import React, { useRef, createRef, useCallback } from "react";
import { Layer, Stage } from "react-konva";
import {
  clearSelection,
  createCircle,
  createRectangle,
  createSquare,
  removeSwimlane,
  setState,
  updateDescription,
} from "./state/state";
import { DRAG_DATA_KEY, SHAPE_TYPES } from "./state/constants";
import { Shape } from "./Shape";
import { Line } from "./shapes/Line";
import { selectSwimLane } from "./state/ccp";

const handleDragOver = (event) => event.preventDefault();

const Canvas = ({ id: swimlaneId, swimlane, index, childRef }) => {
  const shapes = swimlane && Object.entries(swimlane.shapes);
  const linesArr = swimlane && Object.entries(swimlane.lines);

  const mainRef = useRef();
  const stageRef = useRef();

  React.useEffect(() => {
    // console.log(`stageRef`, stageRef.current);
    // childRef(mainRef.current);
  }, []);

  const handleDrop = useCallback(
    (event) => {
      const draggedData = event.nativeEvent.dataTransfer.getData(DRAG_DATA_KEY);
      if (draggedData) {
        const {
          offsetX,
          offsetY,
          type,
          clientHeight,
          clientWidth,
          text,
        } = JSON.parse(draggedData);
        stageRef.current.setPointersPositions(event);

        const coords = stageRef.current.getPointerPosition();

        if (type === SHAPE_TYPES.RECTANGLE.type) {
          // rectangle x, y is at the top,left corner
          createRectangle(swimlaneId, {
            x: coords.x - offsetX,
            y: coords.y - offsetY,
            text,
          });
        } else if (type === SHAPE_TYPES.CIRCLE.type) {
          // circle x, y is at the center of the circle
          createCircle(swimlaneId, {
            x: coords.x - (offsetX - clientWidth / 2),
            y: coords.y - (offsetY - clientHeight / 2),
            text,
          });
        } else if (type === SHAPE_TYPES.SQUARE.type) {
          createSquare(swimlaneId, {
            x: coords.x - offsetX,
            y: coords.y - offsetY,
            text,
          });
        }
      }
    },
    [swimlaneId]
  );

  const handleStepEditShow = (e) => {
    setState((state) => {
      state.swimlanes[swimlaneId].step.editing = true;
    });
  };

  const handleStepEdit = (e) => {
    setState((state) => {
      state.swimlanes[swimlaneId].step.value = e.target.value;
    });
  };

  const handleEditSumit = (e) => {
    e.preventDefault();
    setState((state) => {
      state.swimlanes[swimlaneId].step.editing = false;
    });
  };

  return (
    <main
      className="canvas"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      data-attr={swimlaneId}
      ref={mainRef}
      onContextMenu={() => childRef(mainRef.current)}
    >
      <div className="top">
        <h2 className="desc title">Description</h2>
        <h2 className="process title">Process</h2>
      </div>
      <div className="bottom">
        <div className="swim-no">
          <p onClick={handleStepEditShow}>
            {swimlane.step.value}-{swimlane.place}
          </p>
          {swimlane.step.editing && (
            <form className="edit-step" onSubmit={handleEditSumit}>
              <input
                type="text"
                onChange={handleStepEdit}
                defaultValue={swimlane.step.value}
              />
            </form>
          )}
        </div>
        <div className="desc">
          <textarea
            defaultValue={swimlane.desc}
            spellCheck="false"
            onChange={(e) => updateDescription(e.target.value, swimlaneId)}
          />
        </div>
        <Stage
          ref={stageRef}
          width={window.innerWidth - (250 + 180)}
          height={swimlane.canvas.height || 350}
          onClick={(e) => {
            clearSelection(swimlaneId);
            selectSwimLane(e, swimlaneId);
          }}
        >
          <Layer>
            {shapes.length > 0 &&
              shapes.map(([key, shape]) => (
                <Shape
                  key={key}
                  shape={{ ...shape, id: key }}
                  swimlaneId={swimlaneId}
                />
              ))}
            {/* <Line
              {...{
                points: [209, 144.5, 236, 144.5, 236, 270.5, 472, 270.5],
              }}
            /> */}
            {linesArr.length > 0 &&
              linesArr.map(([key, line]) => <Line key={key} {...line} />)}
          </Layer>
        </Stage>
      </div>
    </main>
  );
};

export default Canvas;
