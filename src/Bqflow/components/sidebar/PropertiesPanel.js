import React, { useCallback } from "react";
import { setInitialPoint } from "../../state/lineState";

import {
  useShapes,
  updateAttribute,
  deleteSelected,
  updateText,
} from "../../state/state";
import { deleteStartPoint } from "../../state/lineState";
import { copy, cut } from "../../state/ccp";

const shapeSelector = (state) => ({
  selectedSwimlane: state.selectedSwimlane,
  swimlanes: state.swimlanes,
});

export function PropertiesPanel() {
  const state = useShapes((state) => state);
  const selectedShape = useShapes(shapeSelector);

  const updateAttr = useCallback((event) => {
    const attr = event.target.name;
    updateAttribute(attr, event.target.value);
  }, []);

  const swimlane = state.swimlanes[state.selectedSwimlane];
  const shape = swimlane.shapes[swimlane.selected];
  const lastId = swimlane.lastId;
  const lineLine = swimlane.lines[lastId];

  return (
    <aside className="panel">
      <h2>Properties</h2>
      <div className="properties">
        {selectedShape ? (
          <>
            <div className="key">
              Type <span className="value">{selectedShape.type}</span>
            </div>

            <div className="key">
              Stroke{" "}
              <input
                className="value"
                name="stroke"
                type="color"
                value={selectedShape.stroke}
                onChange={updateAttr}
              />
            </div>
            <div className="key">
              Fill{" "}
              <input
                className="value"
                name="fill"
                type="color"
                value={selectedShape.fill}
                onChange={updateAttr}
              />
            </div>
            <div className="text-update">
              <label htmlFor="text">Update Text</label>
              <input
                className="text"
                id="text"
                onChange={(e) =>
                  updateText(
                    e.target.value,
                    state.selectedSwimlane,
                    swimlane.selected
                  )
                }
                defaultValue={shape ? shape.type.text : ""}
              />
            </div>
            <div className="side-buttons-parent">
              Actions{" "}
              <div className="side-buttons">
                <button
                  onClick={(e) =>
                    setInitialPoint(
                      shape,
                      swimlane.selected,
                      state.selectedSwimlane
                    )
                  }
                >
                  Connect
                </button>
              </div>
              {lastId && lineLine.endId == null && (
                <div className="side-buttons">
                  <button
                    onClick={() =>
                      deleteStartPoint(swimlane, state.selectedSwimlane)
                    }
                  >
                    Delete Start point
                  </button>
                </div>
              )}
              <div className="side-buttons">
                <button
                  onClick={() =>
                    cut(
                      selectedShape.selectedSwimlane,
                      swimlane.selected,
                      shape
                    )
                  }
                >
                  Cut
                </button>
              </div>
              <div className="side-buttons">
                <button
                  onClick={() =>
                    copy(
                      selectedShape.selectedSwimlane,
                      swimlane.selected,
                      shape
                    )
                  }
                >
                  Copy
                </button>
              </div>
              <div className="side-buttons">
                <button
                  onClick={() => deleteSelected(selectedShape.selectedSwimlane)}
                >
                  Delete
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-data">Nothing is selected</div>
        )}
      </div>
    </aside>
  );
}
