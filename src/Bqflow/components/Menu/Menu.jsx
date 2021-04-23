import React from "react";
import {
  useShapes,
  addSwimLane,
  saveDiagram,
  reset,
  removeSwimlane,
  deleteSelected,
} from "../../state/state";
import { deleteStartPoint, setInitialPoint } from "../../state/lineState";
import { copy, cut, past } from "../../state/ccp";

const Menu = ({ clickedCan }) => {
  const {
    selectedSwimlane,
    lastSwimlaneAdded,
    swimlanes,
    menu,
    copiedShape,
  } = useShapes((state) => state);

  const { show, x, y, propertyWrapper } = menu;
  let list = null;

  if (!show) return null;

  if (propertyWrapper) {
    list = (
      <>
        <li onClick={() => addSwimLane()}>Add Swimlane</li>
        <li onClick={saveDiagram}>Save</li>
        <li onClick={reset}>Reset</li>
      </>
    );
  } else if (Object.entries(swimlanes).length) {
    list = (
      <>
        {Object.entries(swimlanes).length > 1 && (
          <>
            <li onClick={() => addSwimLane("above")}>Add Swimlane Above</li>
            <li onClick={() => addSwimLane("below")}>Add Swimlane Below</li>
          </>
        )}
        <li onClick={() => addSwimLane("top")}>Add Swimlane At Top</li>
        <li onClick={() => addSwimLane("bottom")}>Add Swimlane At Bottom</li>
        {Object.entries(copiedShape.shape).length >= 1 ? (
          <li onClick={() => past()}>Paste</li>
        ) : null}
        <li onClick={() => removeSwimlane(selectedSwimlane)}>
          Delete Swimlane
        </li>
        <li onClick={saveDiagram}>Save</li>
        <li onClick={reset}>Reset</li>
      </>
    );
  } else {
    list = (
      <>
        <li onClick={() => addSwimLane()}>Add Swimlane</li>
        <li onClick={saveDiagram}>Save</li>
        <li onClick={reset}>Reset</li>
      </>
    );
  }

  if (
    Object.keys(swimlanes).includes(selectedSwimlane) &&
    selectedSwimlane &&
    swimlanes[selectedSwimlane].selected
  ) {
    list = (
      <>
        <li
          onClick={() =>
            setInitialPoint(
              swimlanes[selectedSwimlane].shapes[
                swimlanes[selectedSwimlane].selected
              ],
              swimlanes[selectedSwimlane].selected,
              selectedSwimlane
            )
          }
        >
          Connect
        </li>
        {/* <li onClick={() => deleteStartPoint(selectedSwimlane)}>
          Delete Start Point
        </li> */}

        {Object.entries(copiedShape.shape) && (
          <>
            <li
              onClick={() =>
                cut(
                  selectedSwimlane,
                  swimlanes[selectedSwimlane].selected,
                  swimlanes[selectedSwimlane].shapes[
                    swimlanes[selectedSwimlane].selected
                  ]
                )
              }
            >
              Cut
            </li>
            <li
              onClick={() =>
                copy(
                  selectedSwimlane,
                  swimlanes[selectedSwimlane].selected,
                  swimlanes[selectedSwimlane].shapes[
                    swimlanes[selectedSwimlane].selected
                  ]
                )
              }
            >
              Copy
            </li>
          </>
        )}
        <li onClick={() => deleteSelected(selectedSwimlane)}>Delete</li>
      </>
    );
  }

  return (
    <ul className="menu" style={{ left: x, top: y }}>
      {list}
    </ul>
  );
};

export default Menu;
